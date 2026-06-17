
-- ══════════════════════════════════════════════════════════════
-- Services Page CMS Seed — 2026_06_17
-- Inserts/Updates: hero, service cards 1-4, additional services,
-- industries, why-choose-us, CTA sections
-- ══════════════════════════════════════════════════════════════

-- Helper: upsert function
CREATE OR REPLACE FUNCTION upsert_page_content(
  _page text, _section text, _field text,
  _en text, _ar text
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO cms_page_content_2026_06_01 (page, section, field, value_en, value_ar)
  VALUES (_page, _section, _field, _en, _ar)
  ON CONFLICT (page, section, field)
  DO UPDATE SET value_en = EXCLUDED.value_en, value_ar = EXCLUDED.value_ar;
END;
$$;

-- ── HERO ──────────────────────────────────────────────────────
SELECT upsert_page_content('services','hero','badge','End-to-End Solutions','حلول متكاملة');
SELECT upsert_page_content('services','hero','badge_ar','حلول متكاملة','حلول متكاملة');
SELECT upsert_page_content('services','hero','heading','Comprehensive','حلول معارض');
SELECT upsert_page_content('services','hero','subline','Exhibition Solutions','شاملة ومتكاملة');
SELECT upsert_page_content('services','hero','heading_ar','حلول معارض','حلول معارض');
SELECT upsert_page_content('services','hero','subline_ar','شاملة ومتكاملة','شاملة ومتكاملة');
SELECT upsert_page_content('services','hero','subheading','From concept to completion — we provide end-to-end services that transform your brand vision into powerful, engaging experiences.','من الفكرة للتنفيذ — نقدم خدمات متكاملة تحوّل رؤية براندك إلى تجارب قوية ومؤثرة.');
SELECT upsert_page_content('services','hero','subheading_ar','من الفكرة للتنفيذ — نقدم خدمات متكاملة تحوّل رؤية براندك إلى تجارب قوية ومؤثرة.','من الفكرة للتنفيذ — نقدم خدمات متكاملة تحوّل رؤية براندك إلى تجارب قوية ومؤثرة.');
SELECT upsert_page_content('services','hero','cta','Get Custom Quote','اطلب عرض سعر');

-- ── SERVICE CARD 1 · Exhibition Booth Design ─────────────────
SELECT upsert_page_content('services','card1','title','Exhibition Booth Design & Build','تصميم وتنفيذ أجنحة المعارض');
SELECT upsert_page_content('services','card1','subtitle','Custom-designed booths that captivate and convert','أجنحة مصممة خصيصاً تستقطب الأنظار وتحقق النتائج');
SELECT upsert_page_content('services','card1','desc','From concept to completion, we create stunning exhibition booths that tell your brand story and drive meaningful engagement with your target audience.','من الفكرة للتنفيذ، نصمم أجنحة معارض احترافية تعكس هوية براندك وتحقق تفاعلاً حقيقياً مع جمهورك المستهدف.');
SELECT upsert_page_content('services','card1','f1','3D Design & Visualization','تصميم ثلاثي الأبعاد وتصور واقعي');
SELECT upsert_page_content('services','card1','f2','Custom Branding Integration','دمج هوية البراند بالكامل');
SELECT upsert_page_content('services','card1','f3','Interactive Elements','عناصر تفاعلية وتقنية');
SELECT upsert_page_content('services','card1','f4','Premium Materials','خامات ممتازة عالية الجودة');
SELECT upsert_page_content('services','card1','f5','Modular Systems','أنظمة معيارية قابلة للتوسيع');
SELECT upsert_page_content('services','card1','f6','On-site Installation','تركيب ودعم في الموقع');
SELECT upsert_page_content('services','card1','p1','Initial Consultation & Brief','استشارة أولية وتحليل المتطلبات');
SELECT upsert_page_content('services','card1','p2','3D Design Development','تطوير التصميم ثلاثي الأبعاد');
SELECT upsert_page_content('services','card1','p3','Client Approval & Refinement','موافقة العميل والتعديلات');
SELECT upsert_page_content('services','card1','p4','Production & Fabrication','التصنيع والإنتاج');
SELECT upsert_page_content('services','card1','p5','Installation & Setup','التركيب والإعداد');
SELECT upsert_page_content('services','card1','p6','Post-Event Support','الدعم بعد الفعالية');

-- ── SERVICE CARD 2 · Event Production ────────────────────────
SELECT upsert_page_content('services','card2','title','Event Production & Management','تنفيذ وإدارة الفعاليات');
SELECT upsert_page_content('services','card2','subtitle','Complete event management from concept to execution','إدارة متكاملة للفعاليات من الفكرة حتى التنفيذ');
SELECT upsert_page_content('services','card2','desc','Full-service event production including stage design, lighting, audio-visual systems, and on-the-ground management for corporate events and product launches.','خدمة متكاملة في إنتاج الفعاليات تشمل تصميم المسرح والإضاءة وأنظمة الصوت والصورة والإدارة الميدانية للفعاليات المؤسسية.');
SELECT upsert_page_content('services','card2','f1','Stage Design & Construction','تصميم وإنشاء المسرح');
SELECT upsert_page_content('services','card2','f2','Professional Lighting Systems','أنظمة إضاءة احترافية');
SELECT upsert_page_content('services','card2','f3','Audio-Visual Integration','تكامل الصوت والصورة');
SELECT upsert_page_content('services','card2','f4','Technical Support Team','فريق دعم تقني متخصص');
SELECT upsert_page_content('services','card2','f5','Project Management','إدارة مشروع متكاملة');
SELECT upsert_page_content('services','card2','f6','Live Event Coordination','تنسيق الفعالية مباشرة');
SELECT upsert_page_content('services','card2','p1','Event Planning & Strategy','تخطيط الفعالية والاستراتيجية');
SELECT upsert_page_content('services','card2','p2','Technical Requirements Analysis','تحليل المتطلبات التقنية');
SELECT upsert_page_content('services','card2','p3','Design & Setup Planning','التصميم وتخطيط الإعداد');
SELECT upsert_page_content('services','card2','p4','Equipment Installation','تركيب المعدات');
SELECT upsert_page_content('services','card2','p5','Live Event Management','إدارة الفعالية المباشرة');
SELECT upsert_page_content('services','card2','p6','Post-Event Breakdown','التفكيك بعد الفعالية');

-- ── SERVICE CARD 3 · Brand Activations ───────────────────────
SELECT upsert_page_content('services','card3','title','Brand Activations','براند أكتيفيشن');
SELECT upsert_page_content('services','card3','subtitle','Immersive experiences that deeply engage audiences','تجارب تفاعلية تترك أثراً حقيقياً في ذاكرة جمهورك');
SELECT upsert_page_content('services','card3','desc','Creative brand activations and installations that create memorable interactions between your brand and your audience, driving real engagement and recall.','تفعيلات براند إبداعية ومنشآت تصنع تفاعلاً حقيقياً بين براندك وجمهورك، تُحدث أثراً وتُعزز التذكّر.');
SELECT upsert_page_content('services','card3','f1','Concept & Strategy','الفكرة والاستراتيجية');
SELECT upsert_page_content('services','card3','f2','Custom Installations','منشآت مخصصة');
SELECT upsert_page_content('services','card3','f3','Interactive Experiences','تجارب تفاعلية');
SELECT upsert_page_content('services','card3','f4','Brand Storytelling','سرد قصة البراند');
SELECT upsert_page_content('services','card3','f5','Audience Engagement','تفاعل الجمهور');
SELECT upsert_page_content('services','card3','f6','Post-Activation Reports','تقارير ما بعد التفعيل');
SELECT upsert_page_content('services','card3','p1','Brand Analysis & Strategy','تحليل البراند والاستراتيجية');
SELECT upsert_page_content('services','card3','p2','Creative Concept Development','تطوير المفهوم الإبداعي');
SELECT upsert_page_content('services','card3','p3','Design & Production','التصميم والإنتاج');
SELECT upsert_page_content('services','card3','p4','Installation & Testing','التركيب والاختبار');
SELECT upsert_page_content('services','card3','p5','Live Activation Management','إدارة التفعيل المباشر');
SELECT upsert_page_content('services','card3','p6','Performance Analysis','تحليل الأداء');

-- ── SERVICE CARD 4 · Custom Fabrication ──────────────────────
SELECT upsert_page_content('services','card4','title','Custom Fabrication','تصنيع مخصص');
SELECT upsert_page_content('services','card4','subtitle','Tailored structures for any space and purpose','هياكل مصنوعة وفق مواصفاتك لأي مكان وغرض');
SELECT upsert_page_content('services','card4','desc','Modular and custom structures designed to your exact specifications — from temporary installations to permanent displays, kiosks, and architectural elements.','هياكل معيارية ومخصصة مصممة وفق مواصفاتك الدقيقة — من المنشآت المؤقتة إلى العروض الدائمة والكيوسكات والعناصر المعمارية.');
SELECT upsert_page_content('services','card4','f1','Modular Design Systems','أنظمة تصميم معيارية');
SELECT upsert_page_content('services','card4','f2','Custom Fabrication','تصنيع مخصص');
SELECT upsert_page_content('services','card4','f3','Structural Engineering','هندسة هيكلية');
SELECT upsert_page_content('services','card4','f4','Premium Materials','خامات ممتازة');
SELECT upsert_page_content('services','card4','f5','Quick Assembly Systems','أنظمة تجميع سريع');
SELECT upsert_page_content('services','card4','f6','Maintenance Support','دعم الصيانة');
SELECT upsert_page_content('services','card4','p1','Site Assessment & Planning','تقييم الموقع والتخطيط');
SELECT upsert_page_content('services','card4','p2','Structural Design','التصميم الهيكلي');
SELECT upsert_page_content('services','card4','p3','Material Selection','اختيار المواد');
SELECT upsert_page_content('services','card4','p4','Fabrication & QC','التصنيع ومراقبة الجودة');
SELECT upsert_page_content('services','card4','p5','Installation & Testing','التركيب والاختبار');
SELECT upsert_page_content('services','card4','p6','Handover & Training','التسليم والتدريب');

-- ── ADDITIONAL SERVICES ───────────────────────────────────────
SELECT upsert_page_content('services','additional','label','Support Services','خدمات الدعم');
SELECT upsert_page_content('services','additional','heading','Additional','إضافية');
SELECT upsert_page_content('services','additional','heading2','Services','خدمات');
SELECT upsert_page_content('services','additional','subtitle','Comprehensive support to ensure every project''s complete success','دعم شامل لضمان نجاح كل مشروع بالكامل');
SELECT upsert_page_content('services','additional','s1_title','Branding & Graphics','هوية بصرية وجرافيك');
SELECT upsert_page_content('services','additional','s1_desc','Banners, signage, lightboxes, and full visual branding that elevates your presence at any show.','بانرات، لافتات، لايتبوكسات، وهوية بصرية متكاملة ترفع مستوى حضورك في أي معرض.');
SELECT upsert_page_content('services','additional','s2_title','Technical Support','دعم تقني');
SELECT upsert_page_content('services','additional','s2_desc','24/7 on-site technical support during events and exhibitions — no detail is too small.','دعم تقني ميداني على مدار الساعة أثناء الفعاليات والمعارض — لا تفاصيل صغيرة.');
SELECT upsert_page_content('services','additional','s3_title','Logistics Management','إدارة اللوجستيات');
SELECT upsert_page_content('services','additional','s3_desc','Complete logistics coordination including shipping, storage, and transportation management.','تنسيق لوجستي متكامل يشمل الشحن والتخزين والنقل.');
SELECT upsert_page_content('services','additional','s4_title','Project Management','إدارة المشاريع');
SELECT upsert_page_content('services','additional','s4_desc','Dedicated project managers ensuring on-time, on-budget delivery with zero surprises.','مديرو مشاريع متخصصون يضمنون التسليم في الوقت المحدد وبالميزانية المقررة.');

-- ── WHY CHOOSE US ─────────────────────────────────────────────
SELECT upsert_page_content('services','why','label','Why Choose Us','لماذا موبي؟');
SELECT upsert_page_content('services','why','heading','Why Choose MOPi?','لماذا تختار موبي؟');
SELECT upsert_page_content('services','why','w1_title','On-Time Delivery','التسليم في الموعد');
SELECT upsert_page_content('services','why','w1_desc','We meet every deadline — no excuses, no exceptions.','نلتزم بكل موعد — بدون أعذار.');
SELECT upsert_page_content('services','why','w2_title','Award-Winning Design','تصاميم حائزة على جوائز');
SELECT upsert_page_content('services','why','w2_desc','Multiple industry awards for innovation and excellence.','جوائز صناعية متعددة للابتكار والتميز.');
SELECT upsert_page_content('services','why','w3_title','Premium Quality','جودة عالية');
SELECT upsert_page_content('services','why','w3_desc','Uncompromising quality at every material, finish, and structural detail.','جودة لا تهاون فيها في كل خامة وتشطيبة وتفصيلة هيكلية.');
SELECT upsert_page_content('services','why','w4_title','Expert Team','فريق متخصص');
SELECT upsert_page_content('services','why','w4_desc','8+ years of specialists in design, production, and live events.','8+ سنوات من المتخصصين في التصميم والإنتاج والفعاليات.');
SELECT upsert_page_content('services','why','w5_title','A-to-Z Service','خدمة من أول لآخر');
SELECT upsert_page_content('services','why','w5_desc','Concept, logistics, setup, management — all under one roof.','الفكرة، اللوجستيات، التركيب، الإدارة — كل شيء تحت سقف واحد.');
SELECT upsert_page_content('services','why','w6_title','8+ Years Experience','8+ سنوات خبرة');
SELECT upsert_page_content('services','why','w6_desc','Proven track record delivering 500+ projects across the MENA region.','سجل حافل بتسليم +500 مشروع في منطقة الشرق الأوسط.');

-- ── INDUSTRIES ────────────────────────────────────────────────
SELECT upsert_page_content('services','industries','label','Sectors We Serve','القطاعات التي نخدمها');
SELECT upsert_page_content('services','industries','heading','Industries We Serve','القطاعات التي نخدمها');
SELECT upsert_page_content('services','industries','subtitle','Our expertise spans multiple industries with tailored solutions','خبرتنا تمتد عبر قطاعات متعددة بحلول مخصصة');
SELECT upsert_page_content('services','industries','i1','Technology & IT','تكنولوجيا المعلومات');
SELECT upsert_page_content('services','industries','i2','Healthcare & Pharma','الصحة والدواء');
SELECT upsert_page_content('services','industries','i3','Automotive','السيارات');
SELECT upsert_page_content('services','industries','i4','Financial Services','الخدمات المالية');
SELECT upsert_page_content('services','industries','i5','Consumer Goods','السلع الاستهلاكية');
SELECT upsert_page_content('services','industries','i6','Energy & Utilities','الطاقة والمرافق');
SELECT upsert_page_content('services','industries','i7','Education','التعليم');
SELECT upsert_page_content('services','industries','i8','Government & Public','الحكومة والقطاع العام');

-- ── CTA SECTION ───────────────────────────────────────────────
SELECT upsert_page_content('services','cta','label',"Let's Get Started",'لنبدأ معاً');
SELECT upsert_page_content('services','cta','heading','Ready to Start Your Project?','مستعد لبدء مشروعك؟');
SELECT upsert_page_content('services','cta','heading2','Your Project?','مشروعك؟');
SELECT upsert_page_content('services','cta','subtitle','Let''s discuss your exhibition needs and create a custom solution that exceeds expectations.','دعنا نناقش احتياجات معرضك ونصنع لك حلاً مخصصاً يفوق التوقعات.');
SELECT upsert_page_content('services','cta','cta_primary','Free Consultation','استشارة مجانية');
