-- CreateTable
CREATE TABLE "InvoiceToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceToken_id_key" ON "InvoiceToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceToken_token_key" ON "InvoiceToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceToken_email_token_key" ON "InvoiceToken"("email", "token");
