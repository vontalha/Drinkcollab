-- CreateTable
CREATE TABLE "InvoiceToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "invoiceId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceToken_id_key" ON "InvoiceToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceToken_token_key" ON "InvoiceToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceToken_invoiceId_key" ON "InvoiceToken"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceToken_email_token_key" ON "InvoiceToken"("email", "token");

-- AddForeignKey
ALTER TABLE "InvoiceToken" ADD CONSTRAINT "InvoiceToken_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
