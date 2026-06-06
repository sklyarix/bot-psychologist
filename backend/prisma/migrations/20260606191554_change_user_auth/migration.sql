/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isPremium` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isSubBot` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telegramId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."User_telegramId_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "firstName",
DROP COLUMN "isPremium",
DROP COLUMN "isSubBot",
DROP COLUMN "language",
DROP COLUMN "lastName",
DROP COLUMN "photoUrl",
DROP COLUMN "telegramId",
DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
