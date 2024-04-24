/*
  Warnings:

  - You are about to drop the column `Delivery` on the `Seller` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "Delivery";

-- DropEnum
DROP TYPE "DeliveryType";
