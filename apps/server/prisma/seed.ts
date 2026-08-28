import bcrypt from "bcrypt";
import prisma from "../src/config/prisma.js";
import { $Enums } from "../src/generated/client.js";

async function main() {
  const password = await bcrypt.hash("admin123", 12);

  const isAdminExists = await prisma.user.findUnique({
    where: {
      email: "admin@jumca.com",
    },
  });

  if (isAdminExists) {
    console.log("Administrator user already exists.");
    return;
  }

  await prisma.user.upsert({
    where: {
      email: "admin@jumca.com",
    },
    update: {
      fullName: "Administrator",
      password,
    },
    create: {
      fullName: "Administrator",

      email: "admin@jumca.com",

      rollNumber: "002510503000",

      password,

      role: $Enums.Role.ADMIN,

      batch: "2025-27",
    },
  });

  const [google, microsoft, amazon, goldman, atlassian, uber, tcs, wipro] = await Promise.all([
    prisma.company.upsert({
      where: { name: "Google India" },
      update: {},
      create: { name: "Google India", sector: "PRODUCT", website: "https://careers.google.com" },
    }),
    prisma.company.upsert({
      where: { name: "Microsoft" },
      update: {},
      create: { name: "Microsoft", sector: "PRODUCT", website: "https://careers.microsoft.com" },
    }),
    prisma.company.upsert({
      where: { name: "Amazon" },
      update: {},
      create: { name: "Amazon", sector: "PRODUCT", website: "https://amazon.jobs" },
    }),
    prisma.company.upsert({
      where: { name: "Goldman Sachs" },
      update: {},
      create: {
        name: "Goldman Sachs",
        sector: "SERVICE",
        website: "https://goldmansachs.com/careers",
      },
    }),
    prisma.company.upsert({
      where: { name: "Atlassian" },
      update: {},
      create: {
        name: "Atlassian",
        sector: "PRODUCT",
        website: "https://atlassian.com/company/careers",
      },
    }),
    prisma.company.upsert({
      where: { name: "Uber" },
      update: {},
      create: { name: "Uber", sector: "PRODUCT", website: "https://uber.com/careers" },
    }),
    prisma.company.upsert({
      where: { name: "TCS" },
      update: {},
      create: { name: "TCS", sector: "SERVICE", website: "https://tcs.com/careers" },
    }),
    prisma.company.upsert({
      where: { name: "Wipro" },
      update: {},
      create: { name: "Wipro", sector: "SERVICE", website: "https://wipro.com/careers" },
    }),
  ]);

  const firstBatch = await prisma.batch.findFirst({ where: { isActive: true } });
  const batchConnect = firstBatch ? { batchDrives: { create: [{ batchId: firstBatch.id }] } } : {};

  const [gDrive, msDrive, amzDrive] = await Promise.all([
    prisma.placementDrive.create({
      data: {
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
• Design, develop, test, deploy, maintain, and improve software.
• Manage individual project priorities, deadlines, and deliverables.
• Partner with cross-functional teams to build end-to-end products.

Requirements:
• BS/MS in Computer Science or related technical field.
• Experience with data structures and algorithms.
• Strong problem-solving and communication skills.`,
        ...batchConnect,
      },
    }),

    prisma.placementDrive.create({
      data: {
        companyId: microsoft.id,
        role: "SDE-1",
        minCTC: "35 LPA",
        maxCTC: "42 LPA",
        minCGPA: 7.5,
        status: "ACTIVE",
        sector: "PRODUCT",
        driveDate: new Date("2026-09-20"),
        applyLink: "https://careers.microsoft.com/",
        jd: `Join Microsoft as an SDE-1 and work on products used by billions.

Responsibilities:
• Write clean, testable code across the full stack.
• Participate in design reviews and code reviews.
• Collaborate with PMs and designers to ship features.

Requirements:
• Strong foundation in CS fundamentals.
• Proficiency in at least one compiled language (C++, Java, C#).
• Experience building backend services or frontend applications.`,
        ...batchConnect,
      },
    }),

    prisma.placementDrive.create({
      data: {
        companyId: amazon.id,
        role: "SDE",
        minCTC: "30 LPA",
        maxCTC: "35 LPA",
        minCGPA: 7.0,
        status: "ACTIVE",
        sector: "PRODUCT",
        driveDate: new Date("2026-10-01"),
        applyLink: "https://amazon.jobs/en/landing_pages/software-development",
        jd: `Amazon is looking for software development engineers who will build the next generation of distributed, scalable systems.

Responsibilities:
• Work with large-scale distributed systems.
• Own end-to-end delivery of features.
• Write high-quality, well-tested code.

Requirements:
• Strong understanding of OOP and system design.
• Experience with AWS or any cloud platform is a plus.
• Demonstrated ability to deliver complex projects.`,
        ...batchConnect,
      },
    }),

    // Create remaining drives similarly
    prisma.placementDrive.create({
      data: {
        companyId: goldman.id,
        role: "Technology Analyst",
        minCTC: "28 LPA",
        minCGPA: 8.5,
        status: "ACTIVE",
        sector: "SERVICE",
        driveDate: new Date("2026-09-10"),
        ...batchConnect,
      },
    }),
    prisma.placementDrive.create({
      data: {
        companyId: atlassian.id,
        role: "Software Engineer",
        minCTC: "35 LPA",
        minCGPA: 7.5,
        status: "UPCOMING",
        sector: "PRODUCT",
        driveDate: new Date("2026-10-05"),
        ...batchConnect,
      },
    }),
    prisma.placementDrive.create({
      data: {
        companyId: uber.id,
        role: "SWE",
        minCTC: "30 LPA",
        minCGPA: 7.0,
        status: "ACTIVE",
        sector: "PRODUCT",
        driveDate: new Date("2026-10-12"),
        ...batchConnect,
      },
    }),
    prisma.placementDrive.create({
      data: {
        companyId: tcs.id,
        role: "Systems Engineer",
        minCTC: "7 LPA",
        minCGPA: 6.0,
        status: "ACTIVE",
        sector: "SERVICE",
        driveDate: new Date("2026-08-20"),
        ...batchConnect,
      },
    }),
    prisma.placementDrive.create({
      data: {
        companyId: wipro.id,
        role: "Project Engineer",
        minCTC: "6.5 LPA",
        minCGPA: 6.0,
        status: "UPCOMING",
        sector: "SERVICE",
        driveDate: new Date("2026-09-01"),
        ...batchConnect,
      },
    }),
  ]);

  // await prisma.driveResource.createMany({
  //   data: [
  //     { driveId: gDrive.id,   uploadedBy: adminUser.id, title: "Google OA 2025 — Batch A",  fileUrl: "https://example.com/google-oa-2025.pdf",  type: "OA_PAPER"        },
  //     { driveId: gDrive.id,   uploadedBy: adminUser.id, title: "Google Interview Notes",     fileUrl: "https://example.com/google-notes.pdf",     type: "INTERVIEW_NOTES" },
  //     { driveId: msDrive.id,  uploadedBy: adminUser.id, title: "Microsoft OA 2024",          fileUrl: "https://example.com/ms-oa-2024.pdf",       type: "OA_PAPER"        },
  //     { driveId: amzDrive.id, uploadedBy: adminUser.id, title: "Amazon LP & DSA Prep Sheet", fileUrl: "https://example.com/amazon-prep.pdf",      type: "RESUME_TIPS"     },
  //   ],
  // });

  // ── Sample placement offers (past batch) ───────────────────────────────────
  // NOTE: Replace studentUser.id with actual student IDs from your seed
  // Example (if you have a student user):
  // const student = await prisma.user.findFirst({ where: { role: "STUDENT" } });
  // if (student) {
  //   await prisma.placementOffer.create({
  //     data: { driveId: gDrive.id, userId: student.id, ctc: "45 LPA", role: "Software Engineer", status: "ACCEPTED", offerDate: new Date("2025-11-01") },
  //   });
  // }
}

main();
