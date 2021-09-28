/*
  Warnings:

  - You are about to drop the column `signatory` on the `NurseReport` table. All the data in the column will be lost.
  - Added the required column `signatoryId` to the `NurseReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NurseReport` DROP COLUMN `signatory`,
    ADD COLUMN `signatoryId` INTEGER NOT NULL,
    MODIFY `reportDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `NurseReport` ADD CONSTRAINT `NurseReport_signatoryId_fkey` FOREIGN KEY (`signatoryId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
