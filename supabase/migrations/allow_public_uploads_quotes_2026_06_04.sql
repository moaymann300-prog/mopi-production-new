
-- Allow anonymous uploads for quote request files (floor plans, brand guidelines)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow public uploads for quote files'
  ) THEN
    CREATE POLICY "Allow public uploads for quote files" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'cms-media');
  END IF;
END $$;
