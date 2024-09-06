/*
  Warnings:

  - The values [OVERDUE] on the enum `InvoiceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvoiceStatus_new" AS ENUM ('PENDING', 'PAID');
ALTER TABLE "invoices" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "invoices" ALTER COLUMN "status" TYPE "InvoiceStatus_new" USING ("status"::text::"InvoiceStatus_new");
ALTER TYPE "InvoiceStatus" RENAME TO "InvoiceStatus_old";
ALTER TYPE "InvoiceStatus_new" RENAME TO "InvoiceStatus";
DROP TYPE "InvoiceStatus_old";
ALTER TABLE "invoices" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "InvoiceToken" DROP CONSTRAINT "InvoiceToken_invoiceId_fkey";

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "reminder" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "InvoiceToken" ADD CONSTRAINT "InvoiceToken_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
