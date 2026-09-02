/*
  Warnings:

  - You are about to drop the column `credits` on the `SemesterMapping` table. All the data in the column will be lost.
  - You are about to drop the column `periodsPerWeek` on the `SemesterMapping` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SemesterMapping" DROP COLUMN "credits",
DROP COLUMN "periodsPerWeek",
ADD COLUMN     "creditPoints" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "examMarks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "periodL" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "periodP" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "periodT" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sessionalMarks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalMarks" INTEGER NOT NULL DEFAULT 100;
