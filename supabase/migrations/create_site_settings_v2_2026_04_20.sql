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
  ('company_name', 'MOPi Production'),('company_tagline', 'Creating Exceptional Exhibition Experiences'),
  ('company_description', 'We specialize in exhibition booth design, event production, and custom structures.'),
  ('company_email', 'info@mopiproduction.com'),('company_phone', '+1 (555) 123-4567'),
  ('company_address', '123 Exhibition Boulevard, New York, NY 10001, USA'),
  ('company_facebook', 'https://facebook.com/mopiproduction'),('company_instagram', 'https://instagram.com/mopiproduction'),
  ('company_linkedin', 'https://linkedin.com/company/mopiproduction'),('company_twitter', 'https://twitter.com/mopiproduction'),
  ('stat_projects', '500+'),('stat_experience', '15+'),('stat_clients', '200+'),('stat_countries', '50+')
ON CONFLICT (key) DO NOTHING;