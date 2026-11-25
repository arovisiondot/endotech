-- Fix missing columns for existing tables
-- Run this script in Supabase SQL editor (Dashboard → SQL Editor)

-- Add column `category` to `products` if it does not exist
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'uncategorized';

-- Add column `subcategory` if missing (optional)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- If you have another table where you used `category`, add it there as well.
-- Example for a generic table `some_table`:
-- ALTER TABLE some_table ADD COLUMN IF NOT EXISTS category TEXT;

-- After running, you can re‑run your original query.
