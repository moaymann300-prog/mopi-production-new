-- First delete any existing about page content to avoid duplicates
DELETE FROM cms_page_content_2026_06_01 WHERE page = 'about';

-- Hero section
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('about', 'hero', 'badge', 'Our Story', 'قصتنا'),
('about', 'hero', 'heading', 'Crafting Excellence Since 2016', 'نصنع التميز منذ 2016'),
('about', 'hero', 'subtitle', 'Passionate creators, innovative designers, and meticulous builders dedicated to transforming your brand vision into extraordinary experiences.', 'مبدعون شغوفون ومصممون مبتكرون وبنّاؤون دقيقون نحوّل رؤية براندك إلى تجارب استثنائية.');

-- Mission section
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('about', 'mission', 'heading', 'Our Mission', 'رسالتنا'),
('about', 'mission', 'content', 'To revolutionize Egypt''s exhibition and event industry by creating immersive, innovative experiences that connect brands with their audiences in meaningful, measurable ways.', 'نسعى لإحداث نقلة نوعية في صناعة المعارض والفعاليات بمصر والمنطقة، من خلال تجارب مبتكرة تربط الشركات بجمهورها بطرق حقيقية وقابلة للقياس.'),
('about', 'mission', 'point1', 'Deliver world-class exhibition solutions', 'تقديم حلول معارض عالمية المستوى'),
('about', 'mission', 'point2', 'Foster long-term client partnerships', 'بناء شراكات طويلة المدى مع العملاء'),
('about', 'mission', 'point3', 'Drive innovation in design and production', 'قيادة الابتكار في التصميم والتنفيذ'),
('about', 'mission', 'point4', 'Maintain the highest quality standards', 'الالتزام بأعلى معايير الجودة');

-- Vision section
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('about', 'vision', 'heading', 'Our Vision', 'رؤيتنا'),
('about', 'vision', 'content', 'To be the MENA region''s premier exhibition design and event production company, recognized for creativity, reliability, and the ability to transform spaces into powerful brand experiences.', 'أن نكون الشريك الأول في المنطقة لتصميم المعارض وإنتاج الفعاليات، معروفين بالإبداع والموثوقية وتحويل الفضاءات إلى تجارب براند استثنائية.'),
('about', 'vision', 'future_heading', 'Looking Ahead to 2030', 'نظرتنا حتى 2030'),
('about', 'vision', 'future_content', 'We aim to be the preferred partner for Fortune 500 companies and major MENA corporations seeking premium exhibition solutions — while leading the industry in innovation.', 'هدفنا أن نكون الشريك المفضل لكبرى الشركات في المنطقة الباحثة عن حلول معارض متميزة — مع قيادة الابتكار في الصناعة.');

-- Values section
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('about', 'values', 'label', 'What We Stand For', 'مبادئنا'),
('about', 'values', 'heading', 'Our Core Values', 'قيمنا الأساسية'),
('about', 'values', 'subtitle', 'The principles that guide every decision we make and every project we undertake', 'المبادئ التي توجه كل قرار نتخذه وكل مشروع ننجزه'),
('about', 'values', 'val1_title', 'Innovation', 'الابتكار'),
('about', 'values', 'val1_desc', 'We push boundaries of design and technology to create cutting-edge exhibition experiences.', 'نكسر حدود التصميم والتكنولوجيا لنصنع تجارب معارض استثنائية.'),
('about', 'values', 'val2_title', 'Quality', 'الجودة'),
('about', 'values', 'val2_desc', 'Every project meets our rigorous standards — exceptional results that exceed expectations.', 'كل مشروع يخضع لمعاييرنا الصارمة — نتائج استثنائية تفوق التوقعات.'),
('about', 'values', 'val3_title', 'Collaboration', 'الشراكة'),
('about', 'values', 'val3_desc', 'We work closely with clients as partners, bringing their vision to life seamlessly.', 'نعمل مع عملائنا كشركاء حقيقيين لتحويل رؤيتهم إلى واقع.'),
('about', 'values', 'val4_title', 'Regional Reach', 'الانتشار الإقليمي'),
('about', 'values', 'val4_desc', 'With projects across Egypt and the MENA region, we deliver world-class expertise.', 'مشاريع في مصر ومنطقة الشرق الأوسط بمعايير دولية عالية.');

