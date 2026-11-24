-- ================================================================
-- ENDO TECH GROUP OF INDUSTRIES - DATABASE SCHEMA
-- For Supabase PostgreSQL (Run this in Supabase SQL Editor)
-- ================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running (Clean slate)
DROP TABLE IF EXISTS inquiry_items CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS catalogs CASCADE;
DROP TABLE IF EXISTS events CASCADE;

-- ----------------------------------------------------------------
-- TABLE: categories (e.g., General Surgery, Dental Instruments, ENT)
-- ----------------------------------------------------------------
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20),                     -- e.g. "01", "02", "03"
    name VARCHAR(255) NOT NULL,            -- e.g. "General Surgery"
    slug VARCHAR(255) NOT NULL UNIQUE,     -- e.g. "general-surgery"
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE: subcategories (e.g., Scalpel Handles, Artery Forceps, Scissors)
-- ----------------------------------------------------------------
CREATE TABLE subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,            -- e.g. "Scalpel Handles"
    slug VARCHAR(255) NOT NULL,            -- e.g. "scalpel-handles"
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

-- ----------------------------------------------------------------
-- TABLE: products (e.g., Scalpel Handle No. 3, Kerrison Rongeur)
-- ----------------------------------------------------------------
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,            -- e.g. "Jackson Laryngeal Cup Forceps"
    slug VARCHAR(255) NOT NULL UNIQUE,
    article_code VARCHAR(100) NOT NULL,    -- e.g. "ET1-180-00" or "10-01"
    product_type VARCHAR(100),             -- e.g. "Scalpel Handles", "Bone Punch"
    pattern VARCHAR(100),                  -- e.g. "Angled", "Straight", "Curved"
    cup_size VARCHAR(50),                  -- e.g. "2 mm"
    length VARCHAR(50),                    -- e.g. "28 cm"
    description TEXT,
    features TEXT[],                       -- Array of bullet points
    image_url TEXT,
    additional_images TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE: product_variants (Sizes, dimensions, article numbers)
-- ----------------------------------------------------------------
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    article_number VARCHAR(100) NOT NULL,  -- e.g. "ET1-180-00", "ET1-181-00"
    pattern VARCHAR(100),                  -- e.g. "Angled"
    cup_size VARCHAR(50),                  -- e.g. "2 mm", "4 mm", "6 mm"
    length VARCHAR(50),                    -- e.g. "28 cm"
    description TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE: inquiries (Main RFQ / Inquiry Bag submissions)
-- ----------------------------------------------------------------
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no VARCHAR(50) NOT NULL UNIQUE,  -- e.g. "INQ-2026-0012"
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company_name VARCHAR(255),
    country VARCHAR(100),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',      -- pending, reviewed, quoted, closed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE: inquiry_items (Products attached to each inquiry)
-- ----------------------------------------------------------------
CREATE TABLE inquiry_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    article_code VARCHAR(100) NOT NULL,
    selected_size VARCHAR(100),
    quantity INT NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE: catalogs (Downloadable PDF Catalogues)
-- ----------------------------------------------------------------
CREATE TABLE catalogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,               -- e.g. "General Surgery Instruments Catalogue"
    category_name VARCHAR(100),                -- e.g. "General Surgery"
    description TEXT,
    file_size VARCHAR(50) DEFAULT '15 MB',
    pdf_url TEXT NOT NULL,                     -- URL to PDF
    thumbnail_url TEXT,
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE: events (Upcoming Trade Shows, Exhibitions & News)
-- ----------------------------------------------------------------
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,               -- e.g. "Arab Health Dubai 2026"
    slug VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255) NOT NULL,            -- e.g. "Dubai World Trade Centre, UAE"
    booth_number VARCHAR(100),                 -- e.g. "Hall 3, Booth Z3.B15"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    image_url TEXT,
    badge_label VARCHAR(50) DEFAULT 'Upcoming Exhibition',
    is_upcoming BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 1. Public can read catalogue, categories, products, events
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read product_variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Allow public read catalogs" ON catalogs FOR SELECT USING (true);
CREATE POLICY "Allow public read events" ON events FOR SELECT USING (true);

