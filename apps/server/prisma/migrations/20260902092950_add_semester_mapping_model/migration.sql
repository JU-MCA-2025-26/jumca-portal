-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('THEORY', 'SESSIONAL');

-- CreateEnum
CREATE TYPE "SemesterTerm" AS ENUM ('BRIDGE', 'SEM_1', 'SEM_2', 'SEM_3', 'SEM_4');

-- CreateTable
CREATE TABLE "SemesterMapping" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" "SemesterTerm" NOT NULL,
    "semesterNumber" INTEGER NOT NULL,
    "type" "CourseType" NOT NULL DEFAULT 'THEORY',
    "credits" INTEGER NOT NULL DEFAULT 3,
    "periodsPerWeek" TEXT,
    "courseCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SemesterMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SemesterMapping_courseCode_key" ON "SemesterMapping"("courseCode");

-- CreateIndex
CREATE INDEX "SemesterMapping_year_semester_idx" ON "SemesterMapping"("year", "semester");

-- CreateIndex
CREATE INDEX "SemesterMapping_semesterNumber_idx" ON "SemesterMapping"("semesterNumber");

-- CreateIndex
CREATE INDEX "SemesterMapping_type_idx" ON "SemesterMapping"("type");

-- AddForeignKey
ALTER TABLE "SemesterMapping" ADD CONSTRAINT "SemesterMapping_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE CASCADE ON UPDATE CASCADE;
