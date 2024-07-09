/*
  Warnings:

  - The values [BEVERAGE] on the enum `CategoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryType_new" AS ENUM ('DRINK', 'SNACK');
ALTER TABLE "Drink" ALTER COLUMN "type" TYPE "CategoryType_new" USING ("type"::text::"CategoryType_new");
ALTER TABLE "Snack" ALTER COLUMN "type" TYPE "CategoryType_new" USING ("type"::text::"CategoryType_new");
ALTER TABLE "Category" ALTER COLUMN "type" TYPE "CategoryType_new" USING ("type"::text::"CategoryType_new");
ALTER TYPE "CategoryType" RENAME TO "CategoryType_old";
ALTER TYPE "CategoryType_new" RENAME TO "CategoryType";
DROP TYPE "CategoryType_old";
COMMIT;
