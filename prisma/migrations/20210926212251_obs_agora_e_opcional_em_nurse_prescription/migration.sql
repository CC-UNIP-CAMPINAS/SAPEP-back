-- AlterTable
ALTER TABLE `NursePrescription` MODIFY `obs` VARCHAR(191);

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;
