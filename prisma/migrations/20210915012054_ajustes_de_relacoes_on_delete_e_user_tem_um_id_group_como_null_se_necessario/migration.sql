-- DropForeignKey
ALTER TABLE `GroupPermission` DROP FOREIGN KEY `GroupPermission_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupPermission` DROP FOREIGN KEY `GroupPermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_groupId_fkey`;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT,
    MODIFY `groupId` INTEGER;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupPermission` ADD CONSTRAINT `GroupPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupPermission` ADD CONSTRAINT `GroupPermission_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
