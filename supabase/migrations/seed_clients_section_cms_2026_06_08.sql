
-- Seed the home/clients CMS section for admin dashboard control
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar)
VALUES
  ('home', 'clients', 'label',    'Our Clients',                                              'عملاؤنا'),
  ('home', 'clients', 'heading',  'TRUSTED BY LEADING BRANDS',                                'يثق بنا كبار البراندات'),
  ('home', 'clients', 'subtitle', 'Brands that trusted MOPI Production to bring their vision to reality.', 'براندات اختارت MOPI Production لتحويل رؤيتها إلى واقع')
ON CONFLICT (page, section, field) DO NOTHING;
