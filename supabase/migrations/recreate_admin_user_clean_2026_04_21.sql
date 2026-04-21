
-- Delete existing admin user if any and recreate cleanly
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Delete existing user with this email
  DELETE FROM auth.users WHERE email = 'admin@mopiproduction.com';

  -- Generate new UUID
  v_user_id := gen_random_uuid();

  -- Insert fresh admin user with all required fields
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@mopiproduction.com',
    crypt('MOPi@Admin2026!', gen_salt('bf')),
    now(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"MOPi Admin"}',
    false,
    now(),
    now(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  );

  -- Insert identity record required for email login
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at,
    provider_id
  ) VALUES (
    v_user_id,
    v_user_id,
    json_build_object('sub', v_user_id::text, 'email', 'admin@mopiproduction.com'),
    'email',
    now(),
    now(),
    now(),
    'admin@mopiproduction.com'
  );

  RAISE NOTICE 'Admin user created with id: %', v_user_id;
END $$;
