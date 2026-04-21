
-- Verify and recreate all CMS tables if missing

-- 1. Site Settings
CREATE TABLE IF NOT EXISTS cms_site_settings_2026_04_21 (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT DEFAULT '',
  label TEXT NOT NULL,
  group_name TEXT NOT NULL DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Social Links
CREATE TABLE IF NOT EXISTS cms_social_links_2026_04_21 (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Logos
CREATE TABLE IF NOT EXISTS cms_logos_2026_04_21 (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  placement TEXT NOT NULL,
  url TEXT DEFAULT '',
  alt_text TEXT DEFAULT 'MOPi Production Logo',
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Hero Sections
CREATE TABLE IF NOT EXISTS cms_hero_sections_2026_04_21 (
  id SERIAL PRIMARY KEY,
  page TEXT UNIQUE NOT NULL,
  badge_text TEXT DEFAULT '',
  heading TEXT DEFAULT '',
  subheading TEXT DEFAULT '',
  cta_primary_label TEXT DEFAULT '',
  cta_primary_url TEXT DEFAULT '',
  cta_secondary_label TEXT DEFAULT '',
  cta_secondary_url TEXT DEFAULT '',
  bg_image_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Stats
CREATE TABLE IF NOT EXISTS cms_stats_2026_04_21 (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  value INT DEFAULT 0,
  suffix TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Services
CREATE TABLE IF NOT EXISTS cms_services_2026_04_21 (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Portfolio
CREATE TABLE IF NOT EXISTS cms_portfolio_2026_04_21 (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT '',
  client TEXT DEFAULT '',
  location TEXT DEFAULT '',
  project_date TEXT DEFAULT '',
  visitors TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  award TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Team Members
CREATE TABLE IF NOT EXISTS cms_team_2026_04_21 (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  email TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Testimonials
CREATE TABLE IF NOT EXISTS cms_testimonials_2026_04_21 (
  id SERIAL PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT '',
  company TEXT DEFAULT '',
  quote TEXT DEFAULT '',
  rating INT DEFAULT 5,
  image_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Media Library
CREATE TABLE IF NOT EXISTS cms_media_2026_04_21 (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- 11. About Content
CREATE TABLE IF NOT EXISTS cms_about_content_2026_04_21 (
  id SERIAL PRIMARY KEY,
  section TEXT NOT NULL,
  title TEXT DEFAULT '',
  content TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Contact Submissions
CREATE TABLE IF NOT EXISTS cms_contact_submissions_2026_04_21 (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  company TEXT DEFAULT '',
  service TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Nav Items
CREATE TABLE IF NOT EXISTS cms_nav_items_2026_04_21 (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Enable RLS ───
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

-- ─── RLS Policies: Public READ, Authenticated WRITE ───

-- Site Settings
DROP POLICY IF EXISTS "public_read_settings" ON cms_site_settings_2026_04_21;
DROP POLICY IF EXISTS "auth_write_settings" ON cms_site_settings_2026_04_21;
CREATE POLICY "public_read_settings" ON cms_site_settings_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_settings" ON cms_site_settings_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- Social Links
DROP POLICY IF EXISTS "public_read_socials" ON cms_social_links_2026_04_21;
DROP POLICY IF EXISTS "auth_write_socials" ON cms_social_links_2026_04_21;
CREATE POLICY "public_read_socials" ON cms_social_links_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_socials" ON cms_social_links_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- Logos
DROP POLICY IF EXISTS "public_read_logos" ON cms_logos_2026_04_21;
DROP POLICY IF EXISTS "auth_write_logos" ON cms_logos_2026_04_21;
CREATE POLICY "public_read_logos" ON cms_logos_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_logos" ON cms_logos_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- Hero Sections
DROP POLICY IF EXISTS "public_read_heroes" ON cms_hero_sections_2026_04_21;
DROP POLICY IF EXISTS "auth_write_heroes" ON cms_hero_sections_2026_04_21;
CREATE POLICY "public_read_heroes" ON cms_hero_sections_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_heroes" ON cms_hero_sections_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- Stats
DROP POLICY IF EXISTS "public_read_stats" ON cms_stats_2026_04_21;
DROP POLICY IF EXISTS "auth_write_stats" ON cms_stats_2026_04_21;
CREATE POLICY "public_read_stats" ON cms_stats_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_stats" ON cms_stats_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- Services
DROP POLICY IF EXISTS "public_read_services" ON cms_services_2026_04_21;
DROP POLICY IF EXISTS "auth_write_services" ON cms_services_2026_04_21;
CREATE POLICY "public_read_services" ON cms_services_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_services" ON cms_services_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- Portfolio
DROP POLICY IF EXISTS "public_read_portfolio" ON cms_portfolio_2026_04_21;
DROP POLICY IF EXISTS "auth_write_portfolio" ON cms_portfolio_2026_04_21;
CREATE POLICY "public_read_portfolio" ON cms_portfolio_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_portfolio" ON cms_portfolio_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- Team
DROP POLICY IF EXISTS "public_read_team" ON cms_team_2026_04_21;
DROP POLICY IF EXISTS "auth_write_team" ON cms_team_2026_04_21;
CREATE POLICY "public_read_team" ON cms_team_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_team" ON cms_team_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials
DROP POLICY IF EXISTS "public_read_testimonials" ON cms_testimonials_2026_04_21;
DROP POLICY IF EXISTS "auth_write_testimonials" ON cms_testimonials_2026_04_21;
CREATE POLICY "public_read_testimonials" ON cms_testimonials_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_testimonials" ON cms_testimonials_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- Media
DROP POLICY IF EXISTS "public_read_media" ON cms_media_2026_04_21;
DROP POLICY IF EXISTS "auth_write_media" ON cms_media_2026_04_21;
CREATE POLICY "public_read_media" ON cms_media_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_media" ON cms_media_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- About
DROP POLICY IF EXISTS "public_read_about" ON cms_about_content_2026_04_21;
DROP POLICY IF EXISTS "auth_write_about" ON cms_about_content_2026_04_21;
CREATE POLICY "public_read_about" ON cms_about_content_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_about" ON cms_about_content_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- Contact Submissions (public insert for contact form, auth read)
DROP POLICY IF EXISTS "public_insert_contact" ON cms_contact_submissions_2026_04_21;
DROP POLICY IF EXISTS "auth_read_contact" ON cms_contact_submissions_2026_04_21;
CREATE POLICY "public_insert_contact" ON cms_contact_submissions_2026_04_21 FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_contact" ON cms_contact_submissions_2026_04_21 FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_update_contact" ON cms_contact_submissions_2026_04_21 FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_contact" ON cms_contact_submissions_2026_04_21 FOR DELETE USING (auth.role() = 'authenticated');

-- Nav Items
DROP POLICY IF EXISTS "public_read_nav" ON cms_nav_items_2026_04_21;
DROP POLICY IF EXISTS "auth_write_nav" ON cms_nav_items_2026_04_21;
CREATE POLICY "public_read_nav" ON cms_nav_items_2026_04_21 FOR SELECT USING (true);
CREATE POLICY "auth_write_nav" ON cms_nav_items_2026_04_21 FOR ALL USING (auth.role() = 'authenticated');

-- ─── Seed Initial Data (only if empty) ───

-- Site Settings
INSERT INTO cms_site_settings_2026_04_21 (key, value, label, group_name) VALUES
  ('company_name', 'MOPi Production', 'Company Name', 'general'),
  ('tagline', 'Creating Extraordinary Events', 'Tagline', 'general'),
  ('email', 'info@mopiproduction.com', 'Contact Email', 'contact'),
  ('phone', '+966 50 000 0000', 'Phone Number', 'contact'),
  ('address', 'Riyadh, Saudi Arabia', 'Address', 'contact'),
  ('facebook', '', 'Facebook URL', 'social'),
  ('instagram', '', 'Instagram URL', 'social'),
  ('twitter', '', 'Twitter URL', 'social'),
  ('linkedin', '', 'LinkedIn URL', 'social'),
  ('youtube', '', 'YouTube URL', 'social')
ON CONFLICT (key) DO NOTHING;

-- Social Links
INSERT INTO cms_social_links_2026_04_21 (platform, url, icon, is_active, sort_order) VALUES
  ('Instagram', 'https://instagram.com/mopiproduction', 'instagram', true, 1),
  ('Facebook', 'https://facebook.com/mopiproduction', 'facebook', true, 2),
  ('Twitter', 'https://twitter.com/mopiproduction', 'twitter', true, 3),
  ('LinkedIn', 'https://linkedin.com/company/mopiproduction', 'linkedin', true, 4),
  ('YouTube', 'https://youtube.com/@mopiproduction', 'youtube', true, 5)
ON CONFLICT DO NOTHING;

-- Logos
INSERT INTO cms_logos_2026_04_21 (name, placement, url, alt_text, is_active) VALUES
  ('Header Logo', 'header', '', 'MOPi Production Logo', true),
  ('Footer Logo', 'footer', '', 'MOPi Production Logo', true)
ON CONFLICT DO NOTHING;

-- Hero Sections
INSERT INTO cms_hero_sections_2026_04_21 (page, badge_text, heading, subheading, cta_primary_label, cta_primary_url, cta_secondary_label, cta_secondary_url) VALUES
  ('home', 'Award-Winning Production', 'We Craft Experiences That Leave Marks', 'From corporate galas to entertainment spectacles — MOPi Production delivers world-class events in Saudi Arabia and beyond.', 'Explore Our Work', '#portfolio', 'Get a Quote', '/contact'),
  ('about', 'About MOPi', 'Our Story of Excellence', 'Driven by passion, powered by creativity, and committed to delivering unforgettable experiences.', 'Meet the Team', '#team', 'Our Services', '/services'),
  ('services', 'What We Do', 'Full-Spectrum Event Production', 'From concept to execution, we deliver comprehensive event solutions tailored to your vision.', 'View Packages', '#packages', 'Contact Us', '/contact'),
  ('portfolio', 'Our Work', 'Events That Define Excellence', 'Browse our portfolio of award-winning events, productions, and creative campaigns.', 'See All Projects', '#projects', 'Start a Project', '/contact'),
  ('contact', 'Get in Touch', 'Let''s Create Something Amazing', 'Have a project in mind? We''d love to hear about it. Reach out and let''s start the conversation.', 'Send Message', '#form', 'Call Us', 'tel:+966500000000')
ON CONFLICT (page) DO NOTHING;

-- Stats
INSERT INTO cms_stats_2026_04_21 (label, value, suffix, sort_order, is_active) VALUES
  ('Events Produced', 500, '+', 1, true),
  ('Happy Clients', 200, '+', 2, true),
  ('Years of Excellence', 10, '+', 3, true),
  ('Team Members', 50, '+', 4, true)
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
  ('mission', 'Our Mission', 'To create extraordinary experiences that connect people, inspire audiences, and leave lasting impressions through innovative event production.'),
  ('vision', 'Our Vision', 'To be the leading event production company in the Middle East, recognized for excellence, creativity, and transformative experiences.'),
  ('story', 'Our Story', 'Founded with a passion for creating unforgettable moments, MOPi Production has grown from a small team of creatives to a full-service event production powerhouse.')
ON CONFLICT DO NOTHING;
