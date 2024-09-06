-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING';
