/*
  Warnings:

  - You are about to drop the column `healthInsuranceCode` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Patient` DROP COLUMN `healthInsuranceCode`,
    ADD COLUMN `complement` VARCHAR(191);

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;