-- 2. Public can insert inquiries and inquiry_items (RFQ submission)
CREATE POLICY "Allow public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert inquiry_items" ON inquiry_items FOR INSERT WITH CHECK (true);

-- 3. Inquiries can only be viewed by authenticated users / service role (privacy protection)
CREATE POLICY "Allow authenticated read inquiries" ON inquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read inquiry_items" ON inquiry_items FOR SELECT USING (auth.role() = 'authenticated');

-- ================================================================
-- INITIAL SEED DATA (Based on your Endo Tech Design & Screenshots)
-- ================================================================

-- Categories
INSERT INTO categories (code, name, slug, description, image_url, display_order) VALUES
('01', 'General Surgery', 'general-surgery', 'High quality precision surgical instruments for hospital operating rooms.', '/images/general-surgery.jpg', 1),
('02', 'Dental Instruments', 'dental-instruments', 'Premium dental surgical, extraction, and diagnostic tools.', '/images/dental-instruments.jpg', 2),
('03', 'ENT Instruments', 'ent-instruments', 'Ear, Nose & Throat precision surgical instruments and micro-forceps.', '/images/ent-instruments.jpg', 3),
('04', 'Orthopedic Instruments', 'orthopedic-instruments', 'Bone punches, rongeurs, and orthopedic reconstructive tools.', '/images/orthopedic-instruments.jpg', 4),
('05', 'Cardiovascular', 'cardiovascular', 'Vascular clamps, micro-scissors, and cardiac surgical tools.', '/images/cardiovascular.jpg', 5),
('06', 'Gynecology', 'gynecology', 'Specialized obstetrics and gynecology instruments.', '/images/gynecology.jpg', 6);

-- Subcategories for General Surgery & ENT
WITH cat_general AS (SELECT id FROM categories WHERE slug = 'general-surgery' LIMIT 1),
     cat_ent AS (SELECT id FROM categories WHERE slug = 'ent-instruments' LIMIT 1)
INSERT INTO subcategories (category_id, name, slug, description, display_order)
SELECT cat_general.id, 'Scalpel Handles', 'scalpel-handles', 'Precision surgical blade and scalpel handles', 1 FROM cat_general
UNION ALL
SELECT cat_general.id, 'Scissors', 'scissors', 'Operating, dissecting, and fine surgical scissors', 2 FROM cat_general
UNION ALL
SELECT cat_general.id, 'Artery Forceps', 'artery-forceps', 'Hemostatic forceps and artery clamps', 3 FROM cat_general
UNION ALL
SELECT cat_general.id, 'Retractors', 'retractors', 'Tissue, abdominal and self-retaining retractors', 4 FROM cat_general
UNION ALL
SELECT cat_general.id, 'Needle Holders', 'needle-holders', 'Tungsten carbide and surgical needle holders', 5 FROM cat_general
UNION ALL
SELECT cat_ent.id, 'Laryngeal Forceps', 'laryngeal-forceps', 'Laryngeal cup forceps and punch instruments', 1 FROM cat_ent
UNION ALL
SELECT cat_ent.id, 'Kerrison Rongeurs', 'kerrison-rongeurs', 'Bone punching and spinal/cervical rongeurs', 2 FROM cat_ent;

-- Products (From your screenshots: Kerrison Rongeur, Scalpel Handles, Jackson Laryngeal Cup Forceps)
WITH sub_scalpel AS (SELECT id FROM subcategories WHERE slug = 'scalpel-handles' LIMIT 1),
     sub_laryngeal AS (SELECT id FROM subcategories WHERE slug = 'laryngeal-forceps' LIMIT 1),
     sub_kerrison AS (SELECT id FROM subcategories WHERE slug = 'kerrison-rongeurs' LIMIT 1)

