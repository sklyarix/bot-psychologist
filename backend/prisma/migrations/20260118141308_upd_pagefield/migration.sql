/*
  Warnings:

  - Added the required column `title` to the `page_fields` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."page_fields" ADD COLUMN     "title" TEXT NOT NULL;
