-- CreateEnum
CREATE TYPE "ElectiveBasket" AS ENUM ('ELECTIVE_I', 'ELECTIVE_II', 'ELECTIVE_III');

-- CreateTable
CREATE TABLE "Elective" (
    "id" TEXT NOT NULL,
    "basket" "ElectiveBasket" NOT NULL,
    "semester" TEXT NOT NULL DEFAULT '3',
    "courseCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Elective_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Elective_courseCode_key" ON "Elective"("courseCode");

-- CreateIndex
CREATE INDEX "Elective_basket_idx" ON "Elective"("basket");

-- AddForeignKey
ALTER TABLE "Elective" ADD CONSTRAINT "Elective_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE CASCADE ON UPDATE CASCADE;
