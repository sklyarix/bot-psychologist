/*
  Warnings:

  - You are about to drop the column `lastActive` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "lastActive",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
