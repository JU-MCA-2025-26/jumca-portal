export type SemesterTermType = "BRIDGE" | "SEM_1" | "SEM_2" | "SEM_3" | "SEM_4";
export type ElectiveBasketType = "ELECTIVE_I" | "ELECTIVE_II" | "ELECTIVE_III";
export type CourseTypeCategory = "THEORY" | "SESSIONAL";

export interface SemesterMappingDto {
  id: string;
  year: number;
  semester: SemesterTermType;
  semesterNumber: number;
  type: CourseTypeCategory;
  periodL: number;
  periodT: number;
  periodP: number;
  examMarks: number;
  sessionalMarks: number;
  totalMarks: number;
  creditPoints: number;
  courseCode: string;
}

export interface ElectiveDto {
  id: string;
  basket: ElectiveBasketType;
  semester: string;
  courseCode: string;
}

export interface CourseDto {
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  semesterMapping: SemesterMappingDto | null;
  elective: ElectiveDto | null;
}

export interface ElectiveGroupDto {
  basket: ElectiveBasketType;
  semester: string;
  courses: CourseDto[];
}

export interface UserElectiveDto {
  id: string;
  userId: string;
  courseCode: string;
  basket: ElectiveBasketType;
  semester: SemesterTermType;
  course?: CourseDto;
}

export type UserElectiveSelectionMapDto = Partial<Record<ElectiveBasketType, CourseDto>>;

export interface GetCoursesQueryParams {
  semester?: SemesterTermType | string;
  type?: CourseTypeCategory;
  isElective?: boolean | string;
}

export interface GetElectivesQueryParams {
  semester?: string;
  basket?: ElectiveBasketType;
}

export interface SaveElectiveRequestBody {
  courseCode: string;
  basket: ElectiveBasketType;
  semester?: string;
}

export interface GetCoursesResponse {
  success: boolean;
  data: CourseDto[];
}

export interface GetElectivesResponse {
  success: boolean;
  data: ElectiveGroupDto[];
  userSelections?: UserElectiveSelectionMapDto;
}

export interface SaveElectiveResponse {
  success: boolean;
  message: string;
  data: UserElectiveDto;
}
