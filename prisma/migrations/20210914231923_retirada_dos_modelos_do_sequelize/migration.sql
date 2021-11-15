/*
  Warnings:

  - You are about to drop the `SequelizeMeta` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Groups` MODIFY `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `Jwts` MODIFY `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `User` MODIFY `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- DropTable
DROP TABLE `SequelizeMeta`;

-- CreateIndex
CREATE INDEX `PK_IDUSER_JWT` ON `Jwts`(`idUser`);

-- AddForeignKey
ALTER TABLE `Jwts` ADD CONSTRAINT `PK_IDUSER_JWT` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