-- Timeline section
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('about', 'timeline', 'label', 'Our Journey', 'رحلتنا'),
('about', 'timeline', 'heading', 'Milestones That Shaped Us', 'المحطات التي شكّلتنا'),
('about', 'timeline', 'subtitle', 'From humble beginnings to regional leadership', 'من بداية متواضعة إلى ريادة إقليمية'),
('about', 'timeline', 'year1', '2016', '2016'),
('about', 'timeline', 'event1', 'MOPi Production Founded in Cairo', 'تأسيس موبي برودكشن في القاهرة'),
('about', 'timeline', 'year2', '2018', '2018'),
('about', 'timeline', 'event2', 'First International Exhibition Project', 'أول مشروع معرض دولي'),
('about', 'timeline', 'year3', '2020', '2020'),
('about', 'timeline', 'event3', '100+ Projects Milestone Reached', 'تجاوز حاجز 100 مشروع منجز'),
('about', 'timeline', 'year4', '2022', '2022'),
('about', 'timeline', 'event4', 'Expanded to Saudi Arabia & UAE Markets', 'التوسع إلى السوق السعودي والإماراتي'),
('about', 'timeline', 'year5', '2024', '2024'),
('about', 'timeline', 'event5', '400+ Projects Completed', 'إتمام 400+ مشروع'),
('about', 'timeline', 'year6', '2026', '2026'),
('about', 'timeline', 'event6', '500+ Projects & Growing', '+500 مشروع ونحو المزيد');

-- Awards section
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('about', 'awards', 'label', 'Recognition', 'التقدير'),
('about', 'awards', 'heading', 'Awards & Achievements', 'الجوائز والإنجازات'),
('about', 'awards', 'subtitle', 'Our commitment to excellence recognized by industry leaders', 'التزامنا بالتميز معترف به من قادة الصناعة'),
('about', 'awards', 'award1_year', '2025', '2025'),
('about', 'awards', 'award1_title', 'Best Exhibition Design', 'أفضل تصميم معرض'),
('about', 'awards', 'award1_org', 'MENA Trade Show Association', 'MENA Trade Show Association'),
('about', 'awards', 'award1_desc', 'Recognized for innovative booth design at Cairo Tech Expo 2025.', 'تكريم على تصميم الجناح المبتكر في Cairo Tech Expo 2025.'),
('about', 'awards', 'award2_year', '2024', '2024'),
('about', 'awards', 'award2_title', 'Client Choice Award', 'جائزة اختيار العملاء'),
('about', 'awards', 'award2_org', 'Exhibition Industry Alliance', 'Exhibition Industry Alliance'),
('about', 'awards', 'award2_desc', 'Highest client satisfaction rating for two consecutive years.', 'أعلى تقييم رضا عملاء لعامين متتاليين.'),
('about', 'awards', 'award3_year', '2023', '2023'),
('about', 'awards', 'award3_title', 'Innovation in Design', 'الابتكار في التصميم'),
('about', 'awards', 'award3_org', 'Gulf Exhibition Awards', 'Gulf Exhibition Awards'),
('about', 'awards', 'award3_desc', 'Revolutionary custom modular booth system design.', 'تصميم نظام بوث معياري مخصص ثوري.'),
('about', 'awards', 'award4_year', '2022', '2022'),
('about', 'awards', 'award4_title', 'Top Production Company', 'أفضل شركة إنتاج'),
('about', 'awards', 'award4_org', 'Egypt Events Council', 'Egypt Events Council'),
('about', 'awards', 'award4_desc', 'Leading event production company in the Egyptian market.', 'شركة إنتاج الفعاليات الرائدة في السوق المصري.');

-- CTA section
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('about', 'cta', 'heading', 'Ready to Work Together?', 'مستعد للعمل معنا؟'),
('about', 'cta', 'subtitle', 'Let''s create something extraordinary for your brand.', 'لنصنع معاً شيئاً استثنائياً لبراندك.'),
('about', 'cta', 'cta_primary', 'Get a Quote', 'اطلب عرض سعر'),
('about', 'cta', 'cta_secondary', 'View Our Work', 'شاهد أعمالنا');
