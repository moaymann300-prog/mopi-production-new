
-- ══════════════════════════════════════════════════
-- 1. Create storage bucket for CMS media uploads
-- ══════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cms-media', 'cms-media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policy: allow public reads
DROP POLICY IF EXISTS "Public read cms-media" ON storage.objects;
CREATE POLICY "Public read cms-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-media');

-- Storage policy: allow authenticated uploads
DROP POLICY IF EXISTS "Authenticated upload cms-media" ON storage.objects;
CREATE POLICY "Authenticated upload cms-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cms-media');

DROP POLICY IF EXISTS "Authenticated update cms-media" ON storage.objects;
CREATE POLICY "Authenticated update cms-media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cms-media');

DROP POLICY IF EXISTS "Authenticated delete cms-media" ON storage.objects;
CREATE POLICY "Authenticated delete cms-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'cms-media');

-- ══════════════════════════════════════════════════
-- 2. Ensure cms_page_content table has all needed rows
-- ══════════════════════════════════════════════════

-- HOME PAGE CONTENT
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
-- Hero
('home','hero','badge','Premium Production Agency','وكالة إنتاج متميزة'),
('home','hero','line1','FROM VISION','من الفكرة'),
('home','hero','line2','TO REALITY','إلى التنفيذ'),
('home','hero','subtitle','Exhibitions · Events · Brand Activations across Egypt & MENA','معارض · فعاليات · براند أكتيفيشن في مصر والشرق الأوسط'),
('home','hero','cta_primary','Get a Quote','اطلب عرض سعر'),
('home','hero','cta_secondary','View Our Work','شوف أعمالنا'),
-- About
('home','about','label','Our Story','قصتنا'),
('home','about','heading1','We Build'),
('home','about','heading2','Experiences'),
('home','about','heading3','That Last'),
('home','about','heading1','نبني تجارب','نبني تجارب'),
('home','about','heading2','احترافية','احترافية'),
('home','about','heading3','لا تُنسى','لا تُنسى'),
('home','about','paragraph1','MOPI Production is a leading exhibition and event production company, specializing in world-class booth construction, brand activations, and corporate events.','موبي برودكشن شركة رائدة في تنفيذ المعارض والفعاليات، متخصصون في تصميم وتنفيذ البوثات، براند أكتيفيشن، والفعاليات الكبرى.'),
('home','about','paragraph2','From concept to delivery, we bring your brand vision to life with precision, creativity, and unmatched attention to detail.','من الفكرة للتسليم، نحول رؤيتك لواقع بدقة واحتراف وإبداع لا يُضاهى.'),
('home','about','point1','World-Class Exhibition Booths','بوثات معارض عالمية المستوى'),
('home','about','point2','End-to-End Event Management','إدارة فعاليات متكاملة'),
('home','about','point3','Premium Brand Activations','براند أكتيفيشن احترافي'),
('home','about','point4','Corporate Event Production','تنفيذ فعاليات الشركات'),
('home','about','cta','Learn More About Us','اعرف أكثر عنا'),
-- Services
('home','services','label','What We Do','خدماتنا'),
('home','services','heading','Our Services','خدماتنا'),
('home','services','subtitle','Comprehensive production solutions for exhibitions, events, and brand experiences.','حلول إنتاج متكاملة للمعارض والفعاليات وتجارب البراند.'),
-- Portfolio
('home','portfolio','label','Our Work','أعمالنا'),
('home','portfolio','heading','Featured Projects','مشاريع مميزة'),
('home','portfolio','subtitle','A selection of our finest work across Egypt and the MENA region.','نماذج من أفضل أعمالنا في مصر والشرق الأوسط.'),
('home','portfolio','cta','View All Projects','شوف كل الأعمال'),
-- Why
('home','why','label','Why Us','ليه تختارنا'),
('home','why','heading1','The MOPI','ليه'),
('home','why','heading2','Difference','موبي'),
('home','why','subtitle','We do not just build booths. We create experiences that connect brands with their audiences.','مش بس بنبني بوثات. بنصنع تجارب تربط البراند بجمهوره.'),
('home','why','item1_title','500+ Projects Delivered','500+ مشروع منجز'),
('home','why','item1_desc','Proven track record across Egypt and the MENA region.','سجل حافل في مصر والشرق الأوسط.'),
('home','why','item2_title','On-Time Delivery','التسليم في الوقت'),
('home','why','item2_desc','We respect your deadlines. Always.','محترمين مواعيدكم دايمًا.'),
('home','why','item3_title','Premium Quality','جودة لا تُضاهى'),
('home','why','item3_desc','Materials, finishes, and execution that speak for themselves.','خامات وتشطيب وتنفيذ بيتكلم عن نفسه.'),
('home','why','item4_title','Creative Excellence','إبداع متميز'),
('home','why','item4_desc','Our design team pushes boundaries to deliver unforgettable concepts.','فريق التصميم بيكسر القواعد لتوصيل مفاهيم لا تُنسى.'),
('home','why','item5_title','Full-Service Partner','شريك متكامل'),
('home','why','item5_desc','From concept to breakdown, we handle everything.','من الفكرة للفكك، بنهتم بكل حاجة.'),
('home','why','item6_title','Client-First Approach','الأولوية للعميل'),
('home','why','item6_desc','Your success is our benchmark for every project.','نجاحك هو المعيار اللي بنقيس عليه.'),
-- Process
('home','process','label','How We Work','كيف نعمل'),
('home','process','heading','Our Process','طريقة عملنا'),
('home','process','subtitle','A proven, streamlined process from first call to final delivery.','منهجية واضحة ومجربة من أول مكالمة حتى التسليم النهائي.'),
('home','process','step1_title','Discovery & Brief','الفهم والتحليل'),
('home','process','step1_desc','We listen, understand your goals, and define the project scope.','بنسمع ونفهم أهدافكم ونحدد نطاق المشروع.'),
('home','process','step2_title','Concept & Design','المفهوم والتصميم'),
('home','process','step2_desc','Our designers create stunning visuals and 3D concepts for your approval.','مصممونا يبتكرون تصورات رائعة وتخطيطات ثلاثية الأبعاد لموافقتكم.'),
('home','process','step3_title','Production & Fabrication','الإنتاج والتصنيع'),
('home','process','step3_desc','Expert craftsmen bring the design to life with premium materials.','حرفيون محترفون يحولون التصميم لواقع بأفضل الخامات.'),
('home','process','step4_title','Logistics & Setup','اللوجستيك والتركيب'),
('home','process','step4_desc','We handle transportation, on-site setup, and full installation.','بنتولى النقل والتركيب الميداني والتجهيز الكامل.'),
('home','process','step5_title','Delivery & Support','التسليم والدعم'),
('home','process','step5_desc','On-time delivery with full on-site support throughout your event.','تسليم في الموعد مع دعم ميداني كامل طوال الفعالية.'),
-- CTA
('home','cta','heading','Ready to Create','جاهز للإبداع؟'),
('home','cta','heading2','Something Extraordinary?','دعنا نبنيه معًا.'),
('home','cta','subtitle','Let us bring your vision to life. Premium production, delivered on time.','خلينا نحول رؤيتك لواقع. إنتاج احترافي، مواعيد ملتزم بيها.'),
('home','cta','cta_primary','Start Your Project','ابدأ مشروعك'),
('home','cta','cta_secondary','WhatsApp Us','راسلنا على واتساب'),
-- Contact
('home','contact','label','Get In Touch','تواصل معنا'),
('home','contact','heading','Let''s Start','هيا نبدأ'),
('home','contact','heading2','A Conversation','الحديث معًا'),
('home','contact','subtitle','Tell us about your project and we''ll get back to you within 24 hours.','احكيلنا عن مشروعك وهنرد عليك خلال 24 ساعة.'),
('home','contact','form_name','Your Name','اسمك'),
('home','contact','form_email','Email Address','البريد الإلكتروني'),
('home','contact','form_phone','Phone Number','رقم التليفون'),
('home','contact','form_company','Company Name','اسم الشركة'),
('home','contact','form_service','Service Needed','الخدمة المطلوبة'),
('home','contact','form_message','Your Message','رسالتك'),
('home','contact','form_submit','Send Message','إرسال الرسالة'),
-- Footer
('home','footer','tagline','Premium exhibition and event production company, delivering world-class experiences across Egypt and the MENA region.','شركة إنتاج معارض وفعاليات متميزة، نقدم تجارب عالمية المستوى في مصر والشرق الأوسط.'),
('home','footer','copyright','© 2026 MOPI Production. All rights reserved.','© 2026 موبي برودكشن. جميع الحقوق محفوظة.')
ON CONFLICT (page, section, field) DO NOTHING;

