-- AlterTable
ALTER TABLE `NursePrescription` MODIFY `prescriptionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `realized` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `executionDate` DATETIME(3);

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;
