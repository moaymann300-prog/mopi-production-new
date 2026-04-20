-- SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings_2026_04_20 (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE site_settings_2026_04_20 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_site" ON site_settings_2026_04_20 FOR SELECT USING (true);
CREATE POLICY "all_write_site" ON site_settings_2026_04_20 FOR ALL USING (true) WITH CHECK (true);

INSERT INTO site_settings_2026_04_20 (key, value) VALUES
  ('company_name', 'MOPi Production'),
  ('company_tagline', 'Creating Exceptional Exhibition Experiences'),
  ('company_description', 'We specialize in exhibition booth design, event production, and custom structures.'),
  ('company_email', 'info@mopiproduction.com'),
  ('company_phone', '+1 (555) 123-4567'),
  ('company_address', '123 Exhibition Boulevard, New York, NY 10001, USA'),
  ('company_facebook', 'https://facebook.com/mopiproduction'),
  ('company_instagram', 'https://instagram.com/mopiproduction'),
  ('company_linkedin', 'https://linkedin.com/company/mopiproduction'),
  ('stat_projects', '500+'),
  ('stat_experience', '15+'),
  ('stat_clients', '200+'),
  ('stat_countries', '50+')
ON CONFLICT (key) DO NOTHING;

-- HERO SECTION
CREATE TABLE IF NOT EXISTS hero_section_2026_04_20 (
  id SERIAL PRIMARY KEY,
  page TEXT NOT NULL DEFAULT 'home',
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_primary_text TEXT,
  button_primary_link TEXT,
  button_secondary_text TEXT,
  button_secondary_link TEXT,
  background_image TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE hero_section_2026_04_20 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_hero" ON hero_section_2026_04_20 FOR SELECT USING (true);
CREATE POLICY "all_write_hero" ON hero_section_2026_04_20 FOR ALL USING (true) WITH CHECK (true);

INSERT INTO hero_section_2026_04_20 (page, title, subtitle, description, button_primary_text, button_primary_link, button_secondary_text, button_secondary_link, background_image) VALUES
  ('home', 'Creating Exceptional Exhibition Experiences', 'Exhibition Design & Event Production', 'We transform your vision into stunning exhibition booths and memorable events.', 'View Our Portfolio', '/portfolio', 'Get a Free Quote', '/contact', 'https://images.unsplash.com/photo-1703849222937-8a050e8a0607?w=1920&auto=format&fit=crop&q=80'),
  ('about', 'About MOPi Production', 'Our Story & Vision', 'Founded with a passion for creating extraordinary spaces.', 'Meet Our Team', '#team', 'View Portfolio', '/portfolio', 'https://images.unsplash.com/photo-1541888915364-aaeed51d238b?w=1920&auto=format&fit=crop&q=80'),
  ('services', 'Our Services', 'What We Do Best', 'Comprehensive solutions for all your exhibition and event needs.', 'Get a Quote', '/contact', 'See Our Work', '/portfolio', 'https://images.unsplash.com/photo-1656257683123-fd9cd2f2fb40?w=1920&auto=format&fit=crop&q=80'),
  ('portfolio', 'Our Portfolio', 'Projects We Are Proud Of', 'Explore our diverse portfolio from around the world.', 'Start Your Project', '/contact', 'All Projects', '#projects', 'https://images.unsplash.com/photo-1703849222937-8a050e8a0607?w=1920&auto=format&fit=crop&q=80'),
  ('contact', 'Get In Touch', 'Let''s Create Something Amazing', 'Ready to take your brand to the next level?', 'Send Message', '#form', 'Call Us Now', 'tel:+15551234567', 'https://images.unsplash.com/photo-1687062013633-f2d1a2686f09?w=1920&auto=format&fit=crop&q=80');
