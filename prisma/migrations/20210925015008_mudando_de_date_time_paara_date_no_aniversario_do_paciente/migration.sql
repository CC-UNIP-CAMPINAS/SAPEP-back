-- AlterTable
ALTER TABLE `Patient` MODIFY `birthday` DATE NOT NULL;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;
