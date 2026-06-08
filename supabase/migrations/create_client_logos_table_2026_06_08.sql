
-- Create the client logos management table
CREATE TABLE IF NOT EXISTS public.cms_client_logos_2026_06_08 (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL DEFAULT '',
  logo_url    TEXT        NOT NULL DEFAULT '',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cms_client_logos_2026_06_08 ENABLE ROW LEVEL SECURITY;

-- Allow public read (so website can fetch logos)
CREATE POLICY "public_read_client_logos_2026_06_08"
  ON public.cms_client_logos_2026_06_08
  FOR SELECT TO public
  USING (true);

-- Allow authenticated (admin) full access
CREATE POLICY "admin_all_client_logos_2026_06_08"
  ON public.cms_client_logos_2026_06_08
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed with a few placeholder rows so the dashboard isn't empty
INSERT INTO public.cms_client_logos_2026_06_08 (name, logo_url, sort_order, is_active) VALUES
  ('Samsung',    '', 1,  true),
  ('Huawei',     '', 2,  true),
  ('BMW',        '', 3,  true),
  ('KPMG',       '', 4,  true),
  ('Siemens',    '', 5,  true),
  ('Oracle',     '', 6,  true),
  ('Unilever',   '', 7,  true),
  ('Mastercard', '', 8,  true),
  ('Vodafone',   '', 9,  true),
  ('Shell',      '', 10, true),
  ('Bosch',      '', 11, true),
  ('Microsoft',  '', 12, true)
ON CONFLICT DO NOTHING;
