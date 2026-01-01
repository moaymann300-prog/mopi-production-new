-- Create user management tables for MOPi Production Admin Dashboard
-- Current time: 2026_01_01_12_45

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles_2026_01_01_12_45 (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'editor',
    department VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table
CREATE TABLE IF NOT EXISTS public.user_roles_2026_01_01_12_45 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity logs table
CREATE TABLE IF NOT EXISTS public.user_activity_logs_2026_01_01_12_45 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions_2026_01_01_12_45 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address INET,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.user_roles_2026_01_01_12_45 (role_name, role_description, permissions) VALUES
('super_admin', 'Super Administrator with full access', '{"content": true, "media": true, "users": true, "settings": true, "analytics": true, "portfolio": true}'),
('admin', 'Administrator with most permissions', '{"content": true, "media": true, "users": false, "settings": true, "analytics": true, "portfolio": true}'),
('editor', 'Content Editor with limited access', '{"content": true, "media": true, "users": false, "settings": false, "analytics": false, "portfolio": true}'),
('viewer', 'Read-only access to dashboard', '{"content": false, "media": false, "users": false, "settings": false, "analytics": true, "portfolio": false}');

-- Insert sample admin users
INSERT INTO public.user_profiles_2026_01_01_12_45 (id, email, full_name, role, department, is_active) VALUES
(gen_random_uuid(), 'admin@mopiproduction.com', 'System Administrator', 'super_admin', 'IT', true),
(gen_random_uuid(), 'manager@mopiproduction.com', 'Content Manager', 'admin', 'Marketing', true),
(gen_random_uuid(), 'editor@mopiproduction.com', 'Content Editor', 'editor', 'Marketing', true),
(gen_random_uuid(), 'viewer@mopiproduction.com', 'Analytics Viewer', 'viewer', 'Analytics', true);

-- Create RLS policies for user management
CREATE POLICY "Users can view their own profile" ON public.user_profiles_2026_01_01_12_45 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles" ON public.user_profiles_2026_01_01_12_45 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles_2026_01_01_12_45 
        WHERE id = auth.uid() AND role = 'super_admin'
    )
);

CREATE POLICY "Super admins can manage all profiles" ON public.user_profiles_2026_01_01_12_45 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles_2026_01_01_12_45 
        WHERE id = auth.uid() AND role = 'super_admin'
    )
);

CREATE POLICY "Users can update their own profile" ON public.user_profiles_2026_01_01_12_45 
FOR UPDATE USING (auth.uid() = id);

-- RLS policies for roles
CREATE POLICY "All authenticated users can view roles" ON public.user_roles_2026_01_01_12_45 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only super admins can manage roles" ON public.user_roles_2026_01_01_12_45 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles_2026_01_01_12_45 
        WHERE id = auth.uid() AND role = 'super_admin'
    )
);

-- RLS policies for activity logs
CREATE POLICY "Users can view their own activity" ON public.user_activity_logs_2026_01_01_12_45 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all activity" ON public.user_activity_logs_2026_01_01_12_45 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles_2026_01_01_12_45 
        WHERE id = auth.uid() AND role = 'super_admin'
    )
);

CREATE POLICY "All authenticated users can insert activity logs" ON public.user_activity_logs_2026_01_01_12_45 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions_2026_01_01_12_45 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all sessions" ON public.user_sessions_2026_01_01_12_45 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles_2026_01_01_12_45 
        WHERE id = auth.uid() AND role = 'super_admin'
    )
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles_2026_01_01_12_45 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles_2026_01_01_12_45 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs_2026_01_01_12_45 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions_2026_01_01_12_45 ENABLE ROW LEVEL SECURITY;

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_2026_01_01_12_45()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles_2026_01_01_12_45 (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'editor');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created_2026_01_01_12_45
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_2026_01_01_12_45();

-- Create function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity_2026_01_01_12_45(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_resource_type VARCHAR(50) DEFAULT NULL,
    p_resource_id VARCHAR(255) DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_activity_logs_2026_01_01_12_45 (
        user_id, action, resource_type, resource_id, details
    ) VALUES (
        p_user_id, p_action, p_resource_type, p_resource_id, p_details
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;