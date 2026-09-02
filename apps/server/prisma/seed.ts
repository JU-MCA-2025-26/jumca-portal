// bcrypt does not ship TypeScript declarations in this project.
// @ts-expect-error The package is used through its runtime API.
import bcrypt from "bcrypt";
import prisma from "../src/config/prisma.js";
import { $Enums } from "../src/generated/client.js";

async function main() {
  const password = await bcrypt.hash("admin123", 12);

  let adminUser = await prisma.user.findUnique({
    where: {
      email: "admin@jumca.com",
    },
  });

  if (adminUser) {
    console.log("Administrator already exists. Reusing admin user.");

    adminUser = await prisma.user.update({
      where: {
        id: adminUser.id,
      },
      data: {
        fullName: "Administrator",
        password,
        role: $Enums.Role.ADMIN,
        batch: "2025-27",
        isActive: true,
      },
    });
  } else {
    adminUser = await prisma.user.create({
      data: {
        fullName: "Administrator",
        email: "admin@jumca.com",
        rollNumber: "002510503000",
        password,
        role: $Enums.Role.ADMIN,
        batch: "2025-27",
      },
    });

    console.log("✓ Administrator created.");
  }

  console.log("Administrator created.");

  // USERS
  const studentPassword = await bcrypt.hash("student123", 12);
  const alumniPassword = await bcrypt.hash("alumni123", 12);

  const mcaStudentsData = [
    { rollNumber: "002510503001", fullName: "Soumi Bera" },
    { rollNumber: "002510503002", fullName: "Ankita Jana" },
    { rollNumber: "002510503003", fullName: "Khushi Purohit" },
    { rollNumber: "002510503004", fullName: "Ankan Baidya" },
    { rollNumber: "002510503005", fullName: "Ratul Chakraborty" },
    { rollNumber: "002510503006", fullName: "Rahul Thakur" },
    { rollNumber: "002510503007", fullName: "Aviraj Chhetri" },
    { rollNumber: "002510503008", fullName: "Arunima Maitra" },
    { rollNumber: "002510503009", fullName: "SK MD Raihan" },
    { rollNumber: "002510503010", fullName: "Bappa Das" },
    { rollNumber: "002510503011", fullName: "Dibyendu Mal" },
    { rollNumber: "002510503012", fullName: "Bijan Roy" },
    { rollNumber: "002510503013", fullName: "Ayantika Manna" },
    { rollNumber: "002510503014", fullName: "Supriya Bandhu Shit" },
    { rollNumber: "002510503015", fullName: "Rajdeep Paul" },
    { rollNumber: "002510503016", fullName: "SK Kaif Rahaman" },
    { rollNumber: "002510503017", fullName: "Subhadip Banerjee" },
    { rollNumber: "002510503018", fullName: "Pritam Pandit" },
    { rollNumber: "002510503019", fullName: "Baishakhi Shiuly" },
    { rollNumber: "002510503020", fullName: "Sayandeep Mukherjee" },
    { rollNumber: "002510503021", fullName: "Anubhav Chakraborty" },
    { rollNumber: "002510503022", fullName: "Debangan Ganguly" },
    { rollNumber: "002510503023", fullName: "Debasmita Chakraborty" },
    { rollNumber: "002510503024", fullName: "Anirudra Adhikary" },
    { rollNumber: "002510503025", fullName: "Bhaskar Samanta" },
    { rollNumber: "002510503026", fullName: "Soutrik Halder" },
    { rollNumber: "002510503027", fullName: "Subhayu Ganguly" },
    { rollNumber: "002510503028", fullName: "Soumyadeep Paul" },
    { rollNumber: "002510503029", fullName: "Samit Kar" },
    { rollNumber: "002510503030", fullName: "Kinjal Choudhary" },
    { rollNumber: "002510503031", fullName: "Debol Mondal" },
    { rollNumber: "002510503032", fullName: "Souvik Naskar" },
    { rollNumber: "002510503033", fullName: "Snehasish Sarkar" },
    { rollNumber: "002510503034", fullName: "Debsankar Dhara" },
    { rollNumber: "002510503035", fullName: "Joydeb Soren" },
    { rollNumber: "002510503036", fullName: "Rakesh Ghosh" },
    { rollNumber: "002510503037", fullName: "Supratim Lala" },
    { rollNumber: "002510503038", fullName: "Rudra Narayan Konar" },
    { rollNumber: "002510503039", fullName: "MD Rashid Imran" },
    { rollNumber: "002510503040", fullName: "Mainak Mondal" },
    { rollNumber: "002510503041", fullName: "Jit Halder" },
    { rollNumber: "002510503042", fullName: "Rohit Maji" },
    { rollNumber: "002510503043", fullName: "Tashif Ahmed" },
    { rollNumber: "002510503044", fullName: "Srimanta Chatterjee" },
    { rollNumber: "002510503045", fullName: "Sounak Garai" },
    { rollNumber: "002510503046", fullName: "Ahamod Mondal" },
    { rollNumber: "002510503047", fullName: "Pritam Das" },
    { rollNumber: "002510503048", fullName: "Anirban Dutta" },
    { rollNumber: "002510503049", fullName: "Megha Orano" },
    { rollNumber: "002510503050", fullName: "Sangita Paul" },
    { rollNumber: "002510503051", fullName: "Arnab Pratihar" },
    { rollNumber: "002510503052", fullName: "Prantik Bhattacharya" },
    { rollNumber: "002510503053", fullName: "Debjit Mahato" },
    { rollNumber: "002510503054", fullName: "Paromita Dey" },
    { rollNumber: "002510503055", fullName: "Rupsha Paul" },
    { rollNumber: "002510503056", fullName: "Avishek Patra" },
    { rollNumber: "002510503057", fullName: "Sourabh Barman" },
    { rollNumber: "002510503058", fullName: "Binoy Hembram" },
    { rollNumber: "102410503002", fullName: "Gourav Karmakar" },
  ];

  const createdStudents = [];
  for (const s of mcaStudentsData) {
    const email = `${s.rollNumber}@jumca.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        fullName: s.fullName,
        rollNumber: s.rollNumber,
        batch: "2025-27",
        role: $Enums.Role.STUDENT,
        currentYear: 2,
        currentSemester: $Enums.SemesterTerm.SEM_3,
      },
      create: {
        fullName: s.fullName,
        email,
        rollNumber: s.rollNumber,
        password: studentPassword,
        role: $Enums.Role.STUDENT,
        batch: "2025-27",
        currentYear: 2,
        currentSemester: $Enums.SemesterTerm.SEM_3,
      },
    });
    createdStudents.push(user);

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        bio: `MCA Student at Jadavpur University (Batch 2025-27)`,
      },
    });
  }

  const student1 = createdStudents[0];
  const student2 = createdStudents[1];
  const student3 = createdStudents[2];

  const alumni1 = await prisma.user.upsert({
    where: {
      email: "alumni1@jumca.com",
    },
    update: {},
    create: {
      fullName: "Ananya Roy",
      email: "alumni1@jumca.com",
      rollNumber: "002410503001",
      password: alumniPassword,
      role: $Enums.Role.ALUMNI,
      batch: "2024-26",
    },
  });

  const alumni2 = await prisma.user.upsert({
    where: {
      email: "alumni2@jumca.com",
    },
    update: {},
    create: {
      fullName: "Sourav Mukherjee",
      email: "alumni2@jumca.com",
      rollNumber: "002410503002",
      password: alumniPassword,
      role: $Enums.Role.ALUMNI,
      batch: "2024-26",
    },
  });

  await prisma.profile.upsert({
    where: {
      userId: alumni1.id,
    },
    update: {},
    create: {
      userId: alumni1.id,
      bio: "Software Engineer and JUMCA alumni.",
      github: "https://github.com/ananya-roy",
      leetcode: "https://leetcode.com/ananya-roy",
    },
  });

  await prisma.profile.upsert({
    where: {
      userId: alumni2.id,
    },
    update: {},
    create: {
      userId: alumni2.id,
      bio: "Backend engineer passionate about distributed systems.",
      github: "https://github.com/sourav-m",
      codeforces: "https://codeforces.com/profile/sourav-m",
    },
  });

  // ALUMNI
  await prisma.profile.update({
    where: { userId: alumni1.id },
    data: {
      company: "Google",
      jobRole: "Senior Software Engineer",
      location: "Bangalore",
      tags: ["ML", "Infrastructure"],
      graduationYear: 2020,
      openToConnect: true,
      linkedinUrl: "https://linkedin.com/in/ananya-roy",
    },
  });

  await prisma.profile.update({
    where: { userId: alumni2.id },
    data: {
      company: "Microsoft Research",
      jobRole: "Research Engineer",
      location: "Hyderabad",
      tags: ["AI", "NLP"],
      graduationYear: 2019,
      openToConnect: true,
      linkedinUrl: "https://linkedin.com/in/sourav-mukherjee",
    },
  });

  const alumniPassword2 = await bcrypt.hash("alumni123", 12);

  const extraAlumni: Array<{
    fullName: string;
    email: string;
    rollNumber: string;
    batch: string;
    company: string;
    jobRole: string;
    location: string;
    tags: string[];
    graduationYear: number;
    openToConnect: boolean;
  }> = [
    {
      fullName: "Siddharth Rao",
      email: "alumni3@jumca.com",
      rollNumber: "002310503001",
      batch: "2019-21",
      company: "Amazon",
      jobRole: "SDE-2",
      location: "Seattle, USA",
      tags: ["Distributed Systems", "AWS"],
      graduationYear: 2021,
      openToConnect: false,
    },
    {
      fullName: "Meera Joshi",
      email: "alumni4@jumca.com",
      rollNumber: "002310503002",
      batch: "2016-18",
      company: "Stripe",
      jobRole: "Staff Engineer",
      location: "San Francisco",
      tags: ["Fintech", "Payments"],
      graduationYear: 2018,
      openToConnect: true,
    },
    {
      fullName: "Karan Khanna",
      email: "alumni5@jumca.com",
      rollNumber: "002310503003",
      batch: "2018-20",
      company: "Flipkart",
      jobRole: "SDE-1",
      location: "Bangalore",
      tags: ["Backend", "Java"],
      graduationYear: 2020,
      openToConnect: true,
    },
    {
      fullName: "Divya Menon",
      email: "alumni6@jumca.com",
      rollNumber: "002310503004",
      batch: "2017-19",
      company: "Goldman Sachs",
      jobRole: "VP Technology",
      location: "Mumbai",
      tags: ["Trading Systems", "C++"],
      graduationYear: 2019,
      openToConnect: false,
    },
    {
      fullName: "Abhishek Tiwari",
      email: "alumni7@jumca.com",
      rollNumber: "002310503005",
      batch: "2015-17",
      company: "Apple",
      jobRole: "Principal Engineer",
      location: "Cupertino, USA",
      tags: ["iOS", "Swift"],
      graduationYear: 2017,
      openToConnect: true,
    },
    {
      fullName: "Nisha Gupta",
      email: "alumni8@jumca.com",
      rollNumber: "002310503006",
      batch: "2020-22",
      company: "Zomato",
      jobRole: "Data Scientist",
      location: "Gurgaon",
      tags: ["ML", "Analytics"],
      graduationYear: 2022,
      openToConnect: true,
    },
  ];

  for (const a of extraAlumni) {
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        fullName: a.fullName,
        email: a.email,
        rollNumber: a.rollNumber,
        password: alumniPassword2,
        role: $Enums.Role.ALUMNI,
        batch: a.batch,
      },
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        bio: `${a.jobRole} at ${a.company}. JUMCA Class of ${a.graduationYear}.`,
        company: a.company,
        jobRole: a.jobRole,
        location: a.location,
        tags: a.tags,
        graduationYear: a.graduationYear,
        openToConnect: a.openToConnect,
      },
    });
  }

  console.log("Alumni network profiles seeded.");

  // CONNECT
  await prisma.connectRequest.create({
    data: {
      requesterId: student1.id,
      alumniId: alumni1.id,
      message: "Hi Ananya, I'd love some guidance on breaking into ML infra roles.",
      status: $Enums.ConnectRequestStatus.PENDING,
    },
  });

  await prisma.connectRequest.create({
    data: {
      requesterId: student2.id,
      alumniId: alumni2.id,
      message: "Would appreciate any tips on the Microsoft Research interview process.",
      status: $Enums.ConnectRequestStatus.APPROVED,
    },
  });

  console.log("Connect requests seeded.");

  // COURSES
  const coursesData = [
    // Bridge Courses
    { code: "CSE/MCA/T/B11", name: "Fundamentals of Computer Science" },
    { code: "CSE/MCA/T/B12", name: "Basic Electronics" },

    // First Year First Semester - Theory
    {
      code: "CSE/MCA/T/111A",
      name: "Programming Fundamentals and Object Oriented Concepts",
    },
    {
      code: "CSE/MCA/Math/T/112A",
      name: "Mathematical Foundations",
    },
    {
      code: "CSE/MCA/T/113A",
      name: "Management Information Systems",
    },
    {
      code: "CSE/MCA/T/114A",
      name: "Digital Systems",
    },
    {
      code: "CSE/MCA/T/115A",
      name: "Graph theory and Combinatorics",
    },

    // First Year First Semester - Sessional
    {
      code: "CSE/MCA/S/111",
      name: "Computer Programming Lab",
    },
    {
      code: "CSE/MCA/S/112",
      name: "Digital Systems Lab",
    },
    {
      code: "CSE/MCA/Hum/S/113",
      name: "Communication Skills and Language Lab",
    },

    // First Year Second Semester - Theory
    {
      code: "CSE/MCA/T/121A",
      name: "Data Structures and Algorithms",
    },
    {
      code: "CSE/MCA/T/122A",
      name: "Advanced Programming with Java and Python",
    },
    {
      code: "CSE/MCA/T/123A",
      name: "Computer Organization and Architecture",
    },
    {
      code: "CSE/MCA/T/124A",
      name: "Operating Systems",
    },
    {
      code: "CSE/MCA/T/125A",
      name: "Database Management Systems",
    },

    // First Year Second Semester - Sessional
    {
      code: "CSE/MCA/S/121",
      name: "Data Structures and Algorithms Lab",
    },
    {
      code: "CSE/MCA/S/122",
      name: "Operating Systems Lab",
    },
    {
      code: "CSE/MCA/S/123",
      name: "Database Management Systems Lab",
    },
    {
      code: "CSE/MCA/S/124",
      name: "Advanced Programming lab",
    },

    // Second Year First Semester - Theory
    {
      code: "CSE/MCA/T/211A",
      name: "Software Engineering",
    },
    {
      code: "CSE/MCA/T/212A",
      name: "Automata and Language Processors",
    },
    {
      code: "CSE/MCA/T/213A",
      name: "Data Communication and Computer Networks",
    },

    // Second Year First Semester - Sessional
    {
      code: "CSE/MCA/S/211",
      name: "Software Engineering Lab",
    },
    {
      code: "CSE/MCA/S/212",
      name: "Data Communication and Computer Networks Lab",
    },

    // Second Year Second Semester - Sessional
    {
      code: "CSE/MCA/S/221",
      name: "Seminar",
    },
    {
      code: "CSE/MCA/S/222",
      name: "Project",
    },

    // Elective I
    {
      code: "CSE/MCA/T/214A",
      name: "Artificial Intelligence and Applications",
    },
    {
      code: "CSE/MCA/T/214B",
      name: "Machine Learning",
    },
    {
      code: "CSE/MCA/T/214C",
      name: "Pattern Recognition",
    },
    {
      code: "CSE/MCA/T/214D",
      name: "Introduction to Data Science",
    },
    {
      code: "CSE/MCA/T/214E",
      name: "Optimization Techniques",
    },
    {
      code: "CSE/MCA/T/214F",
      name: "Soft Computing",
    },

    // Elective II
    {
      code: "CSE/MCA/T/215A",
      name: "Distributed computing",
    },
    {
      code: "CSE/MCA/T/215B",
      name: "Internet of Things (IOT)",
    },
    {
      code: "CSE/MCA/T/215C",
      name: "Network Security",
    },
    {
      code: "CSE/MCA/T/215D",
      name: "Web Technologies",
    },
    {
      code: "CSE/MCA/T/215E",
      name: "Software Project Management",
    },
    {
      code: "CSE/MCA/T/215F",
      name: "Microprocessors and Embedded systems",
    },

    // Elective III
    {
      code: "CSE/MCA/T/216A",
      name: "Computer Graphics",
    },
    {
      code: "CSE/MCA/T/216B",
      name: "Computer Vision",
    },
    {
      code: "CSE/MCA/T/216C",
      name: "Bioinformatics",
    },
    {
      code: "CSE/MCA/T/216D",
      name: "Information Retrieval",
    },
    {
      code: "CSE/MCA/T/216E",
      name: "Natural Language Processing",
    },
    {
      code: "CSE/MCA/T/216F",
      name: "Multimedia",
    },
    {
      code: "CSE/MCA/T/216G",
      name: "Biometric Systems",
    },
  ];

  for (const course of coursesData) {
    await prisma.course.upsert({
      where: {
        code: course.code,
      },
      update: {
        name: course.name,
      },
      create: {
        code: course.code,
        name: course.name,
      },
    });
  }

  console.log("Courses seeded.");

  // ELECTIVES MAPPING
  const electivesData: { basket: $Enums.ElectiveBasket; courseCode: string }[] = [
    // Elective I
    { basket: $Enums.ElectiveBasket.ELECTIVE_I, courseCode: "CSE/MCA/T/214A" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_I, courseCode: "CSE/MCA/T/214B" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_I, courseCode: "CSE/MCA/T/214C" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_I, courseCode: "CSE/MCA/T/214D" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_I, courseCode: "CSE/MCA/T/214E" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_I, courseCode: "CSE/MCA/T/214F" },

    // Elective II
    { basket: $Enums.ElectiveBasket.ELECTIVE_II, courseCode: "CSE/MCA/T/215A" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_II, courseCode: "CSE/MCA/T/215B" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_II, courseCode: "CSE/MCA/T/215C" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_II, courseCode: "CSE/MCA/T/215D" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_II, courseCode: "CSE/MCA/T/215E" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_II, courseCode: "CSE/MCA/T/215F" },

    // Elective III
    { basket: $Enums.ElectiveBasket.ELECTIVE_III, courseCode: "CSE/MCA/T/216A" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_III, courseCode: "CSE/MCA/T/216B" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_III, courseCode: "CSE/MCA/T/216C" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_III, courseCode: "CSE/MCA/T/216D" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_III, courseCode: "CSE/MCA/T/216E" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_III, courseCode: "CSE/MCA/T/216F" },
    { basket: $Enums.ElectiveBasket.ELECTIVE_III, courseCode: "CSE/MCA/T/216G" },
  ];

  for (const elective of electivesData) {
    await prisma.elective.upsert({
      where: {
        courseCode: elective.courseCode,
      },
      update: {
        basket: elective.basket,
      },
      create: {
        basket: elective.basket,
        courseCode: elective.courseCode,
        semester: "3",
      },
    });
  }

  console.log("Electives seeded.");

  // SEMESTER & YEAR MAPPING WITH DECOMPOSED METRICS (Periods L/T/P, Marks Exam/Sessional/Total, Credit Points)
  const semesterMappingData: {
    courseCode: string;
    year: number;
    semester: $Enums.SemesterTerm;
    semesterNumber: number;
    type: $Enums.CourseType;
    periodL: number;
    periodT: number;
    periodP: number;
    examMarks: number;
    sessionalMarks: number;
    totalMarks: number;
    creditPoints: number;
  }[] = [
    // Bridge Courses (Year 0, Sem 0)
    {
      courseCode: "CSE/MCA/T/B11",
      year: 0,
      semester: $Enums.SemesterTerm.BRIDGE,
      semesterNumber: 0,
      type: $Enums.CourseType.THEORY,
      periodL: 4,
      periodT: 0,
      periodP: 0,
      examMarks: 50,
      sessionalMarks: 0,
      totalMarks: 50,
      creditPoints: 0,
    },
    {
      courseCode: "CSE/MCA/T/B12",
      year: 0,
      semester: $Enums.SemesterTerm.BRIDGE,
      semesterNumber: 0,
      type: $Enums.CourseType.THEORY,
      periodL: 4,
      periodT: 0,
      periodP: 0,
      examMarks: 50,
      sessionalMarks: 0,
      totalMarks: 50,
      creditPoints: 0,
    },

    // First Year First Semester (Year 1, Sem 1) - Theory
    {
      courseCode: "CSE/MCA/T/111A",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_1,
      semesterNumber: 1,
      type: $Enums.CourseType.THEORY,
      periodL: 4,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 4,
    },
    {
      courseCode: "CSE/MCA/Math/T/112A",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_1,
      semesterNumber: 1,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/113A",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_1,
      semesterNumber: 1,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/114A",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_1,
      semesterNumber: 1,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/115A",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_1,
      semesterNumber: 1,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },

    // First Year First Semester - Sessional
    {
      courseCode: "CSE/MCA/S/111",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_1,
      semesterNumber: 1,
      type: $Enums.CourseType.SESSIONAL,
      periodL: 0,
      periodT: 0,
      periodP: 3,
      examMarks: 0,
      sessionalMarks: 100,
      totalMarks: 100,
      creditPoints: 2,
    },
    {
      courseCode: "CSE/MCA/S/112",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_1,
      semesterNumber: 1,
      type: $Enums.CourseType.SESSIONAL,
      periodL: 0,
      periodT: 0,
      periodP: 3,
      examMarks: 0,
      sessionalMarks: 100,
      totalMarks: 100,
      creditPoints: 2,
    },
    {
      courseCode: "CSE/MCA/Hum/S/113",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_1,
      semesterNumber: 1,
      type: $Enums.CourseType.SESSIONAL,
      periodL: 0,
      periodT: 0,
      periodP: 3,
      examMarks: 0,
      sessionalMarks: 100,
      totalMarks: 100,
      creditPoints: 2,
    },

    // First Year Second Semester (Year 1, Sem 2) - Theory
    {
      courseCode: "CSE/MCA/T/121A",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_2,
      semesterNumber: 2,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/122A",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_2,
      semesterNumber: 2,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/123A",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_2,
      semesterNumber: 2,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/124A",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_2,
      semesterNumber: 2,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/125A",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_2,
      semesterNumber: 2,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },

    // First Year Second Semester - Sessional
    {
      courseCode: "CSE/MCA/S/121",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_2,
      semesterNumber: 2,
      type: $Enums.CourseType.SESSIONAL,
      periodL: 0,
      periodT: 0,
      periodP: 3,
      examMarks: 0,
      sessionalMarks: 100,
      totalMarks: 100,
      creditPoints: 2,
    },
    {
      courseCode: "CSE/MCA/S/122",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_2,
      semesterNumber: 2,
      type: $Enums.CourseType.SESSIONAL,
      periodL: 0,
      periodT: 0,
      periodP: 3,
      examMarks: 0,
      sessionalMarks: 100,
      totalMarks: 100,
      creditPoints: 2,
    },
    {
      courseCode: "CSE/MCA/S/123",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_2,
      semesterNumber: 2,
      type: $Enums.CourseType.SESSIONAL,
      periodL: 0,
      periodT: 0,
      periodP: 3,
      examMarks: 0,
      sessionalMarks: 100,
      totalMarks: 100,
      creditPoints: 2,
    },
    {
      courseCode: "CSE/MCA/S/124",
      year: 1,
      semester: $Enums.SemesterTerm.SEM_2,
      semesterNumber: 2,
      type: $Enums.CourseType.SESSIONAL,
      periodL: 0,
      periodT: 0,
      periodP: 3,
      examMarks: 0,
      sessionalMarks: 100,
      totalMarks: 100,
      creditPoints: 2,
    },

    // Second Year First Semester (Year 2, Sem 3) - Theory
    {
      courseCode: "CSE/MCA/T/211A",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/212A",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/213A",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },

    // Second Year First Semester - Sessional
    {
      courseCode: "CSE/MCA/S/211",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.SESSIONAL,
      periodL: 0,
      periodT: 0,
      periodP: 3,
      examMarks: 0,
      sessionalMarks: 100,
      totalMarks: 100,
      creditPoints: 2,
    },
    {
      courseCode: "CSE/MCA/S/212",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.SESSIONAL,
      periodL: 0,
      periodT: 0,
      periodP: 3,
      examMarks: 0,
      sessionalMarks: 100,
      totalMarks: 100,
      creditPoints: 2,
    },

    // Elective I (Year 2, Sem 3)
    {
      courseCode: "CSE/MCA/T/214A",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/214B",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/214C",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/214D",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/214E",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/214F",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },

    // Elective II (Year 2, Sem 3)
    {
      courseCode: "CSE/MCA/T/215A",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/215B",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/215C",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/215D",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/215E",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/215F",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },

    // Elective III (Year 2, Sem 3)
    {
      courseCode: "CSE/MCA/T/216A",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/216B",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/216C",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/216D",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/216E",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/216F",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },
    {
      courseCode: "CSE/MCA/T/216G",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_3,
      semesterNumber: 3,
      type: $Enums.CourseType.THEORY,
      periodL: 3,
      periodT: 0,
      periodP: 0,
      examMarks: 100,
      sessionalMarks: 0,
      totalMarks: 100,
      creditPoints: 3,
    },

    // Second Year Second Semester (Year 2, Sem 4) - Sessional
    {
      courseCode: "CSE/MCA/S/221",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_4,
      semesterNumber: 4,
      type: $Enums.CourseType.SESSIONAL,
      periodL: 0,
      periodT: 0,
      periodP: 3,
      examMarks: 0,
      sessionalMarks: 100,
      totalMarks: 100,
      creditPoints: 2,
    },
    {
      courseCode: "CSE/MCA/S/222",
      year: 2,
      semester: $Enums.SemesterTerm.SEM_4,
      semesterNumber: 4,
      type: $Enums.CourseType.SESSIONAL,
      periodL: 0,
      periodT: 0,
      periodP: 9,
      examMarks: 0,
      sessionalMarks: 300,
      totalMarks: 300,
      creditPoints: 6,
    },
  ];

  for (const mapping of semesterMappingData) {
    await prisma.semesterMapping.upsert({
      where: {
        courseCode: mapping.courseCode,
      },
      update: {
        year: mapping.year,
        semester: mapping.semester,
        semesterNumber: mapping.semesterNumber,
        type: mapping.type,
        periodL: mapping.periodL,
        periodT: mapping.periodT,
        periodP: mapping.periodP,
        examMarks: mapping.examMarks,
        sessionalMarks: mapping.sessionalMarks,
        totalMarks: mapping.totalMarks,
        creditPoints: mapping.creditPoints,
      },
      create: {
        courseCode: mapping.courseCode,
        year: mapping.year,
        semester: mapping.semester,
        semesterNumber: mapping.semesterNumber,
        type: mapping.type,
        periodL: mapping.periodL,
        periodT: mapping.periodT,
        periodP: mapping.periodP,
        examMarks: mapping.examMarks,
        sessionalMarks: mapping.sessionalMarks,
        totalMarks: mapping.totalMarks,
        creditPoints: mapping.creditPoints,
      },
    });
  }

  console.log("Semester mappings seeded.");

  // ACADEMIC RESOURCES
  await prisma.resource.createMany({
    data: [
      {
        title: "DSA Complete Notes",
        description:
          "Complete notes covering arrays, linked lists, stacks, queues, trees and graphs.",
        fileUrl: "https://example.com/resources/dsa-complete-notes.pdf",
        category: $Enums.ResourceCategory.NOTES,
        approved: true,
        courseCode: "CSE/MCA/T/121A",
        uploaderId: adminUser.id,
      },
      {
        title: "DSA Previous Year Questions",
        description: "Collection of previous year university questions for DSA.",
        fileUrl: "https://example.com/resources/dsa-pyq.pdf",
        category: $Enums.ResourceCategory.PREVIOUS_YEAR_QUESTION,
        approved: true,
        courseCode: "CSE/MCA/T/121A",
        uploaderId: adminUser.id,
      },
      {
        title: "DBMS Revision Notes",
        description: "SQL, normalization, transactions, indexing and database architecture.",
        fileUrl: "https://example.com/resources/dbms-notes.pdf",
        category: $Enums.ResourceCategory.NOTES,
        approved: true,
        courseCode: "CSE/MCA/T/125A",
        uploaderId: adminUser.id,
      },
      {
        title: "DBMS Previous Year Questions",
        description: "Previous examination questions for DBMS.",
        fileUrl: "https://example.com/resources/dbms-pyq.pdf",
        category: $Enums.ResourceCategory.PREVIOUS_YEAR_QUESTION,
        approved: true,
        courseCode: "CSE/MCA/T/125A",
        uploaderId: adminUser.id,
      },
      {
        title: "Operating Systems Notes",
        description: "Processes, threads, scheduling, memory management and file systems.",
        fileUrl: "https://example.com/resources/os-notes.pdf",
        category: $Enums.ResourceCategory.NOTES,
        approved: true,
        courseCode: "CSE/MCA/T/124A",
        uploaderId: adminUser.id,
      },
      {
        title: "OS Assignment",
        description: "Practice assignment covering process scheduling.",
        fileUrl: "https://example.com/resources/os-assignment.pdf",
        category: $Enums.ResourceCategory.ASSIGNMENT,
        approved: true,
        courseCode: "CSE/MCA/T/124A",
        uploaderId: adminUser.id,
      },
      {
        title: "Computer Networks Notes",
        description: "TCP/IP, OSI model, routing, transport and application layers.",
        fileUrl: "https://example.com/resources/cn-notes.pdf",
        category: $Enums.ResourceCategory.NOTES,
        approved: true,
        courseCode: "CSE/MCA/T/213A",
        uploaderId: adminUser.id,
      },
      {
        title: "Computer Networks Reference Book",
        description: "Recommended networking reference material.",
        fileUrl: "https://example.com/resources/cn-reference.pdf",
        category: $Enums.ResourceCategory.REFERENCE_BOOK,
        approved: true,
        courseCode: "CSE/MCA/T/213A",
        uploaderId: adminUser.id,
      },
      {
        title: "OOP Concepts",
        description: "Classes, inheritance, polymorphism, abstraction and encapsulation.",
        fileUrl: "https://example.com/resources/oop-notes.pdf",
        category: $Enums.ResourceCategory.NOTES,
        approved: true,
        courseCode: "CSE/MCA/T/111A",
        uploaderId: adminUser.id,
      },
      {
        title: "Software Engineering Notes",
        description: "SDLC, Agile, Scrum, testing and software project management.",
        fileUrl: "https://example.com/resources/software-engineering.pdf",
        category: $Enums.ResourceCategory.NOTES,
        approved: true,
        courseCode: "CSE/MCA/T/211A",
        uploaderId: adminUser.id,
      },
    ],
  });

  console.log("Academic resources seeded.");

  // COMPANIES
  const [google, microsoft, amazon, goldman, atlassian, tcs] = await Promise.all([
    prisma.company.upsert({
      where: {
        name: "Google India",
      },
      update: {},
      create: {
        name: "Google India",
        sector: "PRODUCT",
        website: "https://careers.google.com",
      },
    }),

    prisma.company.upsert({
      where: {
        name: "Microsoft",
      },
      update: {},
      create: {
        name: "Microsoft",
        sector: "PRODUCT",
        website: "https://careers.microsoft.com",
      },
    }),

    prisma.company.upsert({
      where: {
        name: "Amazon",
      },
      update: {},
      create: {
        name: "Amazon",
        sector: "PRODUCT",
        website: "https://amazon.jobs",
      },
    }),

    prisma.company.upsert({
      where: {
        name: "Goldman Sachs",
      },
      update: {},
      create: {
        name: "Goldman Sachs",
        sector: "SERVICE",
        website: "https://goldmansachs.com/careers",
      },
    }),

    prisma.company.upsert({
      where: {
        name: "Atlassian",
      },
      update: {},
      create: {
        name: "Atlassian",
        sector: "PRODUCT",
        website: "https://atlassian.com/company/careers",
      },
    }),

    prisma.company.upsert({
      where: {
        name: "Uber",
      },
      update: {},
      create: {
        name: "Uber",
        sector: "PRODUCT",
        website: "https://uber.com/careers",
      },
    }),

    prisma.company.upsert({
      where: {
        name: "TCS",
      },
      update: {},
      create: {
        name: "TCS",
        sector: "SERVICE",
        website: "https://tcs.com/careers",
      },
    }),

    prisma.company.upsert({
      where: {
        name: "Wipro",
      },
      update: {},
      create: {
        name: "Wipro",
        sector: "SERVICE",
        website: "https://wipro.com/careers",
      },
    }),
  ]);

  console.log("Companies seeded.");

  // PLACEMENT DRIVES
  const existingDrive = async (companyId: string, role: string) => {
    return prisma.placementDrive.findFirst({
      where: {
        companyId,
        role,
      },
    });
  };

  async function upsertDrive(data: {
    companyId: string;
    role: string;
    minCTC?: string;
    maxCTC?: string;
    minCGPA?: number;
    status?: string;
    sector?: string;
    driveDate?: Date;
    applyLink?: string;
    jd?: string;
  }) {
    const existing = await existingDrive(data.companyId, data.role);

    if (existing) {
      return prisma.placementDrive.update({
        where: {
          id: existing.id,
        },
        data,
      });
    }

    return prisma.placementDrive.create({
      data,
    });
  }

  const gDrive = await upsertDrive({
    companyId: google.id,
    role: "Software Engineer",
    minCTC: "40 LPA",
    maxCTC: "50 LPA",
    minCGPA: 8.0,
    status: "ACTIVE",
    sector: "PRODUCT",
    driveDate: new Date("2026-09-15"),
    applyLink: "https://careers.google.com/jobs/",
    jd: `We are looking for a Software Engineer to join our team.

Responsibilities:
- Design, develop, test and maintain software.
- Work with cross-functional teams.
- Solve complex technical problems.

Requirements:
- Strong data structures and algorithms knowledge.
- Strong programming fundamentals.
- Good communication and problem-solving skills.`,
  });

  const msDrive = await upsertDrive({
    companyId: microsoft.id,
    role: "SDE-1",
    minCTC: "35 LPA",
    maxCTC: "42 LPA",
    minCGPA: 7.5,
    status: "ACTIVE",
    sector: "PRODUCT",
    driveDate: new Date("2026-09-20"),
    applyLink: "https://careers.microsoft.com/",
    jd: `Join Microsoft as an SDE-1.

Responsibilities:
- Write clean and maintainable code.
- Participate in design and code reviews.
- Collaborate with engineers and product teams.

Requirements:
- Strong CS fundamentals.
- Proficiency in C++, Java or C#.
- Strong problem-solving skills.`,
  });

  const amzDrive = await upsertDrive({
    companyId: amazon.id,
    role: "SDE",
    minCTC: "30 LPA",
    maxCTC: "35 LPA",
    minCGPA: 7.0,
    status: "ACTIVE",
    sector: "PRODUCT",
    driveDate: new Date("2026-10-01"),
    applyLink: "https://amazon.jobs/en/landing_pages/software-development",
    jd: `Amazon is looking for Software Development Engineers.

Responsibilities:
- Build scalable distributed systems.
- Own end-to-end feature delivery.
- Write high-quality tested code.

Requirements:
- Strong OOP knowledge.
- Understanding of system design.
- Cloud experience is a plus.`,
  });

  const gsDrive = await upsertDrive({
    companyId: goldman.id,
    role: "Technology Analyst",
    minCTC: "28 LPA",
    maxCTC: "32 LPA",
    minCGPA: 8.5,
    status: "ACTIVE",
    sector: "SERVICE",
    driveDate: new Date("2026-09-10"),
    applyLink: "https://www.goldmansachs.com/careers/",
    jd: `Technology Analyst opportunity for students interested in financial technology.

Requirements:
- Strong programming skills.
- Good understanding of algorithms and databases.
- Strong analytical ability.`,
  });

  const atlassianDrive = await upsertDrive({
    companyId: atlassian.id,
    role: "Software Engineer",
    minCTC: "35 LPA",
    maxCTC: "45 LPA",
    minCGPA: 7.5,
    status: "UPCOMING",
    sector: "PRODUCT",
    driveDate: new Date("2026-10-05"),
    applyLink: "https://www.atlassian.com/company/careers",
    jd: `Software Engineer opportunity working on developer-focused products.

Requirements:
- Strong coding fundamentals.
- Knowledge of distributed systems is a plus.
- Strong communication skills.`,
  });

  //   const uberDrive = await upsertDrive({
  //     companyId: uber.id,
  //     role: "SWE",
  //     minCTC: "30 LPA",
  //     maxCTC: "38 LPA",
  //     minCGPA: 7.0,
  //     status: "ACTIVE",
  //     sector: "PRODUCT",
  //     driveDate: new Date("2026-10-12"),
  //     applyLink: "https://www.uber.com/careers/",
  //     jd: `Software Engineering opportunity at Uber.

  // Requirements:
  // - Strong DSA skills.
  // - Experience with software development.
  // - Strong debugging and problem-solving ability.`,
  //   });

  const tcsDrive = await upsertDrive({
    companyId: tcs.id,
    role: "Systems Engineer",
    minCTC: "7 LPA",
    maxCTC: "10 LPA",
    minCGPA: 6.0,
    status: "ACTIVE",
    sector: "SERVICE",
    driveDate: new Date("2026-08-20"),
    applyLink: "https://www.tcs.com/careers",
    jd: `Systems Engineer position for entry-level software engineers.

Requirements:
- Basic programming knowledge.
- Good communication skills.
- Understanding of CS fundamentals.`,
  });

  //   const wiproDrive = await upsertDrive({
  //     companyId: wipro.id,
  //     role: "Project Engineer",
  //     minCTC: "6.5 LPA",
  //     maxCTC: "9 LPA",
  //     minCGPA: 6.0,
  //     status: "UPCOMING",
  //     sector: "SERVICE",
  //     driveDate: new Date("2026-09-01"),
  //     applyLink: "https://careers.wipro.com/",
  //     jd: `Project Engineer opportunity for fresh graduates.

  // Requirements:
  // - Basic programming and problem-solving skills.
  // - Ability to work in a team.
  // - Good communication skills.`,
  //   });

  console.log("Placement drives seeded.");

  // DRIVE RESOURCES
  const driveResources = [
    {
      driveId: gDrive.id,
      uploadedBy: adminUser.id,
      title: "Google OA Practice Paper",
      fileUrl: "https://example.com/drives/google-oa.pdf",
      type: "OA_PAPER",
    },
    {
      driveId: gDrive.id,
      uploadedBy: adminUser.id,
      title: "Google Interview Preparation Notes",
      fileUrl: "https://example.com/drives/google-interview-notes.pdf",
      type: "INTERVIEW_NOTES",
    },
    {
      driveId: msDrive.id,
      uploadedBy: adminUser.id,
      title: "Microsoft OA Questions",
      fileUrl: "https://example.com/drives/microsoft-oa.pdf",
      type: "OA_PAPER",
    },
    {
      driveId: msDrive.id,
      uploadedBy: adminUser.id,
      title: "Microsoft Resume Tips",
      fileUrl: "https://example.com/drives/microsoft-resume.pdf",
      type: "RESUME_TIPS",
    },
    {
      driveId: amzDrive.id,
      uploadedBy: adminUser.id,
      title: "Amazon Leadership Principles",
      fileUrl: "https://example.com/drives/amazon-lp.pdf",
      type: "INTERVIEW_NOTES",
    },
    {
      driveId: amzDrive.id,
      uploadedBy: adminUser.id,
      title: "Amazon DSA Practice",
      fileUrl: "https://example.com/drives/amazon-dsa.pdf",
      type: "OA_PAPER",
    },
    {
      driveId: gsDrive.id,
      uploadedBy: adminUser.id,
      title: "Goldman Sachs OA Questions",
      fileUrl: "https://example.com/drives/goldman-oa.pdf",
      type: "OA_PAPER",
    },
    {
      driveId: atlassianDrive.id,
      uploadedBy: adminUser.id,
      title: "Atlassian Interview Guide",
      fileUrl: "https://example.com/drives/atlassian-guide.pdf",
      type: "INTERVIEW_NOTES",
    },
  ];

  await prisma.driveResource.createMany({
    data: driveResources,
  });

  console.log("Drive resources seeded.");

  // PLACEMENT OFFERS
  await prisma.placementOffer.createMany({
    data: [
      {
        driveId: gDrive.id,
        userId: alumni1.id,
        status: $Enums.OfferStatus.OFFERED,
        ctc: "45 LPA",
        role: "Software Engineer",
      },
      {
        driveId: msDrive.id,
        userId: alumni2.id,
        status: $Enums.OfferStatus.OFFERED,
        ctc: "38 LPA",
        role: "SDE-1",
      },
      {
        driveId: tcsDrive.id,
        userId: student3.id,
        status: $Enums.OfferStatus.OFFERED,
        ctc: "8 LPA",
        role: "Systems Engineer",
      },
      {
        driveId: gsDrive.id,
        userId: student2.id,
        status: $Enums.OfferStatus.REJECTED,
        ctc: "30 LPA",
        role: "Technology Analyst",
      },
    ],
  });

  console.log("Placement offers seeded.");

  // INTERVIEW EXPERIENCE — GOOGLE
  const googleInterview = await prisma.interviewExperience.create({
    data: {
      role: "Software Engineer",
      ctc: "45 LPA",
      outcome: "SELECTED",
      narrative:
        "The interview process focused heavily on data structures, algorithms, problem solving and software engineering fundamentals.",
      approved: true,
      companyId: google.id,
      authorId: alumni1.id,
    },
  });

  const googleRound1 = await prisma.interviewRound.create({
    data: {
      roundName: "Online Assessment",
      orderNumber: 1,
      description: "Two coding problems covering arrays, graphs and dynamic programming.",
      interviewExperienceId: googleInterview.id,
    },
  });

  const googleRound2 = await prisma.interviewRound.create({
    data: {
      roundName: "Technical Interview 1",
      orderNumber: 2,
      description: "DSA problem solving followed by discussion of complexity and alternatives.",
      interviewExperienceId: googleInterview.id,
    },
  });

  const googleRound3 = await prisma.interviewRound.create({
    data: {
      roundName: "Technical Interview 2",
      orderNumber: 3,
      description: "Advanced DSA, system design fundamentals and project discussion.",
      interviewExperienceId: googleInterview.id,
    },
  });

  const googleRound4 = await prisma.interviewRound.create({
    data: {
      roundName: "HR",
      orderNumber: 4,
      description: "Behavioral questions, motivation and communication assessment.",
      interviewExperienceId: googleInterview.id,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        text: "Find the longest subarray with sum equal to K.",
        solution: "Use prefix sums with a hash map to achieve O(n) time complexity.",
        roundId: googleRound1.id,
      },
      {
        text: "Detect a cycle in a directed graph.",
        solution: "Use DFS with a recursion stack or Kahn's algorithm.",
        roundId: googleRound1.id,
      },
      {
        text: "Explain the time complexity of your solution.",
        solution: "Discuss both worst-case time and auxiliary space complexity.",
        roundId: googleRound2.id,
      },
      {
        text: "Design a URL shortening service.",
        solution:
          "Discuss API design, unique ID generation, storage, caching, scalability and collision handling.",
        roundId: googleRound3.id,
      },
      {
        text: "Tell me about a difficult technical problem you solved.",
        solution: "Use the STAR framework and explain the problem, actions and measurable result.",
        roundId: googleRound4.id,
      },
    ],
  });

  // INTERVIEW EXPERIENCE — MICROSOFT
  const microsoftInterview = await prisma.interviewExperience.create({
    data: {
      role: "SDE-1",
      ctc: "38 LPA",
      outcome: "SELECTED",
      narrative:
        "The process included an online assessment followed by multiple technical rounds and a final behavioral discussion.",
      approved: true,
      companyId: microsoft.id,
      authorId: alumni2.id,
    },
  });

  const msRound1 = await prisma.interviewRound.create({
    data: {
      roundName: "Online Assessment",
      orderNumber: 1,
      description: "Coding and aptitude assessment.",
      interviewExperienceId: microsoftInterview.id,
    },
  });

  const msRound2 = await prisma.interviewRound.create({
    data: {
      roundName: "Technical 1",
      orderNumber: 2,
      description: "Arrays, strings and binary trees.",
      interviewExperienceId: microsoftInterview.id,
    },
  });

  const msRound3 = await prisma.interviewRound.create({
    data: {
      roundName: "Technical 2",
      orderNumber: 3,
      description: "Graphs, DP and object-oriented programming.",
      interviewExperienceId: microsoftInterview.id,
    },
  });

  const msRound4 = await prisma.interviewRound.create({
    data: {
      roundName: "HR",
      orderNumber: 4,
      description: "Behavioral and culture-fit discussion.",
      interviewExperienceId: microsoftInterview.id,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        text: "Find the first non-repeating character in a string.",
        solution: "Count character frequencies and then scan the string again.",
        roundId: msRound1.id,
      },
      {
        text: "Reverse a binary tree.",
        solution: "Recursively or iteratively swap the left and right children.",
        roundId: msRound2.id,
      },
      {
        text: "Explain inheritance and polymorphism.",
        solution:
          "Inheritance allows reuse and extension of behavior, while polymorphism allows different implementations behind a common interface.",
        roundId: msRound3.id,
      },
      {
        text: "Why do you want to work at Microsoft?",
        solution:
          "Connect your interests and experience with Microsoft's products, engineering culture and impact.",
        roundId: msRound4.id,
      },
    ],
  });

  // INTERVIEW EXPERIENCE — AMAZON
  const amazonInterview = await prisma.interviewExperience.create({
    data: {
      role: "SDE",
      ctc: "32 LPA",
      outcome: "SELECTED",
      narrative:
        "Amazon focused strongly on data structures, problem solving and Leadership Principles throughout the interview process.",
      approved: true,
      companyId: amazon.id,
      authorId: alumni1.id,
    },
  });

  const amazonRound1 = await prisma.interviewRound.create({
    data: {
      roundName: "Online Assessment",
      orderNumber: 1,
      description: "DSA coding assessment.",
      interviewExperienceId: amazonInterview.id,
    },
  });

  const amazonRound2 = await prisma.interviewRound.create({
    data: {
      roundName: "Technical Interview",
      orderNumber: 2,
      description: "DSA and object-oriented design.",
      interviewExperienceId: amazonInterview.id,
    },
  });

  const amazonRound3 = await prisma.interviewRound.create({
    data: {
      roundName: "Bar Raiser",
      orderNumber: 3,
      description: "Technical and behavioral assessment.",
      interviewExperienceId: amazonInterview.id,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        text: "Merge overlapping intervals.",
        solution: "Sort intervals by start time and merge overlapping ranges in one pass.",
        roundId: amazonRound1.id,
      },
      {
        text: "Implement an LRU cache.",
        solution: "Use a hash map combined with a doubly linked list for O(1) get and put.",
        roundId: amazonRound2.id,
      },
      {
        text: "Tell me about a time you disagreed with a teammate.",
        solution:
          "Explain the situation objectively, how you communicated, the resolution and the outcome.",
        roundId: amazonRound3.id,
      },
    ],
  });

  console.log("Interview experiences seeded.");
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
