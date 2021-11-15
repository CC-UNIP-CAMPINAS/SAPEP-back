/*
  Warnings:

  - You are about to drop the column `executorId` on the `MedicalPrescription` table. All the data in the column will be lost.
  - You are about to drop the column `medicalPrescriptionId` on the `NurseReport` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[executorsMedicalPrescriptionId]` on the table `NurseReport` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `MedicalPrescription` DROP FOREIGN KEY `MedicalPrescription_executorId_fkey`;

-- DropForeignKey
ALTER TABLE `NurseReport` DROP FOREIGN KEY `NurseReport_medicalPrescriptionId_fkey`;

-- AlterTable
ALTER TABLE `MedicalPrescription` DROP COLUMN `executorId`,
    ADD COLUMN `administrationCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `NurseReport` DROP COLUMN `medicalPrescriptionId`,
    ADD COLUMN `executorsMedicalPrescriptionId` INTEGER;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `ExecutorsMedicalPrescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `medicalPrescriptionId` INTEGER,
    `executorId` INTEGER,
    `executionDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `NurseReport_executorsMedicalPrescriptionId_key` ON `NurseReport`(`executorsMedicalPrescriptionId`);

-- AddForeignKey
ALTER TABLE `NurseReport` ADD CONSTRAINT `NurseReport_executorsMedicalPrescriptionId_fkey` FOREIGN KEY (`executorsMedicalPrescriptionId`) REFERENCES `ExecutorsMedicalPrescription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExecutorsMedicalPrescription` ADD CONSTRAINT `ExecutorsMedicalPrescription_medicalPrescriptionId_fkey` FOREIGN KEY (`medicalPrescriptionId`) REFERENCES `MedicalPrescription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExecutorsMedicalPrescription` ADD CONSTRAINT `ExecutorsMedicalPrescription_executorId_fkey` FOREIGN KEY (`executorId`) REFERENCES `Nurse`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;
