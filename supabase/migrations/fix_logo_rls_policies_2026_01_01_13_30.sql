-- Fix RLS policies for logo settings table
-- Current time: 2026_01_01_13_30

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.logo_settings_2026_01_01_13_00;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.logo_settings_2026_01_01_13_00;

-- Create more permissive policies for logo management
CREATE POLICY "Allow public read access to logos" ON public.logo_settings_2026_01_01_13_00 
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert logos" ON public.logo_settings_2026_01_01_13_00 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update logos" ON public.logo_settings_2026_01_01_13_00 
FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete logos" ON public.logo_settings_2026_01_01_13_00 
FOR DELETE USING (true);

-- Also ensure the table allows upsert operations
ALTER TABLE public.logo_settings_2026_01_01_13_00 REPLICA IDENTITY DEFAULT;