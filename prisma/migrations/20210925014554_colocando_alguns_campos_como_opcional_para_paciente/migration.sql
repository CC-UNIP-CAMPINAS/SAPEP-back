-- AlterTable
ALTER TABLE `Patient` ADD COLUMN `healthInsuranceCode` VARCHAR(191),
    MODIFY `healthInsurance` VARCHAR(191);

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;
