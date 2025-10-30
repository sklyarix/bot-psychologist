/*
  Warnings:

  - The `answer` column on the `Ai_job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Ai_job" DROP COLUMN "answer",
ADD COLUMN     "answer" JSONB;
