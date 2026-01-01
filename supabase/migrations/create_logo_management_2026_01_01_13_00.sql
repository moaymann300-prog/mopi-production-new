-- Create logo management table for MOPi Production
-- Current time: 2026_01_01_13_00

-- Logo management table
CREATE TABLE IF NOT EXISTS public.logo_settings_2026_01_01_13_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    logo_type VARCHAR(50) NOT NULL UNIQUE, -- 'header' or 'footer'
    logo_url TEXT NOT NULL,
    logo_name VARCHAR(255),
    file_size INTEGER,
    alt_text VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default logo settings
INSERT INTO public.logo_settings_2026_01_01_13_00 (logo_type, logo_url, logo_name, alt_text) VALUES
('header', './images/mopi_logo_20260101_112924.png', 'mopi_logo_header.png', 'MOPi Production Header Logo'),
('footer', './images/mopi_logo_20260101_112924.png', 'mopi_logo_footer.png', 'MOPi Production Footer Logo');

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON public.logo_settings_2026_01_01_13_00 FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated users" ON public.logo_settings_2026_01_01_13_00 FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS
ALTER TABLE public.logo_settings_2026_01_01_13_00 ENABLE ROW LEVEL SECURITY;