INSERT INTO products (subcategory_id, name, slug, article_code, product_type, pattern, cup_size, length, description, features, image_url, is_featured)
SELECT 
    sub_kerrison.id,
    'Kerrison Rongeur Instruments',
    'kerrison-rongeur-instruments',
    'ET-KR-100',
    'Bone Punch / Rongeur',
    '45 Degree Up-Biting',
    '3 mm',
    '20 cm',
    'Engineered for Precision. Trusted in every spinal and orthopedic neurosurgical procedure. Manufactured from medical-grade surgical German stainless steel with gold titanium coating option.',
    ARRAY['Surgical Grade German Stainless Steel', 'Ultra-sharp cutting footplate', 'Durable ejector pin mechanism', 'Smooth action spring handle'],
    '/images/kerrison-rongeur.jpg',
    true
FROM sub_kerrison
UNION ALL
SELECT 
    sub_laryngeal.id,
    'Jackson Laryngeal Cup Forceps',
    'jackson-laryngeal-cup-forceps',
    'ET1-180-00',
    'ENT Instruments',
    'Angled',
    '2 mm',
    '28 cm',
    'Jackson Laryngeal Cup Forceps designed for laryngeal and vocal cord biopsy procedures. Delicate cup jaws provide secure grasp with minimal tissue trauma.',
    ARRAY['Surgical Grade Stainless Steel', 'Angled shaft for unobstructed visual field', 'Delicate cupped jaw with smooth serration', 'Available in multiple cup diameters'],
    '/images/jackson-forceps.jpg',
    true
FROM sub_laryngeal
UNION ALL
SELECT 
    sub_scalpel.id,
    'Scalpel Handle No. 3',
    'scalpel-handle-no-3',
    '10-01',
    'Scalpel Handle',
    'Straight',
    NULL,
    '12.5 cm',
    'Standard surgical scalpel handle No. 3 compatible with surgical blades No. 10 through 15.',
    ARRAY['Surgical stainless steel', 'Ergonomic non-slip grooved grip', 'Standard blade fitment fit 10-15', 'Fully autoclavable'],
    '/images/scalpel-handle-3.jpg',
    false
FROM sub_scalpel
UNION ALL
SELECT 
    sub_scalpel.id,
    'Scalpel Handle No. 4',
    'scalpel-handle-no-4',
    '10-04',
    'Scalpel Handle',
    'Straight',
    NULL,
    '13.5 cm',
    'Heavy pattern scalpel handle No. 4 compatible with surgical blades No. 20 through 25.',
    ARRAY['High-density medical steel', 'Fits blades 20-25', 'Balanced center of gravity', 'Corrosion resistant satin finish'],
    '/images/scalpel-handle-4.jpg',
    false
FROM sub_scalpel
UNION ALL
SELECT 
    sub_scalpel.id,
    'Scalpel Handle No. 7',
    'scalpel-handle-no-7',
    '10-07',
    'Scalpel Handle',
    'Slender / Contoured',
    NULL,
    '16 cm',
    'Long slender scalpel handle No. 7 for deep cavity incisions and precision dissection.',
    ARRAY['Long slender design', 'Fits blades 10-15', 'Ideal for deep surgical access', 'Precision balanced'],
    '/images/scalpel-handle-7.jpg',
    false
FROM sub_scalpel
UNION ALL
SELECT 
    sub_scalpel.id,
    'Scalpel Handle No. 9',
    'scalpel-handle-no-9',
    '10-09',
    'Scalpel Handle',
    'Straight Fine',
    NULL,
    '11.5 cm',
    'Micro-surgical fine scalpel handle No. 9 for ophthalmic and delicate procedures.',
    ARRAY['Micro delicate build', 'Fits blades 10-15', 'High tactile feedback', 'Non-glare finish'],
    '/images/scalpel-handle-9.jpg',
    false
FROM sub_scalpel
UNION ALL
SELECT 
    sub_scalpel.id,
    'Scalpel Handle No. 3L',
    'scalpel-handle-no-3l',
    '10-03L',
    'Scalpel Handle',
    'Long Straight',
    NULL,
    '21 cm',
    'Extra long scalpel handle No. 3L designed for deep abdominal and thoracic procedures.',
    ARRAY['Extra long 21 cm reach', 'Fits blades 10-15', 'Rigid shaft preventing deflection', 'Autoclavable'],
    '/images/scalpel-handle-3l.jpg',
    false
