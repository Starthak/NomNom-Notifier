/*
  Warnings:

  - You are about to drop the column `AccountNumber` on the `Seller` table. All the data in the column will be lost.
  - Added the required column `accountNumber` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "AccountNumber",
ADD COLUMN     "accountNumber" TEXT NOT NULL;
