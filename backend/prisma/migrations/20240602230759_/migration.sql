/*
  Warnings:

  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isOnline` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_verified",
DROP COLUMN "isOnline";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "RequestToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestToken_id_key" ON "RequestToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RequestToken_token_key" ON "RequestToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RequestToken_email_token_key" ON "RequestToken"("email", "token");
