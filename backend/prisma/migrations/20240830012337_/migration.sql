/*
  Warnings:

  - Made the column `dueDate` on table `invoices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "dueDate" SET NOT NULL;
