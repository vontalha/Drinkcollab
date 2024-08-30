/*
  Warnings:

  - You are about to drop the column `reminder` on the `invoices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "reminder",
ADD COLUMN     "reminderDate" TIMESTAMP(3),
ADD COLUMN     "reminderSent" INTEGER NOT NULL DEFAULT 0;
