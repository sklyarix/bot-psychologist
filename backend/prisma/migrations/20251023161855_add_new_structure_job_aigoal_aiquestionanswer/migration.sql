/*
  Warnings:

  - You are about to drop the `Ai_job` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."JobState" AS ENUM ('queued', 'active', 'completed', 'failed');

-- DropForeignKey
ALTER TABLE "public"."Ai_job" DROP CONSTRAINT "Ai_job_userId_fkey";

-- DropTable
DROP TABLE "public"."Ai_job";

-- DropEnum
DROP TYPE "public"."AiJobState";

-- CreateTable
CREATE TABLE "public"."Job" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" "public"."JobState" NOT NULL DEFAULT 'queued',
    "errorLog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aiGoalId" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ai_Goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."JobState" NOT NULL DEFAULT 'queued',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Ai_Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ai_Question_Answer" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "status" "public"."JobState" NOT NULL DEFAULT 'queued',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "jobId" TEXT,

    CONSTRAINT "Ai_Question_Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_aiGoalId_key" ON "public"."Job"("aiGoalId");

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_aiGoalId_fkey" FOREIGN KEY ("aiGoalId") REFERENCES "public"."Ai_Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ai_Goal" ADD CONSTRAINT "Ai_Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ai_Question_Answer" ADD CONSTRAINT "Ai_Question_Answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ai_Question_Answer" ADD CONSTRAINT "Ai_Question_Answer_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
