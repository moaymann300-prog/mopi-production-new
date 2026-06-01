
-- ─── CMS Page Content Table (for all text sections on each page) ─────────────
CREATE TABLE IF NOT EXISTS public.cms_page_content_2026_06_01 (
  id SERIAL PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  section VARCHAR(100) NOT NULL,
  field VARCHAR(100) NOT NULL,
  value_en TEXT DEFAULT '',
  value_ar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, section, field)
);

ALTER TABLE public.cms_page_content_2026_06_01 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.cms_page_content_2026_06_01 FOR SELECT USING (true);
CREATE POLICY "Auth write" ON public.cms_page_content_2026_06_01 FOR ALL USING (auth.role() = 'authenticated');

-- ─── CMS Page Images Table (for all images on each page) ────────────────────
CREATE TABLE IF NOT EXISTS public.cms_page_images_2026_06_01 (
  id SERIAL PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  section VARCHAR(100) NOT NULL,
  image_key VARCHAR(100) NOT NULL,
  image_url TEXT DEFAULT '',
  alt_en TEXT DEFAULT '',
  alt_ar TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, section, image_key)
);

ALTER TABLE public.cms_page_images_2026_06_01 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.cms_page_images_2026_06_01 FOR SELECT USING (true);
CREATE POLICY "Auth write" ON public.cms_page_images_2026_06_01 FOR ALL USING (auth.role() = 'authenticated');

