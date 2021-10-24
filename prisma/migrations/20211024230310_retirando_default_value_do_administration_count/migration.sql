/*
  Warnings:

  - You are about to drop the column `executionDate` on the `MedicalPrescription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `MedicalPrescription` DROP COLUMN `executionDate`,
    ALTER COLUMN `administrationCount` DROP DEFAULT;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;
