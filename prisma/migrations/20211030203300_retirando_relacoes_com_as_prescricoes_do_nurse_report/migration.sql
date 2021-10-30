/*
  Warnings:

  - You are about to drop the column `executorsMedicalPrescriptionId` on the `NurseReport` table. All the data in the column will be lost.
  - You are about to drop the column `nursePrescriptionId` on the `NurseReport` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[signatoryId]` on the table `NurseReport` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `NurseReport` DROP FOREIGN KEY `NurseReport_executorsMedicalPrescriptionId_fkey`;

-- DropForeignKey
ALTER TABLE `NurseReport` DROP FOREIGN KEY `NurseReport_nursePrescriptionId_fkey`;

-- AlterTable
ALTER TABLE `NurseReport` DROP COLUMN `executorsMedicalPrescriptionId`,
    DROP COLUMN `nursePrescriptionId`;

-- CreateIndex
CREATE UNIQUE INDEX `NurseReport_signatoryId_key` ON `NurseReport`(`signatoryId`);