-- ─── Seed: Homepage text content ─────────────────────────────────────────────
INSERT INTO public.cms_page_content_2026_06_01 (page, section, field, value_en, value_ar) VALUES
-- Hero
('home','hero','badge','Cairo, Egypt · 8+ Years of Excellence','القاهرة · 8+ سنوات من التميز'),
('home','hero','line1','FROM VISION','من الفكرة'),
('home','hero','line2','TO REALITY','إلى التنفيذ'),
('home','hero','subtitle','MOPI Production — Exhibitions • Events • Brand Activations','موبي برودكشن — معارض • فعاليات • براند أكتيفيشن'),
('home','hero','cta_primary','Get a Free Quote','اطلب عرض سعر'),
('home','hero','cta_secondary','WhatsApp Now','تواصل الآن'),
-- About section on homepage
('home','about','label','About Us','عن الشركة'),
('home','about','heading1','Cairo''s Premier','الرائدون في'),
('home','about','heading2','Exhibition & Event','تصميم وتنفيذ المعارض'),
('home','about','heading3','Production Company','والفعاليات بمصر'),
('home','about','paragraph1','MOPi Production is a Cairo-based company with 8+ years of experience designing and building exhibition booths, stands, and custom event solutions.','موبي برودكشن شركة مصرية بخبرة +8 سنوات في تصميم وتنفيذ أجنحة المعارض والفعاليات المتكاملة.'),
('home','about','paragraph2','We provide full end-to-end services — from concept and design to logistics, setup, and on-site management. Quality, creativity, and seamless execution define everything we do.','نقدم حلولاً متكاملة من أول الفكرة والتصميم وحتى التركيب والإدارة الميدانية. الجودة والإبداع والتنفيذ المثالي هي هويتنا.'),
('home','about','point1','Full A-to-Z Service','خدمة متكاملة من أول لآخر'),
('home','about','point2','8+ Years Experience','+8 سنوات خبرة'),
('home','about','point3','Egypt & MENA Region','مصر ومنطقة الشرق الأوسط'),
('home','about','point4','On-Time Delivery','التسليم في الموعد دائماً'),
('home','about','cta','Work With Us','ابدأ مشروعك معنا'),
-- Services section on homepage
('home','services','label','What We Do','خدماتنا'),
('home','services','heading','Our Services','ماذا نقدم'),
('home','services','subtitle','End-to-end solutions for every exhibition and event need','حلول متكاملة لكل احتياجات معارضك وفعالياتك'),
-- Portfolio section on homepage
('home','portfolio','label','Our Work','أعمالنا'),
('home','portfolio','heading','Featured Projects','مشاريع مختارة'),
('home','portfolio','subtitle','A selection of our finest work across Egypt and the MENA region','نماذج من أعمالنا المتميزة في مصر ومنطقة الشرق الأوسط'),
('home','portfolio','cta','View All Projects','جميع الأعمال'),
-- Why Us section
('home','why','label','Why Choose Us','لماذا موبي؟'),
('home','why','heading1','The MOPI','الفرق الذي'),
('home','why','heading2','Difference','يصنعه موبي'),
('home','why','subtitle','We don''t just build booths. We build experiences that drive results.','ما بنبنيش بوثات فقط. بنصنع تجارب تحقق نتائج حقيقية.'),
('home','why','item1_title','Award-Winning Designs','تصاميم حائزة على جوائز'),
('home','why','item1_desc','Creative, concept-driven booth designs that win awards and convert visitors.','تصاميم إبداعية قائمة على فكرة واضحة تحقق نتائج فعلية.'),
('home','why','item2_title','Expert Team','فريق متخصص'),
('home','why','item2_desc','50+ skilled professionals in design, fabrication, and event management.', '+50 متخصص في التصميم والتصنيع وإدارة الفعاليات.'),
('home','why','item3_title','On-Time Delivery','التسليم في الموعد'),
('home','why','item3_desc','98% on-time delivery rate. Your deadline is our commitment.','98% من مشاريعنا تُسلَّم في موعدها. التزامنا بكلمتنا.'),
('home','why','item4_title','End-to-End Service','خدمة متكاملة'),
('home','why','item4_desc','From concept to dismantling — we handle every single detail.','من الفكرة للتركيب وحتى الفك — بنتحمل كل التفاصيل.'),
('home','why','item5_title','MENA Coverage','تغطية الشرق الأوسط'),
('home','why','item5_desc','Active in 15+ countries. Local expertise with global standards.','نعمل في +15 دولة. خبرة محلية بمعايير دولية.'),
('home','why','item6_title','Budget Flexibility','مرونة في الميزانية'),
('home','why','item6_desc','Premium quality across a wide range of budgets. No compromises.','جودة عالية بأسعار مرنة تناسب ميزانيتك. بدون تنازلات.'),
-- Process section
('home','process','label','How We Work','كيف نعمل'),
('home','process','heading','Our Process','خطوات العمل'),
('home','process','subtitle','From your first call to the final installation — a proven process that delivers','من أول تواصل لغاية آخر مسمار — منهجية مجربة تضمن النتائج'),
('home','process','step1_title','Discovery & Brief','الفهم والإيجاز'),
('home','process','step1_desc','We start with a deep understanding of your goals, brand, and vision.','بنبدأ بفهم عميق لأهدافك وهويتك ورؤيتك.'),
('home','process','step2_title','Design & Concept','التصميم والمفهوم'),
('home','process','step2_desc','Our designers craft stunning 3D concepts tailored to your identity.','مصممونا يبتكرون تصورات ثلاثية الأبعاد مخصصة لهويتك.'),
('home','process','step3_title','Engineering & Build','الهندسة والتصنيع'),
('home','process','step3_desc','Expert fabrication with premium materials to ensure structural excellence.','تصنيع احترافي بمواد فاخرة يضمن التميز الهيكلي.'),
('home','process','step4_title','Logistics & Setup','اللوجستيات والتركيب'),
('home','process','step4_desc','Seamless coordination and on-time installation at your venue.','تنسيق سلس وتركيب في الموعد في موقعك.'),
('home','process','step5_title','On-Site Management','الإدارة الميدانية'),
('home','process','step5_desc','Our team stays on-site to ensure everything runs perfectly.','فريقنا يبقى في الموقع لضمان سير كل شيء بإتقان.'),
-- CTA section
('home','cta','heading','Ready to Build','هل أنت مستعد لبناء'),
('home','cta','heading2','Something Extraordinary?','شيء استثنائي؟'),
('home','cta','subtitle','Let''s bring your vision to life. Contact our team for a free consultation and quote.','خلينا نحول رؤيتك لواقع. تواصل مع فريقنا للحصول على استشارة وعرض سعر مجاني.'),
('home','cta','cta_primary','Get a Free Quote','اطلب عرض سعر'),
('home','cta','cta_secondary','WhatsApp Now','واتساب الآن'),
-- Contact section on homepage
('home','contact','label','Get In Touch','تواصل معنا'),
('home','contact','heading','Let''s Create Something','لنصنع شيئاً'),
('home','contact','heading2','Together','معاً'),
('home','contact','subtitle','Have a project in mind? We''d love to hear about it.','عندك مشروع في بالك؟ يسعدنا نسمع عنه.'),
('home','contact','form_name','Your Name','اسمك'),
('home','contact','form_email','Email Address','البريد الإلكتروني'),
('home','contact','form_phone','Phone / WhatsApp','التليفون / واتساب'),
('home','contact','form_company','Company Name','اسم الشركة'),
('home','contact','form_service','Service of Interest','الخدمة المطلوبة'),
('home','contact','form_message','Tell us about your project','أخبرنا عن مشروعك'),
('home','contact','form_submit','Send Message','أرسل الرسالة'),
-- Footer
('home','footer','tagline','Cairo''s leading exhibition booth design and event production company.','شركة موبي برودكشن — رائدون في تصميم وتنفيذ المعارض والفعاليات في مصر.'),
('home','footer','copyright','© 2026 MOPI Production. All Rights Reserved.','© 2026 موبي برودكشن. جميع الحقوق محفوظة.'),
-- About page
('about','hero','badge','Who We Are','من نحن'),
('about','hero','heading','About MOPi','عن موبي'),
('about','hero','subtitle','8+ years crafting world-class exhibition and event experiences','أكثر من 8 سنوات من صناعة تجارب معارض وفعاليات عالمية المستوى'),
('about','story','heading','Our Story','قصتنا'),
('about','story','content','MOPi Production was founded with a single mission: to transform the way brands show up at exhibitions and events. Over 8 years, we''ve grown from a small Cairo studio into a full-scale production powerhouse serving clients across Egypt and the MENA region.','تأسست موبي برودكشن بهدف واحد: تغيير الطريقة التي تظهر بها العلامات التجارية في المعارض والفعاليات. على مدى 8 سنوات، تطورنا من استوديو صغير في القاهرة إلى شركة إنتاج متكاملة تخدم عملاء في مصر ومنطقة الشرق الأوسط.'),
('about','mission','heading','Our Mission','مهمتنا'),
('about','mission','content','To deliver exceptional exhibition and event solutions that elevate brands, engage audiences, and create lasting impact.','تقديم حلول معارض وفعاليات استثنائية ترفع مستوى العلامات التجارية وتجذب الجمهور وتخلق أثراً دائماً.'),
('about','values','heading','Our Values','قيمنا'),
-- Services page
('services','hero','badge','What We Offer','ما نقدمه'),
('services','hero','heading','Our Services','خدماتنا'),
('services','hero','subtitle','Comprehensive exhibition and event solutions from concept to completion','حلول معارض وفعاليات شاملة من الفكرة حتى التنفيذ'),
('services','cta','heading','Ready to Start Your Project?','مستعد لبدء مشروعك؟'),
('services','cta','subtitle','Let''s discuss your requirements and create something extraordinary together.','لنناقش متطلباتك ونصنع شيئاً استثنائياً معاً.'),
('services','cta','cta_primary','Get a Quote','اطلب عرض سعر'),
-- Portfolio page
('portfolio','hero','badge','Our Work','أعمالنا'),
('portfolio','hero','heading','Portfolio','معرض الأعمال'),
('portfolio','hero','subtitle','A showcase of our finest exhibition and event projects','عرض لأفضل مشاريع المعارض والفعاليات لدينا'),
-- Contact page
('contact','hero','badge','Contact Us','تواصل معنا'),
('contact','hero','heading','Get In Touch','تواصل معنا'),
('contact','hero','subtitle','We''d love to hear about your project. Let''s talk.','يسعدنا سماع تفاصيل مشروعك. لنتحدث.'),
('contact','info','address_label','Visit Us','زيارتنا'),
('contact','info','phone_label','Call Us','اتصل بنا'),
('contact','info','email_label','Email Us','راسلنا'),
('contact','info','whatsapp_label','WhatsApp','واتساب')
ON CONFLICT (page, section, field) DO NOTHING;

-- ─── Seed: Page images ────────────────────────────────────────────────────────
INSERT INTO public.cms_page_images_2026_06_01 (page, section, image_key, image_url, alt_en, alt_ar, sort_order) VALUES
('home','hero','background','','Hero background','خلفية الرئيسية',0),
('home','about','main_image','','About section image','صورة قسم عن الشركة',0),
('about','story','image','','Our story image','صورة قصتنا',0),
('about','team','background','','Team section background','خلفية قسم الفريق',0)
ON CONFLICT (page, section, image_key) DO NOTHING;
