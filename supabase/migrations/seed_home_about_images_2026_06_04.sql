-- Seed home/about image records into cms_page_images_2026_06_01
-- Uses INSERT ... ON CONFLICT DO NOTHING so existing records are preserved

INSERT INTO cms_page_images_2026_06_01 (page, section, image_key, image_url, alt_text_en, alt_text_ar, sort_order)
VALUES
  ('home', 'about', 'image1', '', 'About Us Photo 1 - Top Left',    'صورة من نحن 1 - يسار أعلى',   1),
  ('home', 'about', 'image2', '', 'About Us Photo 2 - Top Right',   'صورة من نحن 2 - يمين أعلى',   2),
  ('home', 'about', 'image3', '', 'About Us Photo 3 - Bottom Left', 'صورة من نحن 3 - يسار أسفل',   3),
  ('home', 'about', 'image4', '', 'About Us Photo 4 - Bottom Right','صورة من نحن 4 - يمين أسفل',   4)
ON CONFLICT DO NOTHING;
