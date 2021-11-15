/*
  Warnings:

  - Made the column `nome` on table `Groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `token` on table `Jwts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expire` on table `Jwts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Groups` MODIFY `nome` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Jwts` MODIFY `token` VARCHAR(255) NOT NULL,
    MODIFY `expire` DATETIME(0) NOT NULL;
