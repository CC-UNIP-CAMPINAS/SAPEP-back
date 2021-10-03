/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rg]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Patient_cpf_key` ON `Patient`(`cpf`);

-- CreateIndex
CREATE UNIQUE INDEX `Patient_rg_key` ON `Patient`(`rg`);
