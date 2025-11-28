-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_key_key" ON "Category"("key");

-- Insert initial categories
INSERT INTO "Category" ("key", "icon", "createdAt", "updatedAt") VALUES 
  ('locations', 'map-pin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('attractions', 'compass', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('routes', 'route', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add categoryId column (nullable first)
ALTER TABLE "Item" ADD COLUMN "categoryId" INTEGER;

-- Update existing items to map their string category to category ID
UPDATE "Item" SET "categoryId" = (
  SELECT "id" FROM "Category" 
  WHERE LOWER("Category"."key") = LOWER("Item"."category")
  LIMIT 1
);

-- Make categoryId required and drop old category column
ALTER TABLE "Item" ALTER COLUMN "categoryId" SET NOT NULL;
ALTER TABLE "Item" DROP COLUMN "category";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;