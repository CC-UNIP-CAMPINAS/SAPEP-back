/*
  Warnings:

  - You are about to drop the column `crm` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `crm`,
    ADD COLUMN `gender` VARCHAR(191) NOT NULL DEFAULT 'INDEFINIDO',
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;
