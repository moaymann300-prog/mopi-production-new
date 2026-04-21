
-- Create CMS media storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms-media',
  'cms-media',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all files
CREATE POLICY "cms_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-media');

-- Allow all users to upload
CREATE POLICY "cms_allow_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cms-media');

-- Allow all users to update
CREATE POLICY "cms_allow_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cms-media');

-- Allow all users to delete
CREATE POLICY "cms_allow_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'cms-media');
