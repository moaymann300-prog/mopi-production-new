
-- Create admin user only if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@mopiproduction.com'
  ) THEN
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
    );
    RAISE NOTICE 'Admin user created successfully';
  ELSE
    -- Update password if user already exists
    UPDATE auth.users
    SET
      encrypted_password = crypt('MOPi@Admin2026!', gen_salt('bf')),
      email_confirmed_at = now(),
      updated_at = now()
    WHERE email = 'admin@mopiproduction.com';
    RAISE NOTICE 'Admin user password updated';
  END IF;
END $$;
