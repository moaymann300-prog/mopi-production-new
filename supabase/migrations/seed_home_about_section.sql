-- Delete any existing home/about content
DELETE FROM cms_page_content_2026_06_01 WHERE page = 'home' AND section = 'about';

-- Seed home About section with all fields matching the dashboard and Index.tsx
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('home', 'about', 'label',    'Who We Are',                                                                     'من نحن'),
('home', 'about', 'heading1', 'Where Vision',                                                                   'نبدأ من'),
('home', 'about', 'heading2', 'Meets Execution',                                                                'الفكرة'),
('home', 'about', 'heading3', 'Excellence',                                                                     'وننتهي بالتميز'),
('home', 'about', 'paragraph1',
  'MOPI Production is Egypt''s leading exhibition and event production company. Since 2016, we have been transforming spaces into extraordinary brand experiences across Egypt and the MENA region.',
  'موبي برودكشن هي شركة رائدة في تصميم وتنفيذ المعارض والفعاليات في مصر. منذ 2016 ونحن نحوّل الأماكن إلى تجارب براند استثنائية في مصر ومنطقة الشرق الأوسط.'),
('home', 'about', 'paragraph2',
  'From concept to completion, our team of designers, engineers, and project managers deliver world-class results that exceed expectations every time.',
  'من الفكرة حتى التنفيذ، فريقنا من المصممين والمهندسين ومديري المشاريع يقدم نتائج عالمية المستوى تفوق التوقعات في كل مرة.'),
('home', 'about', 'point1',   '400+ Projects Delivered',          '+400 مشروع منجز'),
('home', 'about', 'point2',   '10+ Years of Excellence',          '+10 سنوات من التميز'),
('home', 'about', 'point3',   'Egypt & MENA Coverage',            'تغطية مصر والشرق الأوسط'),
('home', 'about', 'point4',   'International Standards',          'معايير دولية عالية الجودة'),
('home', 'about', 'cta',      'Work With Us',                     'تواصل معنا');
