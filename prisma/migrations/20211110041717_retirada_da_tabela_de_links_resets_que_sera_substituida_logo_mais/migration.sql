/*
  Warnings:

  - You are about to drop the `LinkReset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `LinkReset` DROP FOREIGN KEY `LinkReset_idUser_fkey`;

-- DropTable
DROP TABLE `LinkReset`;
