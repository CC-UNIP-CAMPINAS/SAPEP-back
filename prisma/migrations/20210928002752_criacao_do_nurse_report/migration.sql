-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `NurseReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reportDate` DATETIME(3) NOT NULL,
    `report` VARCHAR(191) NOT NULL,
    `signatory` INTEGER NOT NULL,
    `medicalRecordId` INTEGER NOT NULL,
    `medicalPrescriptionId` INTEGER,
    `nursePrescriptionId` INTEGER,

    UNIQUE INDEX `NurseReport_medicalPrescriptionId_unique`(`medicalPrescriptionId`),
    UNIQUE INDEX `NurseReport_nursePrescriptionId_unique`(`nursePrescriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NurseReport` ADD CONSTRAINT `NurseReport_medicalRecordId_fkey` FOREIGN KEY (`medicalRecordId`) REFERENCES `MedicalRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NurseReport` ADD CONSTRAINT `NurseReport_medicalPrescriptionId_fkey` FOREIGN KEY (`medicalPrescriptionId`) REFERENCES `MedicalPrescription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NurseReport` ADD CONSTRAINT `NurseReport_nursePrescriptionId_fkey` FOREIGN KEY (`nursePrescriptionId`) REFERENCES `NursePrescription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
