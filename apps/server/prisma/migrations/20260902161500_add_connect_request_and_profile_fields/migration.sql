-- CreateEnum
CREATE TYPE "ConnectRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "company" TEXT,
ADD COLUMN     "graduationYear" INTEGER,
ADD COLUMN     "jobRole" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "openToConnect" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "ConnectRequest" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "status" "ConnectRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requesterId" TEXT NOT NULL,
    "alumniId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConnectRequest_alumniId_idx" ON "ConnectRequest"("alumniId");

-- CreateIndex
CREATE INDEX "ConnectRequest_requesterId_idx" ON "ConnectRequest"("requesterId");

-- CreateIndex
CREATE INDEX "ConnectRequest_status_idx" ON "ConnectRequest"("status");

-- AddForeignKey
ALTER TABLE "ConnectRequest" ADD CONSTRAINT "ConnectRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectRequest" ADD CONSTRAINT "ConnectRequest_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