-- ABOUT PAGE CONTENT
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('about','hero','badge','Who We Are','من نحن'),
('about','hero','heading','About <span>MOPI</span> Production','عن <span>موبي</span> برودكشن'),
('about','hero','subtitle','A premium production agency built on creativity, precision, and passion.','وكالة إنتاج متميزة مبنية على الإبداع والدقة والشغف.'),
('about','story','heading','Our Story','قصتنا'),
('about','story','content','MOPI Production was founded with a single mission: to deliver world-class exhibition and event experiences that leave lasting impressions. Over the years, we have grown into one of the most trusted production companies in Egypt and the MENA region, working with leading brands across industries.','تأسست موبي برودكشن بمهمة واحدة: تقديم تجارب معارض وفعاليات عالمية المستوى تترك انطباعات دائمة. على مر السنين، نمونا لنصبح من أكثر شركات الإنتاج موثوقية في مصر والشرق الأوسط، نعمل مع كبرى الشركات في مختلف القطاعات.'),
('about','mission','heading','Our Mission','مهمتنا'),
('about','mission','content','To transform your brand vision into extraordinary physical experiences. We combine creative design, premium materials, and flawless execution to deliver results that exceed expectations.','تحويل رؤية البراند الخاص بك إلى تجارب مادية استثنائية. نجمع بين التصميم الإبداعي والخامات الفاخرة والتنفيذ الاحترافي لتحقيق نتائج تتجاوز التوقعات.'),
('about','values','heading','Our Values','قيمنا')
ON CONFLICT (page, section, field) DO NOTHING;

