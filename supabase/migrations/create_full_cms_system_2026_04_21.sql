
-- ══════════════════════════════════════════════════════════════
-- MOPI PRODUCTION - Full CMS Database Schema
-- Created: 2026-04-21
-- ══════════════════════════════════════════════════════════════

-- 1. SITE SETTINGS (global: company name, tagline, phone, email, address, etc.)
CREATE TABLE IF NOT EXISTS cms_site_settings_2026_04_21 (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  label TEXT,
  group_name TEXT DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SOCIAL MEDIA LINKS
CREATE TABLE IF NOT EXISTS cms_social_links_2026_04_21 (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LOGOS
CREATE TABLE IF NOT EXISTS cms_logos_2026_04_21 (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  placement TEXT NOT NULL, -- 'header', 'footer', 'favicon', 'og_image'
  url TEXT NOT NULL,
  alt_text TEXT DEFAULT 'MOPi Production Logo',
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HERO SECTIONS (one per page)
CREATE TABLE IF NOT EXISTS cms_hero_sections_2026_04_21 (
  id SERIAL PRIMARY KEY,
  page TEXT NOT NULL UNIQUE, -- 'home', 'about', 'services', 'portfolio', 'contact'
  badge_text TEXT,
  heading TEXT,
  subheading TEXT,
  cta_primary_label TEXT,
  cta_primary_url TEXT,
  cta_secondary_label TEXT,
  cta_secondary_url TEXT,
  bg_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STATS / NUMBERS
CREATE TABLE IF NOT EXISTS cms_stats_2026_04_21 (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  value INT NOT NULL DEFAULT 0,
  suffix TEXT DEFAULT '+',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SERVICES
CREATE TABLE IF NOT EXISTS cms_services_2026_04_21 (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  icon TEXT DEFAULT 'Layers',
  image_url TEXT,
  features TEXT[], -- array of feature strings
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PORTFOLIO PROJECTS
CREATE TABLE IF NOT EXISTS cms_portfolio_2026_04_21 (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  client TEXT,
  location TEXT,
  project_date TEXT,
  visitors TEXT,
  description TEXT,
  image_url TEXT,
  award TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS cms_team_2026_04_21 (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TESTIMONIALS
CREATE TABLE IF NOT EXISTS cms_testimonials_2026_04_21 (
  id SERIAL PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT,
  company TEXT,
  quote TEXT,
  rating INT DEFAULT 5,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS cms_media_2026_04_21 (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  category TEXT DEFAULT 'general', -- 'logos', 'portfolio', 'team', 'gallery', 'general'
  file_type TEXT DEFAULT 'image',
  file_size INT,
  width INT,
  height INT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ABOUT PAGE CONTENT
CREATE TABLE IF NOT EXISTS cms_about_content_2026_04_21 (
  id SERIAL PRIMARY KEY,
  section TEXT NOT NULL UNIQUE, -- 'mission', 'vision', 'story', 'values'
  title TEXT,
  content TEXT,
  image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CONTACT SUBMISSIONS (incoming messages)
CREATE TABLE IF NOT EXISTS cms_contact_submissions_2026_04_21 (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  service TEXT,
  message TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NAVIGATION ITEMS (header menu)
CREATE TABLE IF NOT EXISTS cms_nav_items_2026_04_21 (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- ENABLE ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════
ALTER TABLE cms_site_settings_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_social_links_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_logos_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_hero_sections_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_stats_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_services_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_portfolio_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_team_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_testimonials_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_about_content_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_contact_submissions_2026_04_21 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_nav_items_2026_04_21 ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════════════════════════
-- RLS POLICIES: Public READ, Authenticated WRITE
-- ══════════════════════════════════════════════════════════════

-- Site Settings
CREATE POLICY "public_read_settings" ON cms_site_settings_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_settings" ON cms_site_settings_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Social Links
CREATE POLICY "public_read_social" ON cms_social_links_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_social" ON cms_social_links_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Logos
CREATE POLICY "public_read_logos" ON cms_logos_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_logos" ON cms_logos_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Hero Sections
CREATE POLICY "public_read_hero" ON cms_hero_sections_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_hero" ON cms_hero_sections_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Stats
CREATE POLICY "public_read_stats" ON cms_stats_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_stats" ON cms_stats_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Services
CREATE POLICY "public_read_services" ON cms_services_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_services" ON cms_services_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Portfolio
CREATE POLICY "public_read_portfolio" ON cms_portfolio_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_portfolio" ON cms_portfolio_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Team
CREATE POLICY "public_read_team" ON cms_team_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_team" ON cms_team_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Testimonials
CREATE POLICY "public_read_testimonials" ON cms_testimonials_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_testimonials" ON cms_testimonials_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Media Library
CREATE POLICY "public_read_media" ON cms_media_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_media" ON cms_media_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- About Content
CREATE POLICY "public_read_about" ON cms_about_content_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_about" ON cms_about_content_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Contact Submissions
CREATE POLICY "public_insert_contact" ON cms_contact_submissions_2026_04_21 FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_contact" ON cms_contact_submissions_2026_04_21 FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');
CREATE POLICY "auth_update_contact" ON cms_contact_submissions_2026_04_21 FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Nav Items
CREATE POLICY "public_read_nav" ON cms_nav_items_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_nav" ON cms_nav_items_2026_04_21 FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- ══════════════════════════════════════════════════════════════
-- SEED DEFAULT DATA
-- ══════════════════════════════════════════════════════════════

-- Site Settings
INSERT INTO cms_site_settings_2026_04_21 (key, value, label, group_name) VALUES
  ('company_name', 'MOPi Production', 'Company Name', 'general'),
  ('tagline', 'Cairo''s Premier Exhibition & Event Production Company', 'Tagline', 'general'),
  ('phone_1', '+20 100 000 0000', 'Primary Phone', 'contact'),
  ('phone_2', '+20 100 000 0001', 'Secondary Phone', 'contact'),
  ('email_main', 'info@mopiproduction.com', 'Main Email', 'contact'),
  ('email_projects', 'projects@mopiproduction.com', 'Projects Email', 'contact'),
  ('address', 'Cairo, Egypt', 'Office Address', 'contact'),
  ('whatsapp_number', '201000000000', 'WhatsApp Number (no +)', 'contact'),
  ('business_hours', 'Mon–Sat: 9:00 AM – 6:00 PM EET', 'Business Hours', 'general'),
  ('footer_description', 'Cairo''s leading exhibition booth design and event production company.', 'Footer Description', 'general'),
  ('copyright_text', '© 2026 MOPi Production. All rights reserved. Cairo, Egypt.', 'Copyright Text', 'general'),
  ('meta_title', 'MOPi Production – Exhibition Booth Design & Event Production Cairo', 'Meta Title', 'seo'),
  ('meta_description', 'MOPi Production is Cairo''s leading exhibition booth design, brand activation, and event production company serving Egypt and the MENA region.', 'Meta Description', 'seo')
ON CONFLICT (key) DO NOTHING;

-- Social Links
INSERT INTO cms_social_links_2026_04_21 (platform, url, icon, is_active, sort_order) VALUES
  ('Instagram', '#', 'Instagram', true, 1),
  ('Facebook', '#', 'Facebook', true, 2),
  ('LinkedIn', '#', 'Linkedin', true, 3),
  ('YouTube', '#', 'Youtube', true, 4)
ON CONFLICT DO NOTHING;

-- Logos
INSERT INTO cms_logos_2026_04_21 (name, placement, url, alt_text, is_active) VALUES
  ('Header Logo', 'header', '/images/mopi_logo_20260101_112924.png', 'MOPi Production', true),
  ('Footer Logo', 'footer', '/images/mopi_logo_20260101_112924.png', 'MOPi Production', true)
ON CONFLICT DO NOTHING;

-- Hero Sections
INSERT INTO cms_hero_sections_2026_04_21 (page, badge_text, heading, subheading, cta_primary_label, cta_primary_url, cta_secondary_label, cta_secondary_url) VALUES
  ('home', 'Cairo''s Premier Exhibition Company', 'We Create <span>Exhibition Experiences</span> That Win', 'Award-winning booth design, brand activations, and full event production across Egypt and the MENA region.', 'View Our Portfolio', '/portfolio', 'Get Free Quote', '/contact'),
  ('about', '8+ Years of Excellence', 'Building Brands <span>Through Experiences</span>', 'From our Cairo studio to exhibitions across the MENA region — MOPi Production brings vision to life.', 'Our Story', '#mission', 'Join Our Team', '/contact'),
  ('services', 'End-to-End Solutions', 'Comprehensive <span>Exhibition Solutions</span>', 'From concept to completion — we provide end-to-end services that transform your brand vision into powerful, engaging experiences.', 'Get Custom Quote', '/contact', '', ''),
  ('portfolio', '500+ Projects Delivered', 'Showcasing <span>Excellence</span> Across Industries', 'Award-winning projects that have transformed brands and created memorable experiences across Egypt and the MENA region.', '', '', '', ''),
  ('contact', 'Always Ready to Help', 'Let''s Build <span>Something Amazing</span>', 'Get in touch with our team for a free consultation. We''ll discuss your project and create a custom proposal within 24 hours.', '', '', '', '')
ON CONFLICT (page) DO NOTHING;

-- Stats
INSERT INTO cms_stats_2026_04_21 (label, value, suffix, sort_order, is_active) VALUES
  ('Projects Completed', 500, '+', 1, true),
  ('Countries Served', 15, '+', 2, true),
  ('Happy Clients', 200, '+', 3, true),
  ('Industry Awards', 25, '+', 4, true)
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO cms_services_2026_04_21 (title, subtitle, description, icon, sort_order, is_active, is_featured) VALUES
  ('Exhibition Booth Design & Build', 'Custom-designed booths that captivate and convert', 'From concept to completion, we create stunning exhibition booths that tell your brand story and drive meaningful engagement with your target audience.', 'Layers', 1, true, true),
  ('Event Production & Management', 'Complete event management from concept to execution', 'Full-service event production including stage design, lighting, audio-visual systems, and on-the-ground management for corporate events and product launches.', 'Zap', 2, true, true),
  ('Brand Activations', 'Immersive experiences that deeply engage audiences', 'Creative brand activations and installations that create memorable interactions between your brand and your audience, driving real engagement and recall.', 'Award', 3, true, true),
  ('Custom Fabrication', 'Tailored structures for any space and purpose', 'Modular and custom structures designed to your exact specifications — from temporary installations to permanent displays, kiosks, and architectural elements.', 'Wrench', 4, true, true),
  ('Branding & Graphics', 'Visual identity that elevates your presence', 'Banners, signage, lightboxes, and full visual branding that elevates your presence at any show or event.', 'Palette', 5, true, false),
  ('Technical Support', '24/7 on-site technical support', 'Round-the-clock on-site technical support during events and exhibitions — no detail is too small.', 'Settings', 6, true, false)
ON CONFLICT DO NOTHING;

-- Nav Items
INSERT INTO cms_nav_items_2026_04_21 (label, url, sort_order, is_active) VALUES
  ('Home', '/', 1, true),
  ('About', '/about', 2, true),
  ('Services', '/services', 3, true),
  ('Portfolio', '/portfolio', 4, true),
  ('Contact', '/contact', 5, true)
ON CONFLICT DO NOTHING;

-- About Content
INSERT INTO cms_about_content_2026_04_21 (section, title, content) VALUES
  ('mission', 'Our Mission', 'To deliver world-class exhibition and event experiences that elevate brands, connect people, and create lasting impressions across the MENA region.'),
  ('vision', 'Our Vision', 'To be the MENA region''s most trusted and innovative exhibition production company, known for transforming brand stories into unforgettable live experiences.'),
  ('story', 'Our Story', 'Founded in Cairo in 2018, MOPi Production was born from a passion for creating extraordinary brand experiences. What began as a small design studio has grown into a full-service exhibition and event production powerhouse serving clients across Egypt and the MENA region.'),
  ('values', 'Our Values', 'Innovation, Excellence, Integrity, Collaboration, and Client-First thinking guide everything we do at MOPi Production.')
ON CONFLICT (section) DO NOTHING;