FROM sub_scalpel
UNION ALL
SELECT 
    sub_scalpel.id,
    'Scalpel Handle No. 4L',
    'scalpel-handle-no-4l',
    '10-04L',
    'Scalpel Handle',
    'Long Straight Heavy',
    NULL,
    '21 cm',
    'Extra long scalpel handle No. 4L for large blades in deep surgical access cavities.',
    ARRAY['Extra length 21 cm reach', 'Fits blades 20-25', 'Heavy pattern construction', 'Optimal leverage'],
    '/images/scalpel-handle-4l.jpg',
    false
FROM sub_scalpel;

-- Product Variants (Size matrix for Jackson Laryngeal Cup Forceps as seen in Screenshot 3)
WITH prod_jackson AS (SELECT id FROM products WHERE slug = 'jackson-laryngeal-cup-forceps' LIMIT 1)
INSERT INTO product_variants (product_id, article_number, pattern, cup_size, length, description)
SELECT prod_jackson.id, 'ET1-180-00', 'Angled', '2 mm', '28 cm', 'Cup diameter 2 mm, shaft 28 cm' FROM prod_jackson
UNION ALL
SELECT prod_jackson.id, 'ET1-181-00', 'Angled', '4 mm', '28 cm', 'Cup diameter 4 mm, shaft 28 cm' FROM prod_jackson
UNION ALL
SELECT prod_jackson.id, 'ET1-182-00', 'Angled', '6 mm', '28 cm', 'Cup diameter 6 mm, shaft 28 cm' FROM prod_jackson;

-- Catalogs (Downloadable Catalogues as requested)
INSERT INTO catalogs (title, category_name, description, file_size, pdf_url, thumbnail_url) VALUES
('General Surgery Full Catalogue 2026', 'General Surgery', 'Comprehensive catalog covering scalpel handles, forceps, scissors, retractors and clamps.', '18.4 MB', '/catalogs/general-surgery-catalog.pdf', '/images/catalog-general.jpg'),
('ENT & Laryngeal Instruments Catalogue', 'ENT Instruments', 'Dedicated Ear, Nose, Throat & Otolaryngology surgical instrumentation catalogue.', '12.1 MB', '/catalogs/ent-catalog.pdf', '/images/catalog-ent.jpg'),
('Dental Surgical & Diagnostic Catalogue', 'Dental Instruments', 'Complete range of extraction forceps, elevators, scalers, and implant surgery sets.', '14.8 MB', '/catalogs/dental-catalog.pdf', '/images/catalog-dental.jpg'),
('Endo Tech Master Product Directory', 'Complete Collection', 'The comprehensive 350-page complete product catalogue of Endo Tech Group of Industries.', '45.0 MB', '/catalogs/master-catalog.pdf', '/images/catalog-master.jpg');

-- Events (Exhibitions & Trade Shows as seen in Screenshot 4 & requested)
INSERT INTO events (title, slug, location, booth_number, start_date, end_date, description, image_url, badge_label, is_upcoming) VALUES
('Arab Health Dubai 2026', 'arab-health-dubai-2026', 'Dubai World Trade Centre, United Arab Emirates', 'Hall 3, Stand Z3.B15', '2026-01-26', '2026-01-29', 'Join Endo Tech Group of Industries at Arab Health 2026. Explore our latest precision surgical instruments and meet our export team.', '/images/event-arabhealth.jpg', 'Flagship Exhibition', true),
('Medica Düsseldorf 2026', 'medica-dusseldorf-2026', 'Messe Düsseldorf, Germany', 'Hall 10, Stand 10E42', '2026-11-16', '2026-11-19', 'The world leading medical trade fair. We will be exhibiting our complete CE & FDA certified surgical range.', '/images/event-medica.jpg', 'European Exhibition', true),
('IDS Cologne - International Dental Show', 'ids-cologne-2027', 'Koelnmesse, Cologne, Germany', 'Hall 4.2, Stand G080', '2027-03-09', '2027-03-13', 'Discover the next generation of precision dental extraction tools and surgical implantology sets.', '/images/event-ids.jpg', 'Dental Global Fair', true);
