-- Seed all commonly needed image records
-- About page images
INSERT INTO cms_page_images_2026_06_01 (page, section, image_key, image_url, alt_en, alt_ar, sort_order)
VALUES
  ('about', 'hero',    'background', '', 'About Page Hero Background', 'خلفية صفحة من نحن', 0),
  ('about', 'story',   'main',       '', 'Our Story Main Image',       'صورة قصتنا الرئيسية', 1),
  ('about', 'team',    'group',      '', 'Team Group Photo',            'صورة الفريق', 2)
ON CONFLICT (page, section, image_key) DO NOTHING;

-- Services page images
INSERT INTO cms_page_images_2026_06_01 (page, section, image_key, image_url, alt_en, alt_ar, sort_order)
VALUES
  ('services', 'hero', 'background', '', 'Services Page Hero Background', 'خلفية صفحة خدماتنا', 0)
ON CONFLICT (page, section, image_key) DO NOTHING;

-- Portfolio page images
INSERT INTO cms_page_images_2026_06_01 (page, section, image_key, image_url, alt_en, alt_ar, sort_order)
VALUES
  ('portfolio', 'hero', 'background', '', 'Portfolio Page Hero Background', 'خلفية صفحة أعمالنا', 0)
ON CONFLICT (page, section, image_key) DO NOTHING;

-- Contact page images
INSERT INTO cms_page_images_2026_06_01 (page, section, image_key, image_url, alt_en, alt_ar, sort_order)
VALUES
  ('contact', 'hero', 'background', '', 'Contact Page Hero Background', 'خلفية صفحة تواصل معنا', 0)
ON CONFLICT (page, section, image_key) DO NOTHING;

-- Verify all home images are present
SELECT id, page, section, image_key, image_url
FROM cms_page_images_2026_06_01
WHERE page = 'home'
ORDER BY section, sort_order;
