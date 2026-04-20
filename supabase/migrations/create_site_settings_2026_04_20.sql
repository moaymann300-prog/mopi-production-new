CREATE TABLE IF NOT EXISTS site_settings_2026_04_20 (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE site_settings_2026_04_20 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_site" ON site_settings_2026_04_20 FOR SELECT USING (true);
CREATE POLICY "all_write_site" ON site_settings_2026_04_20 FOR ALL USING (true) WITH CHECK (true);
