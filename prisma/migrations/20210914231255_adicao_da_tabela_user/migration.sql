/*
  Warnings:

  - Made the column `idUser` on table `Jwts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Jwts` MODIFY `idUser` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
