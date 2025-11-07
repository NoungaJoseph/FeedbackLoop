/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- Set a default password for existing users (they will need to reset it)
UPDATE "User" SET "password" = 'temp_password_change_me' WHERE "password" IS NULL;

-- Make password NOT NULL
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;
