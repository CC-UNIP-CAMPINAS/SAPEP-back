-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Nurse` (
    `coren` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Nurse_coren_key`(`coren`),
    UNIQUE INDEX `Nurse_userId_key`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Nurse` ADD CONSTRAINT `Nurse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `MedicalRecord_patientId_key` ON `MedicalRecord`(`patientId`);
DROP INDEX `MedicalRecord_patientId_unique` ON `MedicalRecord`;

-- RedefineIndex
CREATE UNIQUE INDEX `NurseReport_medicalPrescriptionId_key` ON `NurseReport`(`medicalPrescriptionId`);
DROP INDEX `NurseReport_medicalPrescriptionId_unique` ON `NurseReport`;

-- RedefineIndex
CREATE UNIQUE INDEX `NurseReport_nursePrescriptionId_key` ON `NurseReport`(`nursePrescriptionId`);
DROP INDEX `NurseReport_nursePrescriptionId_unique` ON `NurseReport`;
