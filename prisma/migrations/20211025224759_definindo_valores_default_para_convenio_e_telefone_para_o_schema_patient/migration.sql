-- AlterTable
ALTER TABLE `Patient` MODIFY `phone` VARCHAR(191) DEFAULT 'NÃO CONSTA',
    MODIFY `healthInsurance` VARCHAR(191) DEFAULT 'NÃO CONSTA';

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;
