/*
  Warnings:

  - Added the required column `type` to the `Drink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Snack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drink" ADD COLUMN     "type" "CategoryType" NOT NULL;

-- AlterTable
ALTER TABLE "Snack" ADD COLUMN     "type" "CategoryType" NOT NULL;
