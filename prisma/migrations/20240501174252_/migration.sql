/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Pedido` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pedidoId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `valor` to the `Livro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pedidoId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Pedido` DROP FOREIGN KEY `Pedido_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `Usuario` DROP FOREIGN KEY `Usuario_perfilId_fkey`;

-- AlterTable
ALTER TABLE `Livro` ADD COLUMN `valor` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `Pedido` DROP COLUMN `usuarioId`;

-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `pedidoId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_pedidoId_key` ON `Usuario`(`pedidoId`);

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_perfilId_fkey` FOREIGN KEY (`perfilId`) REFERENCES `Perfil`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
