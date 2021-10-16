-- DropForeignKey
ALTER TABLE `MedicalPrescription` DROP FOREIGN KEY `MedicalPrescription_executorId_fkey`;

-- DropForeignKey
ALTER TABLE `MedicalPrescription` DROP FOREIGN KEY `MedicalPrescription_prescriberId_fkey`;

-- DropForeignKey
ALTER TABLE `NursePrescription` DROP FOREIGN KEY `NursePrescription_executorId_fkey`;

-- DropForeignKey
ALTER TABLE `NursePrescription` DROP FOREIGN KEY `NursePrescription_prescriberId_fkey`;

-- DropForeignKey
ALTER TABLE `NurseReport` DROP FOREIGN KEY `NurseReport_signatoryId_fkey`;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `MedicalPrescription` ADD CONSTRAINT `MedicalPrescription_prescriberId_fkey` FOREIGN KEY (`prescriberId`) REFERENCES `Doctor`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalPrescription` ADD CONSTRAINT `MedicalPrescription_executorId_fkey` FOREIGN KEY (`executorId`) REFERENCES `Nurse`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NursePrescription` ADD CONSTRAINT `NursePrescription_prescriberId_fkey` FOREIGN KEY (`prescriberId`) REFERENCES `Nurse`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NursePrescription` ADD CONSTRAINT `NursePrescription_executorId_fkey` FOREIGN KEY (`executorId`) REFERENCES `Nurse`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NurseReport` ADD CONSTRAINT `NurseReport_signatoryId_fkey` FOREIGN KEY (`signatoryId`) REFERENCES `Nurse`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
