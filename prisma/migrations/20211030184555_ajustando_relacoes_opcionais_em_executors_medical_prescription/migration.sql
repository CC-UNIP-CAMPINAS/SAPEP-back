/*
  Warnings:

  - Made the column `medicalPrescriptionId` on table `ExecutorsMedicalPrescription` required. This step will fail if there are existing NULL values in that column.
  - Made the column `executorId` on table `ExecutorsMedicalPrescription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ExecutorsMedicalPrescription` DROP FOREIGN KEY `ExecutorsMedicalPrescription_executorId_fkey`;

-- DropForeignKey
ALTER TABLE `ExecutorsMedicalPrescription` DROP FOREIGN KEY `ExecutorsMedicalPrescription_medicalPrescriptionId_fkey`;

-- AlterTable
ALTER TABLE `ExecutorsMedicalPrescription` MODIFY `medicalPrescriptionId` INTEGER NOT NULL,
    MODIFY `executorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `ExecutorsMedicalPrescription` ADD CONSTRAINT `ExecutorsMedicalPrescription_medicalPrescriptionId_fkey` FOREIGN KEY (`medicalPrescriptionId`) REFERENCES `MedicalPrescription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExecutorsMedicalPrescription` ADD CONSTRAINT `ExecutorsMedicalPrescription_executorId_fkey` FOREIGN KEY (`executorId`) REFERENCES `Nurse`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
