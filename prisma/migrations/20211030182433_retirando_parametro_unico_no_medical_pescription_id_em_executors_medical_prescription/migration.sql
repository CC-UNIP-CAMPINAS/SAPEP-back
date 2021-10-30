-- AlterTable
ALTER TABLE `Patient` MODIFY `complement` VARCHAR(191) DEFAULT 'NÃO CONSTA';

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;
