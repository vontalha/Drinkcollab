/*
  Warnings:

  - You are about to drop the column `paid` on the `invoices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "paid",
ALTER COLUMN "totalAmount" DROP NOT NULL;
