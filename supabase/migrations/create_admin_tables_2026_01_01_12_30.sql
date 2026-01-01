-- Create admin tables for MOPi Production CMS
-- Current time: 2026_01_01_12_30

-- Enable RLS
ALTER TABLE IF EXISTS public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.design_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Content sections table
CREATE TABLE IF NOT EXISTS public.content_sections_2026_01_01_12_30 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    cta_text VARCHAR(100),
    cta_link VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media files table
CREATE TABLE IF NOT EXISTS public.media_files_2026_01_01_12_30 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    file_url TEXT NOT NULL,
    alt_text TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_logo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio projects table
CREATE TABLE IF NOT EXISTS public.portfolio_projects_2026_01_01_12_30 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    client VARCHAR(255),
    location VARCHAR(255),
    project_date DATE,
    size_sqm INTEGER,
    visitors INTEGER,
    description TEXT,
    features JSONB,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    award VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Design settings table
CREATE TABLE IF NOT EXISTS public.design_settings_2026_01_01_12_30 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_name VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(50) DEFAULT 'text',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO settings table
CREATE TABLE IF NOT EXISTS public.seo_settings_2026_01_01_12_30 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_name VARCHAR(100) NOT NULL UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default content sections
INSERT INTO public.content_sections_2026_01_01_12_30 (section_name, title, subtitle, description, cta_text, cta_link) VALUES
('hero', 'Crafting Exceptional Exhibition Experiences', 'MOPi Production specializes in creating stunning exhibition booths, memorable events, and custom structures that elevate your brand presence.', NULL, 'Get Started', '/contact'),
('about', 'Building Excellence in Exhibition Design', 'With over 15 years of experience in the exhibition and event industry, MOPi Production has established itself as a leader in creating innovative and impactful brand experiences.', 'We are passionate creators, innovative designers, and meticulous builders dedicated to transforming your brand vision into extraordinary experiences.', 'Learn More About Us', '/about'),
('services_intro', 'Comprehensive Exhibition Solutions', 'From concept to completion, we provide end-to-end solutions for all your exhibition and event needs.', NULL, NULL, NULL),
('portfolio_intro', 'Our Latest Success Stories', 'Explore our portfolio of award-winning projects that have transformed brands and created memorable experiences worldwide.', NULL, 'View All Projects', '/portfolio');

-- Insert default design settings
INSERT INTO public.design_settings_2026_01_01_12_30 (setting_name, setting_value, setting_type) VALUES
('primary_color', '#F4A300', 'color'),
('secondary_color', '#2B2B2B', 'color'),
('background_color', '#FFFFFF', 'color'),
('text_color', '#000000', 'color'),
('heading_font', 'Poppins', 'font'),
('body_font', 'Inter', 'font');

-- Insert default SEO settings
INSERT INTO public.seo_settings_2026_01_01_12_30 (page_name, meta_title, meta_description, meta_keywords) VALUES
('home', 'MOPi Production - Exhibition Design & Event Production Experts', 'Professional exhibition booth design and event production services. Creating stunning displays and memorable experiences worldwide.', 'exhibition design, booth design, event production, trade show, custom structures'),
('about', 'About MOPi Production - 15+ Years of Exhibition Excellence', 'Learn about MOPi Production''s journey, team, and commitment to creating exceptional exhibition experiences since 2008.', 'about mopi production, exhibition company, design team, awards'),
('services', 'Exhibition Services - Booth Design, Event Production | MOPi Production', 'Comprehensive exhibition services including booth design, event production, custom structures, and branding solutions.', 'exhibition services, booth design services, event production, custom structures'),
('portfolio', 'Portfolio - Award-Winning Exhibition Projects | MOPi Production', 'Explore our portfolio of successful exhibition projects, trade show booths, and event productions across 50+ countries.', 'exhibition portfolio, trade show projects, booth examples, case studies'),
('contact', 'Contact MOPi Production - Get Your Free Exhibition Quote', 'Contact our exhibition experts for a free consultation and quote. Global offices in New York, London, Singapore, and Dubai.', 'contact exhibition company, free quote, exhibition consultation');

-- Insert sample portfolio projects
INSERT INTO public.portfolio_projects_2026_01_01_12_30 (title, category, client, location, project_date, size_sqm, visitors, description, features, image_url, is_featured, award) VALUES
('Tech Innovation Expo 2024', 'Exhibition', 'TechCorp International', 'Las Vegas, USA', '2024-03-15', 2000, 50000, 'A cutting-edge exhibition booth featuring interactive displays, holographic presentations, and immersive brand experiences.', '["Interactive Displays", "Holographic Technology", "LED Walls", "VR Experiences"]', 'https://images.unsplash.com/photo-1703849222937-8a050e8a0607?w=800&auto=format&fit=crop&q=80', true, 'Best Innovation Award 2024'),
('Global Healthcare Summit', 'Event', 'MedTech Solutions', 'Geneva, Switzerland', '2024-02-20', 5000, 15000, 'Complete event production for a three-day healthcare summit including main stage, breakout rooms, and networking areas.', '["Main Stage Design", "Audio-Visual Systems", "Lighting Design", "Live Streaming"]', 'https://images.unsplash.com/photo-1761618291331-535983ae4296?w=800&auto=format&fit=crop&q=80', false, NULL),
('Automotive Excellence Booth', 'Booth', 'AutoMax Industries', 'Detroit, USA', '2024-01-10', 800, 25000, 'Premium automotive exhibition booth showcasing luxury vehicles with sophisticated lighting and premium finishes.', '["Vehicle Display Platforms", "Premium Lighting", "Custom Fabrication", "Brand Integration"]', 'https://images.unsplash.com/photo-1765872460584-bb3165857ee3?w=800&auto=format&fit=crop&q=80', true, 'Design Excellence Award');

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON public.content_sections_2026_01_01_12_30 FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated users only" ON public.content_sections_2026_01_01_12_30 FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.media_files_2026_01_01_12_30 FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated users only" ON public.media_files_2026_01_01_12_30 FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.portfolio_projects_2026_01_01_12_30 FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated users only" ON public.portfolio_projects_2026_01_01_12_30 FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.design_settings_2026_01_01_12_30 FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated users only" ON public.design_settings_2026_01_01_12_30 FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.seo_settings_2026_01_01_12_30 FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated users only" ON public.seo_settings_2026_01_01_12_30 FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS on all tables
ALTER TABLE public.content_sections_2026_01_01_12_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files_2026_01_01_12_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects_2026_01_01_12_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_settings_2026_01_01_12_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings_2026_01_01_12_30 ENABLE ROW LEVEL SECURITY;