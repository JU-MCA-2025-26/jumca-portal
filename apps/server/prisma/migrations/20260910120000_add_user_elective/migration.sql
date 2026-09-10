-- CreateTable
CREATE TABLE "UserElective" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "basket" "ElectiveBasket" NOT NULL,
    "semester" "SemesterTerm" NOT NULL DEFAULT 'SEM_3',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserElective_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserElective_userId_basket_semester_key" ON "UserElective"("userId", "basket", "semester");

-- CreateIndex
CREATE INDEX "UserElective_userId_idx" ON "UserElective"("userId");

-- AddForeignKey
ALTER TABLE "UserElective" ADD CONSTRAINT "UserElective_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserElective" ADD CONSTRAINT "UserElective_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE CASCADE ON UPDATE CASCADE;
