
-- Create admin user for MOPi Production dashboard
-- This creates a confirmed user in auth.users via Supabase's built-in function

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@mopiproduction.com',
  crypt('MOPi@Admin2026!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"], "role": "admin"}',
  '{"full_name": "MOPi Admin", "role": "admin"}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
)
ON CONFLICT (email) DO UPDATE
  SET encrypted_password = crypt('MOPi@Admin2026!', gen_salt('bf')),
      email_confirmed_at = now(),
      raw_app_meta_data = '{"provider": "email", "providers": ["email"], "role": "admin"}',
      updated_at = now();
