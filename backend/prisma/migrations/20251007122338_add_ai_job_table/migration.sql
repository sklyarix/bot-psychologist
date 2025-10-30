-- CreateEnum
CREATE TYPE "public"."AiJobState" AS ENUM ('queued', 'active', 'completed', 'failed');

-- CreateTable
CREATE TABLE "public"."Ai_job" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT,
    "presetKey" TEXT NOT NULL,
    "text" TEXT,
    "state" "public"."AiJobState" NOT NULL DEFAULT 'queued',
    "answer" TEXT,
    "error" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ai_job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ai_job_jobId_key" ON "public"."Ai_job"("jobId");

-- AddForeignKey
ALTER TABLE "public"."Ai_job" ADD CONSTRAINT "Ai_job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