-- SERVICES PAGE CONTENT
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('services','hero','badge','What We Offer','ما نقدمه'),
('services','hero','heading','Our <span>Services</span>','<span>خدماتنا</span>'),
('services','hero','subtitle','Comprehensive production solutions tailored to your brand and vision.','حلول إنتاج متكاملة مصممة لبراندك ورؤيتك.'),
('services','cta','heading','Ready to Start Your Project?','جاهز تبدأ مشروعك؟'),
('services','cta','subtitle','Tell us about your vision and we will make it a reality.','احكيلنا عن رؤيتك وهنحولها لواقع.'),
('services','cta','cta_primary','Get a Quote','اطلب عرض سعر')
ON CONFLICT (page, section, field) DO NOTHING;

-- PORTFOLIO PAGE CONTENT
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('portfolio','hero','badge','Our Work','أعمالنا'),
('portfolio','hero','heading','Our <span>Portfolio</span>','<span>أعمالنا</span>'),
('portfolio','hero','subtitle','World-class exhibitions, events, and brand experiences we have delivered.','معارض وفعاليات وتجارب براند عالمية المستوى نفذناها.')
ON CONFLICT (page, section, field) DO NOTHING;

-- CONTACT PAGE CONTENT
INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
('contact','hero','badge','Contact Us','تواصل معنا'),
('contact','hero','heading','Let''s Work <span>Together</span>','هيا نعمل <span>سوياً</span>'),
('contact','hero','subtitle','Ready to start your next project? We would love to hear from you.','جاهز تبدأ مشروعك القادم؟ يسعدنا نسمع منك.'),
('contact','info','address_label','Visit Us','زورونا'),
('contact','info','phone_label','Call Us','اتصل بنا'),
('contact','info','email_label','Email Us','راسلنا'),
('contact','info','whatsapp_label','WhatsApp','واتساب')
ON CONFLICT (page, section, field) DO NOTHING;

-- ══════════════════════════════════════════════════
-- 3. Ensure cms_page_images table has all needed rows
-- ══════════════════════════════════════════════════
INSERT INTO cms_page_images_2026_06_01 (page, section, image_key, image_url, alt_en, alt_ar, sort_order) VALUES
('home','hero','background','','Hero Background','خلفية الرئيسية',1),
('home','about','main_image','','About Section Photo','صورة قسم عنا',1),
('about','story','image','','Our Story Photo','صورة قصتنا',1)
ON CONFLICT (page, section, image_key) DO NOTHING;
