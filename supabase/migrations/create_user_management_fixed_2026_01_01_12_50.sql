-- Create user management tables for MOPi Production Admin Dashboard (Fixed)
-- Current time: 2026_01_01_12_50

-- User profiles table (standalone, no foreign key to auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users_2026_01_01_12_50 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'editor',
    department VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table
CREATE TABLE IF NOT EXISTS public.user_roles_2026_01_01_12_50 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity logs table
CREATE TABLE IF NOT EXISTS public.user_activity_logs_2026_01_01_12_50 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions_2026_01_01_12_50 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.user_roles_2026_01_01_12_50 (role_name, role_description, permissions) VALUES
('super_admin', 'Super Administrator with full access', '{"content": true, "media": true, "users": true, "settings": true, "analytics": true, "portfolio": true}'),
('admin', 'Administrator with most permissions', '{"content": true, "media": true, "users": true, "settings": true, "analytics": true, "portfolio": true}'),
('editor', 'Content Editor with limited access', '{"content": true, "media": true, "users": false, "settings": false, "analytics": false, "portfolio": true}'),
('viewer', 'Read-only access to dashboard', '{"content": false, "media": false, "users": false, "settings": false, "analytics": true, "portfolio": false}');

-- Insert sample admin users
INSERT INTO public.admin_users_2026_01_01_12_50 (email, full_name, role, department, is_active) VALUES
('admin@mopiproduction.com', 'System Administrator', 'super_admin', 'IT', true),
('manager@mopiproduction.com', 'Content Manager', 'admin', 'Marketing', true),
('editor@mopiproduction.com', 'Content Editor', 'editor', 'Marketing', true),
('viewer@mopiproduction.com', 'Analytics Viewer', 'viewer', 'Analytics', true),
('sarah.johnson@mopiproduction.com', 'Sarah Johnson', 'admin', 'Design', true),
('michael.chen@mopiproduction.com', 'Michael Chen', 'editor', 'Project Management', true),
('emily.rodriguez@mopiproduction.com', 'Emily Rodriguez', 'editor', 'Design', true),
('david.kim@mopiproduction.com', 'David Kim', 'admin', 'Technical', true);

-- Insert sample activity logs
INSERT INTO public.user_activity_logs_2026_01_01_12_50 (user_email, action, resource_type, resource_id, details) VALUES
('admin@mopiproduction.com', 'login', 'auth', NULL, '{"success": true, "method": "email"}'),
('manager@mopiproduction.com', 'update_content', 'content', 'hero', '{"section": "hero", "field": "title"}'),
('editor@mopiproduction.com', 'upload_media', 'media', 'logo-new.png', '{"file_size": "256KB", "file_type": "image/png"}'),
('admin@mopiproduction.com', 'create_user', 'user', 'new-editor@mopiproduction.com', '{"role": "editor", "department": "Marketing"}'),
('manager@mopiproduction.com', 'update_portfolio', 'portfolio', 'tech-expo-2024', '{"action": "set_featured", "value": true}');

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users" ON public.admin_users_2026_01_01_12_50 FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.admin_users_2026_01_01_12_50 FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.user_roles_2026_01_01_12_50 FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.user_roles_2026_01_01_12_50 FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.user_activity_logs_2026_01_01_12_50 FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.user_activity_logs_2026_01_01_12_50 FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.user_sessions_2026_01_01_12_50 FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.user_sessions_2026_01_01_12_50 FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS on all tables
ALTER TABLE public.admin_users_2026_01_01_12_50 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles_2026_01_01_12_50 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs_2026_01_01_12_50 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions_2026_01_01_12_50 ENABLE ROW LEVEL SECURITY;