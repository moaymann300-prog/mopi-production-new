-- =============================
-- FULL CMS TABLES FOR MOPI PRODUCTION
-- Created: 2026_04_20
-- =============================

-- 1. SITE SETTINGS (company info, contact details, SEO)
CREATE TABLE IF NOT EXISTS site_settings_2026_04_20 (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE site_settings_2026_04_20 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_site_settings" ON site_settings_2026_04_20 FOR SELECT USING (true);
CREATE POLICY "all_write_site_settings" ON site_settings_2026_04_20 FOR ALL USING (true) WITH CHECK (true);

INSERT INTO site_settings_2026_04_20 (key, value) VALUES
  ('company_name', 'MOPi Production'),
  ('company_tagline', 'Creating Exceptional Exhibition Experiences'),
  ('company_description', 'We specialize in exhibition booth design, event production, and custom structures that elevate your brand.'),
  ('company_email', 'info@mopiproduction.com'),
  ('company_phone', '+1 (555) 123-4567'),
  ('company_address', '123 Exhibition Boulevard, New York, NY 10001, USA'),
  ('company_facebook', 'https://facebook.com/mopiproduction'),
  ('company_instagram', 'https://instagram.com/mopiproduction'),
  ('company_linkedin', 'https://linkedin.com/company/mopiproduction'),
  ('company_twitter', 'https://twitter.com/mopiproduction'),
  ('seo_title', 'MOPi Production - Exhibition Booth Design & Event Production'),
  ('seo_description', 'Leading exhibition booth design and event production company with 15+ years of experience across 50+ countries.'),
  ('seo_keywords', 'exhibition booth, event production, trade show, custom structures, brand activation'),
  ('stat_projects', '500+'),
  ('stat_experience', '15+'),
  ('stat_clients', '200+'),
  ('stat_countries', '50+')
ON CONFLICT (key) DO NOTHING;

-- 2. HERO SECTION
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
  ('home', 'Creating Exceptional Exhibition Experiences', 'Exhibition Design & Event Production', 'We transform your vision into stunning exhibition booths and memorable events that captivate audiences worldwide.', 'View Our Portfolio', '/portfolio', 'Get a Free Quote', '/contact', 'https://images.unsplash.com/photo-1703849222937-8a050e8a0607?w=1920&auto=format&fit=crop&q=80'),
  ('about', 'About MOPi Production', 'Our Story & Vision', 'Founded with a passion for creating extraordinary spaces, MOPi Production has been at the forefront of exhibition design and event production for over 15 years.', 'Meet Our Team', '#team', 'View Portfolio', '/portfolio', 'https://images.unsplash.com/photo-1541888915364-aaeed51d238b?w=1920&auto=format&fit=crop&q=80'),
  ('services', 'Our Services', 'What We Do Best', 'From concept to execution, we offer comprehensive solutions for all your exhibition and event needs.', 'Get a Quote', '/contact', 'See Our Work', '/portfolio', 'https://images.unsplash.com/photo-1656257683123-fd9cd2f2fb40?w=1920&auto=format&fit=crop&q=80'),
  ('portfolio', 'Our Portfolio', 'Projects We Are Proud Of', 'Explore our diverse portfolio of exhibition booths, event productions, and custom structures from around the world.', 'Start Your Project', '/contact', 'All Projects', '#projects', 'https://images.unsplash.com/photo-1703849222937-8a050e8a0607?w=1920&auto=format&fit=crop&q=80'),
  ('contact', 'Get In Touch', 'Let''s Create Something Amazing', 'Ready to take your brand to the next level? Contact us today for a free consultation and quote.', 'Send Message', '#form', 'Call Us Now', 'tel:+15551234567', 'https://images.unsplash.com/photo-1687062013633-f2d1a2686f09?w=1920&auto=format&fit=crop&q=80');

-- 3. SERVICES
CREATE TABLE IF NOT EXISTS services_2026_04_20 (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image TEXT,
  icon TEXT,
  features TEXT[],
  process_steps TEXT[],
  pricing TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE services_2026_04_20 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_services" ON services_2026_04_20 FOR SELECT USING (true);
CREATE POLICY "all_write_services" ON services_2026_04_20 FOR ALL USING (true) WITH CHECK (true);

INSERT INTO services_2026_04_20 (title, subtitle, description, image, features, pricing, is_featured, sort_order) VALUES
  ('Exhibition Booth Design', 'Custom-designed booths that captivate and convert', 'From concept to completion, we create stunning exhibition booths that tell your brand story and drive meaningful engagement.', './images/hero_booth_20260101_112925.png', ARRAY['Custom Design','3D Visualization','Premium Materials','On-site Installation'], 'Starting from $15,000', true, 1),
  ('Event Production', 'Complete event management from concept to execution', 'Full-service event production including stage design, lighting, audio-visual systems, and technical support.', './images/hero_event_20260101_112925.png', ARRAY['Stage Design','Professional Lighting','Audio-Visual Integration','Project Management'], 'Starting from $25,000', true, 2),
  ('Custom Structures', 'Tailored architectural solutions for any space', 'Modular and custom structures designed to meet your specific requirements.', 'https://images.unsplash.com/photo-1656257683123-fd9cd2f2fb40?w=600&auto=format&fit=crop&q=80', ARRAY['Modular Design Systems','Custom Fabrication','Structural Engineering','Quick Assembly'], 'Starting from $10,000', false, 3),
  ('Branding & Fabrication', 'Professional branding and high-quality fabrication', 'Professional branding solutions and high-quality fabrication for all your display needs.', 'https://images.unsplash.com/photo-1632239336383-5bfb856151f7?w=600&auto=format&fit=crop&q=80', ARRAY['Brand Integration','Quality Materials','Fast Turnaround','Custom Printing'], 'Starting from $5,000', false, 4);

-- 4. PORTFOLIO PROJECTS
CREATE TABLE IF NOT EXISTS portfolio_2026_04_20 (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  client TEXT,
  location TEXT,
  project_date TEXT,
  size TEXT,
  visitors TEXT,
  description TEXT,
  image TEXT,
  gallery_images TEXT[],
  features TEXT[],
  award TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE portfolio_2026_04_20 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_portfolio" ON portfolio_2026_04_20 FOR SELECT USING (true);
CREATE POLICY "all_write_portfolio" ON portfolio_2026_04_20 FOR ALL USING (true) WITH CHECK (true);

INSERT INTO portfolio_2026_04_20 (title, category, client, location, project_date, size, visitors, description, image, features, award, is_featured, sort_order) VALUES
  ('Tech Innovation Expo 2026', 'Exhibition', 'TechCorp International', 'Las Vegas, USA', 'March 2026', '2000 sqm', '50,000+', 'A cutting-edge exhibition booth featuring interactive displays and holographic presentations.', 'https://images.unsplash.com/photo-1703849222937-8a050e8a0607?w=800&auto=format&fit=crop&q=80', ARRAY['Interactive Displays','Holographic Technology','LED Walls','VR Experiences'], 'Best Innovation Award 2026', true, 1),
  ('Global Healthcare Summit', 'Event', 'MedTech Solutions', 'Geneva, Switzerland', 'February 2026', '5000 sqm', '15,000+', 'Complete event production for a three-day healthcare summit.', 'https://images.unsplash.com/photo-1761618291331-535983ae4296?w=800&auto=format&fit=crop&q=80', ARRAY['Main Stage Design','Audio-Visual Systems','Lighting Design','Live Streaming'], NULL, true, 2),
  ('Automotive Excellence Booth', 'Booth', 'AutoMax Industries', 'Detroit, USA', 'January 2026', '800 sqm', '25,000+', 'Premium automotive exhibition booth showcasing luxury vehicles.', 'https://images.unsplash.com/photo-1765872460584-bb3165857ee3?w=800&auto=format&fit=crop&q=80', ARRAY['Vehicle Display Platforms','Premium Lighting','Custom Fabrication','Brand Integration'], 'Design Excellence Award', false, 3),
  ('Corporate Annual Conference', 'Corporate', 'Global Finance Corp', 'New York, USA', 'December 2025', '3000 sqm', '8,000+', 'Elegant corporate event setup with multiple conference rooms.', 'https://images.unsplash.com/photo-1564980245582-dc1a1af5620e?w=800&auto=format&fit=crop&q=80', ARRAY['Multi-Room Setup','Executive Lounges','Networking Areas','Branding Integration'], NULL, false, 4);

-- 5. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS team_members_2026_04_20 (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  image TEXT,
  experience TEXT,
  email TEXT,
  linkedin TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE team_members_2026_04_20 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_team" ON team_members_2026_04_20 FOR SELECT USING (true);
CREATE POLICY "all_write_team" ON team_members_2026_04_20 FOR ALL USING (true) WITH CHECK (true);

INSERT INTO team_members_2026_04_20 (name, role, bio, image, experience, sort_order) VALUES
  ('Sarah Johnson', 'Creative Director', 'Leading our creative vision with 12+ years of award-winning design experience.', 'https://images.unsplash.com/photo-1541888915364-aaeed51d238b?w=400&auto=format&fit=crop&q=80', '12+ years', 1),
  ('Michael Chen', 'Project Manager', 'Ensuring seamless project delivery with precision and professionalism.', 'https://images.unsplash.com/photo-1574313428745-ea9221d581ee?w=400&auto=format&fit=crop&q=80', '10+ years', 2),
  ('Emily Rodriguez', 'Design Lead', 'Creating visually stunning and functional spaces that tell brand stories.', 'https://images.unsplash.com/photo-1687062013633-f2d1a2686f09?w=400&auto=format&fit=crop&q=80', '8+ years', 3),
  ('David Kim', 'Technical Director', 'Bringing innovative technical solutions to every project.', 'https://images.unsplash.com/photo-1659353588615-daca46eab6cf?w=400&auto=format&fit=crop&q=80', '15+ years', 4);

-- 6. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials_2026_04_20 (
  id SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_image TEXT,
  testimonial TEXT,
  rating INT DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE testimonials_2026_04_20 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_testimonials" ON testimonials_2026_04_20 FOR SELECT USING (true);
CREATE POLICY "all_write_testimonials" ON testimonials_2026_04_20 FOR ALL USING (true) WITH CHECK (true);

INSERT INTO testimonials_2026_04_20 (client_name, client_title, client_company, testimonial, rating, is_featured, sort_order) VALUES
  ('John Smith', 'Marketing Director', 'TechCorp International', 'MOPi Production exceeded our expectations. The exhibition booth was absolutely stunning and attracted thousands of visitors.', 5, true, 1),
  ('Maria Garcia', 'Event Manager', 'Global Healthcare', 'Professional, creative, and delivered on time. Our healthcare summit was a massive success thanks to MOPi.', 5, true, 2),
  ('Robert Lee', 'CEO', 'AutoMax Industries', 'The attention to detail and quality of work is unmatched. Our automotive booth was the highlight of the entire show.', 5, true, 3);

-- 7. CONTACT FORM SUBMISSIONS
CREATE TABLE IF NOT EXISTS contact_submissions_2026_04_20 (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  company TEXT,
  phone TEXT,
  service TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE contact_submissions_2026_04_20 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_contact" ON contact_submissions_2026_04_20 FOR INSERT WITH CHECK (true);
CREATE POLICY "all_read_contact" ON contact_submissions_2026_04_20 FOR SELECT USING (true);
CREATE POLICY "all_update_contact" ON contact_submissions_2026_04_20 FOR UPDATE USING (true);
CREATE POLICY "all_delete_contact" ON contact_submissions_2026_04_20 FOR DELETE USING (true);

-- 8. MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS media_library_2026_04_20 (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image',
  size TEXT,
  alt_text TEXT,
  section TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE media_library_2026_04_20 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_media" ON media_library_2026_04_20 FOR SELECT USING (true);
CREATE POLICY "all_write_media" ON media_library_2026_04_20 FOR ALL USING (true) WITH CHECK (true);

INSERT INTO media_library_2026_04_20 (name, url, type, section, alt_text) VALUES
  ('Hero Booth Image', './images/hero_booth_20260101_112925.png', 'image', 'hero', 'Exhibition Booth'),
  ('Hero Event Image', './images/hero_event_20260101_112925.png', 'image', 'hero', 'Event Production'),
  ('About Office Image', './images/about_office_20260101_112926.png', 'image', 'about', 'Office'),
  ('MOPi Logo', './images/mopi_logo_20260101_112924.png', 'image', 'logo', 'MOPi Logo');
