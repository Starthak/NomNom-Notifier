-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('self', 'ofreex');

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "Delivery" "DeliveryType" NOT NULL DEFAULT 'ofreex';
