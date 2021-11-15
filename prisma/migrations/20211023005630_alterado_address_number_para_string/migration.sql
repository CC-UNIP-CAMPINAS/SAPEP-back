-- AlterTable
ALTER TABLE `Patient` MODIFY `addressNumber` VARCHAR(191) DEFAULT 'S/N';

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;
