
-- Create storage bucket for CMS media uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cms-media', 'cms-media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
DROP POLICY IF EXISTS "Public read cms-media" ON storage.objects;
CREATE POLICY "Public read cms-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-media');

DROP POLICY IF EXISTS "Authenticated upload cms-media" ON storage.objects;
CREATE POLICY "Authenticated upload cms-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cms-media');

DROP POLICY IF EXISTS "Authenticated update cms-media" ON storage.objects;
CREATE POLICY "Authenticated update cms-media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cms-media');

DROP POLICY IF EXISTS "Authenticated delete cms-media" ON storage.objects;
CREATE POLICY "Authenticated delete cms-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'cms-media');
