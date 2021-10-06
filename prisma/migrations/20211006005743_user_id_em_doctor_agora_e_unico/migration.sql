-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- RedefineIndex
CREATE UNIQUE INDEX `Doctor_userId_key` ON `Doctor`(`userId`);
DROP INDEX `Doctor_userId_unique` ON `Doctor`;
