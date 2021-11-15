/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Jwt` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Jwt_token_key` ON `Jwt`(`token`);
