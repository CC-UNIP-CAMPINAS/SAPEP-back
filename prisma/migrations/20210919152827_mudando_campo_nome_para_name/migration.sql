/*
  Warnings:

  - You are about to drop the column `nome` on the `Group` table. All the data in the column will be lost.
  - Added the required column `name` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Group` DROP COLUMN `nome`,
    ADD COLUMN `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;
