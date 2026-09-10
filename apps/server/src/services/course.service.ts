import type {
  CourseDto,
  ElectiveBasketType,
  ElectiveGroupDto,
  SemesterTermType,
  CourseTypeCategory,
} from "@jumca/shared";
import prisma from "@/config/prisma.js";
import { ApiError } from "@/utils/ApiError.js";
import { SemesterTerm, CourseType, ElectiveBasket } from "@/generated/enums.js";
import type { Course, SemesterMapping, Elective } from "@/generated/client.js";

type FullCourse = Course & {
  semesterMapping: SemesterMapping | null;
  elective: Elective | null;
};

interface GetCoursesOptions {
  semester?: string;
  type?: string;
  isElective?: boolean | string;
}

interface GetElectivesOptions {
  semester?: string;
  basket?: string;
}

export class CourseService {
  private mapSemesterTerm(sem?: string): SemesterTerm | undefined {
    if (!sem) return undefined;
    const cleaned = sem.trim().toUpperCase();

    if (cleaned === "0" || cleaned === "BRIDGE") return SemesterTerm.BRIDGE;
    if (cleaned === "1" || cleaned === "SEM_1" || cleaned === "SEM1") return SemesterTerm.SEM_1;
    if (cleaned === "2" || cleaned === "SEM_2" || cleaned === "SEM2") return SemesterTerm.SEM_2;
    if (cleaned === "3" || cleaned === "SEM_3" || cleaned === "SEM3") return SemesterTerm.SEM_3;
    if (cleaned === "4" || cleaned === "SEM_4" || cleaned === "SEM4") return SemesterTerm.SEM_4;

    return undefined;
  }

  private mapCourseType(type?: string): CourseType | undefined {
    if (!type) return undefined;
    const cleaned = type.trim().toUpperCase();
    if (cleaned === "THEORY") return CourseType.THEORY;
    if (cleaned === "SESSIONAL") return CourseType.SESSIONAL;
    return undefined;
  }

  private mapElectiveBasket(basket?: string): ElectiveBasket | undefined {
    if (!basket) return undefined;
    const cleaned = basket.trim().toUpperCase();
    if (cleaned === "ELECTIVE_I" || cleaned === "I" || cleaned === "1") return ElectiveBasket.ELECTIVE_I;
    if (cleaned === "ELECTIVE_II" || cleaned === "II" || cleaned === "2") return ElectiveBasket.ELECTIVE_II;
    if (cleaned === "ELECTIVE_III" || cleaned === "III" || cleaned === "3") return ElectiveBasket.ELECTIVE_III;
    return undefined;
  }

