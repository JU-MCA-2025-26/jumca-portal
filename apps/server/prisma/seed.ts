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

  const student1 = await prisma.user.upsert({
    where: {
      email: "student1@jumca.com",
    },
    update: {},
    create: {
      fullName: "Arjun Sharma",
      email: "student1@jumca.com",
      rollNumber: "002510503001",
      password: studentPassword,
      role: $Enums.Role.STUDENT,
      batch: "2025-27",
    },
  });

  const student2 = await prisma.user.upsert({
    where: {
      email: "student2@jumca.com",
    },
    update: {},
    create: {
      fullName: "Priya Das",
      email: "student2@jumca.com",
      rollNumber: "002510503002",
      password: studentPassword,
      role: $Enums.Role.STUDENT,
      batch: "2025-27",
    },
  });

  const student3 = await prisma.user.upsert({
    where: {
      email: "student3@jumca.com",
    },
    update: {},
    create: {
      fullName: "Rahul Singh",
      email: "student3@jumca.com",
      rollNumber: "002510503003",
      password: studentPassword,
      role: $Enums.Role.STUDENT,
      batch: "2025-27",
    },
  });

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

  console.log("Users seeded.");

  // PROFILES
  await prisma.profile.upsert({
    where: {
      userId: student1.id,
    },
    update: {},
    create: {
      userId: student1.id,
      bio: "Computer science student interested in backend development and DSA.",
      github: "https://github.com/arjun-sharma",
      leetcode: "https://leetcode.com/arjun-sharma",
      gfg: "https://www.geeksforgeeks.org/user/arjun-sharma",
    },
  });

  await prisma.profile.upsert({
    where: {
      userId: student2.id,
    },
    update: {},
    create: {
      userId: student2.id,
      bio: "Full-stack development enthusiast and competitive programmer.",
      github: "https://github.com/priya-das",
      leetcode: "https://leetcode.com/priya-das",
      codeforces: "https://codeforces.com/profile/priya-das",
    },
  });

  await prisma.profile.upsert({
    where: {
      userId: student3.id,
    },
    update: {},
    create: {
      userId: student3.id,
      bio: "Interested in machine learning, systems and software engineering.",
      github: "https://github.com/rahul-singh",
      leetcode: "https://leetcode.com/rahul-singh",
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

  // COURSES
  const courses = await Promise.all([
    prisma.course.upsert({
      where: {
        name: "Data Structures & Algorithms",
      },
      update: {},
      create: {
        name: "Data Structures & Algorithms",
      },
    }),

    prisma.course.upsert({
      where: {
        name: "Database Management Systems",
      },
      update: {},
      create: {
        name: "Database Management Systems",
      },
    }),

    prisma.course.upsert({
      where: {
        name: "Operating Systems",
      },
      update: {},
      create: {
        name: "Operating Systems",
      },
    }),

    prisma.course.upsert({
      where: {
        name: "Computer Networks",
      },
      update: {},
      create: {
        name: "Computer Networks",
      },
    }),

    prisma.course.upsert({
      where: {
        name: "Object Oriented Programming",
      },
      update: {},
      create: {
        name: "Object Oriented Programming",
      },
    }),

    prisma.course.upsert({
      where: {
        name: "Software Engineering",
      },
      update: {},
      create: {
        name: "Software Engineering",
      },
    }),
  ]);

  const [dsaCourse, dbmsCourse, osCourse, cnCourse, oopCourse, seCourse] = courses;

  console.log("Courses seeded.");

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
        courseId: dsaCourse.id,
        uploaderId: adminUser.id,
      },
      {
        title: "DSA Previous Year Questions",
        description: "Collection of previous year university questions for DSA.",
        fileUrl: "https://example.com/resources/dsa-pyq.pdf",
        category: $Enums.ResourceCategory.PREVIOUS_YEAR_QUESTION,
        approved: true,
        courseId: dsaCourse.id,
        uploaderId: adminUser.id,
      },
      {
        title: "DBMS Revision Notes",
        description: "SQL, normalization, transactions, indexing and database architecture.",
        fileUrl: "https://example.com/resources/dbms-notes.pdf",
        category: $Enums.ResourceCategory.NOTES,
        approved: true,
        courseId: dbmsCourse.id,
        uploaderId: adminUser.id,
      },
      {
        title: "DBMS Previous Year Questions",
        description: "Previous examination questions for DBMS.",
        fileUrl: "https://example.com/resources/dbms-pyq.pdf",
        category: $Enums.ResourceCategory.PREVIOUS_YEAR_QUESTION,
        approved: true,
        courseId: dbmsCourse.id,
        uploaderId: adminUser.id,
      },
      {
        title: "Operating Systems Notes",
        description: "Processes, threads, scheduling, memory management and file systems.",
        fileUrl: "https://example.com/resources/os-notes.pdf",
        category: $Enums.ResourceCategory.NOTES,
        approved: true,
        courseId: osCourse.id,
        uploaderId: adminUser.id,
      },
      {
        title: "OS Assignment",
        description: "Practice assignment covering process scheduling.",
        fileUrl: "https://example.com/resources/os-assignment.pdf",
        category: $Enums.ResourceCategory.ASSIGNMENT,
        approved: true,
        courseId: osCourse.id,
        uploaderId: adminUser.id,
      },
      {
        title: "Computer Networks Notes",
        description: "TCP/IP, OSI model, routing, transport and application layers.",
        fileUrl: "https://example.com/resources/cn-notes.pdf",
        category: $Enums.ResourceCategory.NOTES,
        approved: true,
        courseId: cnCourse.id,
        uploaderId: adminUser.id,
      },
      {
        title: "Computer Networks Reference Book",
        description: "Recommended networking reference material.",
        fileUrl: "https://example.com/resources/cn-reference.pdf",
        category: $Enums.ResourceCategory.REFERENCE_BOOK,
        approved: true,
        courseId: cnCourse.id,
        uploaderId: adminUser.id,
      },
      {
        title: "OOP Concepts",
        description: "Classes, inheritance, polymorphism, abstraction and encapsulation.",
        fileUrl: "https://example.com/resources/oop-notes.pdf",
        category: $Enums.ResourceCategory.NOTES,
        approved: true,
        courseId: oopCourse.id,
        uploaderId: adminUser.id,
      },
      {
        title: "Software Engineering Notes",
        description: "SDLC, Agile, Scrum, testing and software project management.",
        fileUrl: "https://example.com/resources/software-engineering.pdf",
        category: $Enums.ResourceCategory.NOTES,
        approved: true,
        courseId: seCourse.id,
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
