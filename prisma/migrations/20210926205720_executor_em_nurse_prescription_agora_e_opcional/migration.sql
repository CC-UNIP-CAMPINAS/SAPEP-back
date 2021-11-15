-- DropForeignKey
ALTER TABLE `NursePrescription` DROP FOREIGN KEY `NursePrescription_executorId_fkey`;

-- AlterTable
ALTER TABLE `NursePrescription` MODIFY `executorId` INTEGER;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `NursePrescription` ADD CONSTRAINT `NursePrescription_executorId_fkey` FOREIGN KEY (`executorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
