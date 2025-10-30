/*
  Warnings:

  - The `status` column on the `Ai_Goal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Ai_Question_Answer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `state` on the `Job` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."JobStatus" AS ENUM ('queued', 'active', 'completed', 'failed');

-- AlterTable
ALTER TABLE "public"."Ai_Goal" DROP COLUMN "status",
ADD COLUMN     "status" "public"."JobStatus" NOT NULL DEFAULT 'queued';

-- AlterTable
ALTER TABLE "public"."Ai_Question_Answer" DROP COLUMN "status",
ADD COLUMN     "status" "public"."JobStatus" NOT NULL DEFAULT 'queued';

-- AlterTable
ALTER TABLE "public"."Job" DROP COLUMN "state",
ADD COLUMN     "status" "public"."JobStatus" NOT NULL DEFAULT 'queued';

-- DropEnum
DROP TYPE "public"."JobState";
