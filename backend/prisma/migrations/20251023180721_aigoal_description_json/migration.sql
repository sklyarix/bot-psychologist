/*
  Warnings:

  - The `description` column on the `Ai_Goal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Ai_Goal" DROP COLUMN "description",
ADD COLUMN     "description" JSONB;
