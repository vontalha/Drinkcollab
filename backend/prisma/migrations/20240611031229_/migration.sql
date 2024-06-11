/*
  Warnings:

  - You are about to drop the column `drinkId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the `Drink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordResetToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Snack` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,productId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `productId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('DRINK', 'SNACK');

-- DropForeignKey
ALTER TABLE "Drink" DROP CONSTRAINT "Drink_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_drinkId_fkey";

-- DropForeignKey
ALTER TABLE "Snack" DROP CONSTRAINT "Snack_categoryId_fkey";

-- DropIndex
DROP INDEX "Like_userId_drinkId_key";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "type",
ADD COLUMN     "type" "ProductType" NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "drinkId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Drink";

-- DropTable
DROP TABLE "PasswordResetToken";

-- DropTable
DROP TABLE "Snack";

-- DropEnum
DROP TYPE "CategoryType";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "size" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    "type" "ProductType" NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_productId_key" ON "Like"("userId", "productId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
