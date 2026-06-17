
INSERT INTO cms_page_images_2026_06_01 (page, section, image_key, image_url, alt_en, alt_ar)
VALUES
  ('services','card1','image','/images/mopi_booth_8_20260101_112901.png','Exhibition Booth Design','تصميم أجنحة المعارض'),
  ('services','card2','image','/images/mopi_event_1_20260101_112901.png','Event Production','تنفيذ الفعاليات'),
  ('services','card3','image','/images/mopi_event_3_20260101_112901.png','Brand Activations','براند أكتيفيشن'),
  ('services','card4','image','/images/mopi_booth_3_20260101_112901.png','Custom Fabrication','تصنيع مخصص'),
  ('services','hero','background','','Services Hero Background','خلفية صفحة الخدمات')
ON CONFLICT (page, section, image_key) DO NOTHING;
