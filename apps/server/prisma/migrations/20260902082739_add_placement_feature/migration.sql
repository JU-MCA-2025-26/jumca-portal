/*
  Warnings:

  - Added the required column `sector` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('OFFERED', 'REJECTED');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "sector" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "avatarUrl" TEXT;

-- CreateTable
CREATE TABLE "PlacementDrive" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "driveDate" TIMESTAMP(3),
    "minCTC" TEXT,
    "maxCTC" TEXT,
    "minCGPA" DOUBLE PRECISION,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "sector" TEXT,
    "jd" TEXT,
    "applyLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlacementDrive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementOffer" (
    "id" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'OFFERED',
    "ctc" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "PlacementOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriveResource" (
    "id" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriveResource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlacementOffer_driveId_idx" ON "PlacementOffer"("driveId");

-- CreateIndex
CREATE INDEX "PlacementOffer_userId_idx" ON "PlacementOffer"("userId");

-- CreateIndex
CREATE INDEX "PlacementOffer_status_idx" ON "PlacementOffer"("status");

-- AddForeignKey
ALTER TABLE "PlacementDrive" ADD CONSTRAINT "PlacementDrive_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementOffer" ADD CONSTRAINT "PlacementOffer_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "PlacementDrive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementOffer" ADD CONSTRAINT "PlacementOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriveResource" ADD CONSTRAINT "DriveResource_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "PlacementDrive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriveResource" ADD CONSTRAINT "DriveResource_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
