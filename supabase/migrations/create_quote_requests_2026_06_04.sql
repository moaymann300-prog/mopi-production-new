
CREATE TABLE IF NOT EXISTS public.quote_requests_2026_06_04 (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  exhibition_name TEXT,
  exhibition_date TEXT,
  exhibition_venue TEXT,
  stand_dimension TEXT,
  layout TEXT,
  flooring TEXT,
  platform TEXT,
  meeting_room TEXT,
  double_deck TEXT,
  storage_room TEXT,
  required_items TEXT[],
  floor_plan_url TEXT,
  brand_guidelines_url TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quote_requests_2026_06_04 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert quote requests" ON public.quote_requests_2026_06_04
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read quote requests" ON public.quote_requests_2026_06_04
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update quote requests" ON public.quote_requests_2026_06_04
  FOR UPDATE USING (auth.role() = 'authenticated');