  async getCourses({ semester, type, isElective }: GetCoursesOptions): Promise<CourseDto[]> {
    const semTerm = this.mapSemesterTerm(semester);
    const courseType = this.mapCourseType(type);

    const where: Record<string, unknown> = {};

    if (semTerm || courseType) {
      // semesterMapping is a to-one relation: Prisma requires the `is` wrapper.
      where.semesterMapping = {
        is: {
          ...(semTerm ? { semester: semTerm } : {}),
          ...(courseType ? { type: courseType } : {}),
        },
      };
    }

    if (isElective === true || isElective === "true") {
      where.elective = { isNot: null };
    } else if (isElective === false || isElective === "false") {
      where.elective = { is: null };
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        semesterMapping: true,
        elective: true,
      },
      orderBy: [
        { code: "asc" },
      ],
    });

    return courses.map(this.toCourseDto);
  }

  async getElectives({ semester, basket, userId }: GetElectivesOptions & { userId?: string }): Promise<{
    data: ElectiveGroupDto[];
    userSelections?: Record<string, CourseDto>;
  }> {
    const basketEnum = this.mapElectiveBasket(basket);
    const semTerm = this.mapSemesterTerm(semester);
    const semString = semester ? semester.replace(/sem_?/i, "").trim() : undefined;

    const where: Record<string, unknown> = {};

    if (basketEnum) {
      where.basket = basketEnum;
    }

    if (semester) {
      // `course` and `semesterMapping` are to-one relations: Prisma requires the `is` wrapper.
      where.OR = [
        ...(semString ? [{ semester: semString }] : []),
        ...(semTerm
          ? [{ course: { is: { semesterMapping: { is: { semester: semTerm } } } } }]
          : []),
      ];
    }

    const electives = await prisma.elective.findMany({
      where,
      include: {
        course: {
          include: {
            semesterMapping: true,
            elective: true,
          },
        },
      },
      orderBy: [
        { basket: "asc" },
        { courseCode: "asc" },
      ],
    });

    // Group by basket
    const groupedMap = new Map<ElectiveBasketType, CourseDto[]>();

    for (const el of electives) {
      const basketKey = el.basket as ElectiveBasketType;
      if (!groupedMap.has(basketKey)) {
        groupedMap.set(basketKey, []);
      }
      groupedMap.get(basketKey)!.push(this.toCourseDto(el.course));
    }

    const data: ElectiveGroupDto[] = [];
    const basketOrder: ElectiveBasketType[] = ["ELECTIVE_I", "ELECTIVE_II", "ELECTIVE_III"];

    for (const b of basketOrder) {
      if (groupedMap.has(b)) {
        data.push({
          basket: b,
          semester: semString ?? "",
          courses: groupedMap.get(b)!,
        });
      }
    }

    let userSelections: Record<string, CourseDto> | undefined = undefined;

    if (userId) {
      const selections = await prisma.userElective.findMany({
        where: {
          userId,
          ...(semTerm ? { semester: semTerm } : {}),
        },
        include: {
          course: {
            include: {
              semesterMapping: true,
              elective: true,
            },
          },
        },
      });

      if (selections.length > 0) {
        userSelections = {};
        for (const sel of selections) {
          userSelections[sel.basket] = this.toCourseDto(sel.course);
        }
      }
    }

    return { data, userSelections };
  }

  async saveUserElective({
    userId,
    courseCode,
    basket,
    semester = "SEM_3",
  }: {
    userId: string;
    courseCode: string;
    basket: string;
    semester?: string;
  }) {
    const basketEnum = this.mapElectiveBasket(basket);
    if (!basketEnum) {
      throw new ApiError(400, "Invalid elective basket specified");
    }

    const semTerm = this.mapSemesterTerm(semester) || SemesterTerm.SEM_3;

    const course = await prisma.course.findUnique({
      where: { code: courseCode },
      include: {
        semesterMapping: true,
        elective: true,
      },
    });

    if (!course) {
      throw new ApiError(404, `Course with code '${courseCode}' not found`);
    }

    const saved = await prisma.userElective.upsert({
      where: {
        userId_basket_semester: {
          userId,
          basket: basketEnum,
          semester: semTerm,
        },
      },
      update: {
        courseCode,
      },
      create: {
        userId,
        courseCode,
        basket: basketEnum,
        semester: semTerm,
      },
      include: {
        course: {
          include: {
            semesterMapping: true,
            elective: true,
          },
        },
      },
    });

    return {
      id: saved.id,
      userId: saved.userId,
      courseCode: saved.courseCode,
      basket: saved.basket as ElectiveBasketType,
      semester: saved.semester as SemesterTermType,
      course: this.toCourseDto(saved.course),
    };
  }

  private toCourseDto = (course: FullCourse): CourseDto => ({
    code: course.code,
    name: course.name,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    semesterMapping: course.semesterMapping
      ? {
          id: course.semesterMapping.id,
          year: course.semesterMapping.year,
          semester: course.semesterMapping.semester as SemesterTermType,
          semesterNumber: course.semesterMapping.semesterNumber,
          type: course.semesterMapping.type as CourseTypeCategory,
          periodL: course.semesterMapping.periodL,
          periodT: course.semesterMapping.periodT,
          periodP: course.semesterMapping.periodP,
          examMarks: course.semesterMapping.examMarks,
          sessionalMarks: course.semesterMapping.sessionalMarks,
          totalMarks: course.semesterMapping.totalMarks,
          creditPoints: course.semesterMapping.creditPoints,
          courseCode: course.semesterMapping.courseCode,
        }
      : null,
    elective: course.elective
      ? {
          id: course.elective.id,
          basket: course.elective.basket as ElectiveBasketType,
          semester: course.elective.semester,
          courseCode: course.elective.courseCode,
        }
      : null,
  });
}

export default new CourseService();
