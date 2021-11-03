/*
  Warnings:

  - You are about to drop the column `active` on the `Adm` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Nurse` table. All the data in the column will be lost.
  - You are about to drop the `GroupPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `GroupPermission` DROP FOREIGN KEY `GroupPermission_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupPermission` DROP FOREIGN KEY `GroupPermission_permissionId_fkey`;

-- AlterTable
ALTER TABLE `Adm` DROP COLUMN `active`;

-- AlterTable
ALTER TABLE `Doctor` DROP COLUMN `active`;

-- AlterTable
ALTER TABLE `Nurse` DROP COLUMN `active`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE `GroupPermission`;

-- DropTable
DROP TABLE `Permission`;

-- CreateIndex
CREATE INDEX `ExecutorsMedicalPrescription_medicalPrescriptionId_key` ON `ExecutorsMedicalPrescription`(`medicalPrescriptionId`);
