/*
  Warnings:

  - A unique constraint covering the columns `[idUser]` on the table `Jwt` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Jwt_idUser_key` ON `Jwt`(`idUser`);
