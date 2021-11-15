-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `MedicalPrescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `drug` VARCHAR(191) NOT NULL,
    `drugDosage` VARCHAR(191) NOT NULL,
    `drugWay` VARCHAR(191) NOT NULL,
    `administrationInterval` VARCHAR(191) NOT NULL,
    `prescriptionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `realized` BOOLEAN NOT NULL DEFAULT false,
    `obs` VARCHAR(191),
    `executionDate` DATETIME(3),
    `medicalRecordId` INTEGER NOT NULL,
    `prescriberId` INTEGER NOT NULL,
    `executorId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MedicalPrescription` ADD CONSTRAINT `MedicalPrescription_medicalRecordId_fkey` FOREIGN KEY (`medicalRecordId`) REFERENCES `MedicalRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalPrescription` ADD CONSTRAINT `MedicalPrescription_prescriberId_fkey` FOREIGN KEY (`prescriberId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalPrescription` ADD CONSTRAINT `MedicalPrescription_executorId_fkey` FOREIGN KEY (`executorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
