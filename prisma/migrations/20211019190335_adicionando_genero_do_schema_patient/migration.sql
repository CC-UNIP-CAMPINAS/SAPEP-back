-- AlterTable
ALTER TABLE `Patient` ADD COLUMN `gender` VARCHAR(191) NOT NULL DEFAULT 'INDEFINIDO';

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;
