-- ================================================================
-- ENDO TECH GROUP OF INDUSTRIES - COMPLETE DATABASE INITIALIZATION
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- ================================================================

-- 1. Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- 2. PRODUCTS TABLE (Fully indexed, JSONB-backed)
-- ================================================================
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    product_type TEXT,
    pattern TEXT,
    cup_size TEXT,
    length TEXT,
    material TEXT,
    stock TEXT DEFAULT 'In Stock',
    description TEXT,
    image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    size_options JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '[]'::jsonb,
    sizes_table JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT true,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HIGH PERFORMANCE DATABASE INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
-- GIN Index on JSONB for sub-millisecond attribute & specs queries
CREATE INDEX IF NOT EXISTS idx_products_data_gin ON products USING gin(data);

-- ================================================================
-- 3. SITE CONTENT TABLE (Dynamic banners, text, navigation)
-- ================================================================
CREATE TABLE IF NOT EXISTS site_content (
    id TEXT PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 4. INQUIRIES / RFQ TABLE (Quotations submitted by clients)
-- ================================================================
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_no TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    country TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_ref ON inquiries(reference_no);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);

-- ================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for website and admin panel
DROP POLICY IF EXISTS "Allow public all on products" ON products;
CREATE POLICY "Allow public all on products" ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all on site_content" ON site_content;
CREATE POLICY "Allow public all on site_content" ON site_content FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all on inquiries" ON inquiries;
CREATE POLICY "Allow public all on inquiries" ON inquiries FOR ALL USING (true) WITH CHECK (true);

-- ================================================================
-- 6. INITIAL SEED DATA (Scalpel Handle No. 9 and default catalogue)
-- ================================================================
INSERT INTO products (
    id, code, name, slug, category, subcategory, product_type,
    pattern, cup_size, length, material, stock, description,
    image, gallery, size_options, specs, sizes_table, is_featured, data
) VALUES (
    'prod-sh-09',
    'SH-09',
    'Scalpel Handle No. 9',
    'scalpel-handle-no-9',
    'general-instrumentation',
    'Scalpels',
    'Scalpel Handles',
    'Fine Straight',
    '11.5 cm',
    '11.5 cm',
    'AISI 420 Surgical Stainless Steel',
    'In Stock',
    'Micro-surgical fine scalpel handle No. 9 for ophthalmic, plastic, and delicate general surgery procedures. High-precision tactile feedback grip forged from premium German stainless steel.',
    '/uploads/1795430545203-image_437.png',
    '["/uploads/1795430561426-Gemini_Generated_Image_ohw4bsohw4bsohw4.jpg", "/uploads/1795430569603-Gemini_Generated_Image_wtqo2ywtqo2ywtqo.jpg"]'::jsonb,
    '["11.5 cm", "13.5 cm"]'::jsonb,
    '[{"label": "Product", "value": "Scalpel Handle No. 9"}, {"label": "Article Number", "value": "SH-09"}, {"label": "Pattern", "value": "Fine Straight"}, {"label": "Blade Compatibility", "value": "Fits Blades No. 10, 11, 12, 15"}, {"label": "Length", "value": "11.5 cm"}, {"label": "Material", "value": "AISI 420 Medical Grade Stainless Steel"}, {"label": "Finish", "value": "Satin Matte Anti-Glare"}]'::jsonb,
    '[{"article_number": "SH-09", "pattern": "Fine Straight", "cup_size": "Standard", "length": "11.5 cm"}, {"article_number": "SH-03L", "pattern": "Long Straight", "cup_size": "Standard", "length": "21 cm"}, {"article_number": "SH-04L", "pattern": "Long Straight Heavy", "cup_size": "Standard", "length": "21 cm"}]'::jsonb,
    true,
    '{"id": "prod-sh-09", "code": "SH-09", "name": "Scalpel Handle No. 9", "slug": "scalpel-handle-no-9", "category": "general-instrumentation", "subcategory": "Scalpels", "product_type": "Scalpel Handles", "pattern": "Fine Straight", "cup_size": "11.5 cm", "length": "11.5 cm", "description": "Micro-surgical fine scalpel handle No. 9 for ophthalmic, plastic, and delicate general surgery procedures.", "image": "/uploads/1795430545203-image_437.png", "isFeatured": true}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET updated_at = NOW();
