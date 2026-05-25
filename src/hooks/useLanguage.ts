import { createContext, useContext, useState, useEffect } from 'react';

export type Lang = 'en' | 'ar';

export interface LangContext {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  isAr: boolean;
  dir: 'ltr' | 'rtl';
  fontFamily: string;
}

// ─── Full translation dictionary ────────────────────────────────────────────
const translations: Record<string, Record<Lang, string>> = {
  // Nav
  'nav.home':      { en: 'Home',      ar: 'الرئيسية' },
  'nav.about':     { en: 'About',     ar: 'من نحن' },
  'nav.services':  { en: 'Services',  ar: 'خدماتنا' },
  'nav.portfolio': { en: 'Portfolio', ar: 'أعمالنا' },
  'nav.contact':   { en: 'Contact',   ar: 'تواصل معنا' },
  'nav.whatsapp':  { en: 'WhatsApp',  ar: 'واتساب' },
  'nav.quote':     { en: 'Get a Quote', ar: 'اطلب عرض سعر' },

  // Hero
  'hero.badge':    { en: 'Cairo, Egypt · 8+ Years of Excellence', ar: 'القاهرة · 8+ سنوات من التميز' },
  'hero.line1':    { en: 'FROM VISION', ar: 'من الفكرة' },
  'hero.line2':    { en: 'TO REALITY', ar: 'إلى التنفيذ' },
  'hero.sub':      { en: 'MOPI Production — Exhibitions • Events • Brand Activations', ar: 'موبي برودكشن — معارض • فعاليات • براند أكتيفيشن' },
  'hero.cta1':     { en: 'Get a Free Quote', ar: 'اطلب عرض سعر' },
  'hero.cta2':     { en: 'WhatsApp Now', ar: 'تواصل الآن' },
  'hero.scroll':   { en: 'Scroll to explore', ar: 'اكتشف المزيد' },

  // Stats
  'stats.projects':   { en: 'Projects Completed', ar: 'مشروع منجز' },
  'stats.years':      { en: 'Years Experience',   ar: 'سنوات خبرة' },
  'stats.clients':    { en: 'Happy Clients',      ar: 'عميل راضٍ' },
  'stats.countries':  { en: 'Countries Served',   ar: 'دولة' },

  // About
  'about.label':   { en: 'About Us', ar: 'عن الشركة' },
  'about.h1':      { en: "Cairo's Premier", ar: 'الرائدون في' },
  'about.h2':      { en: 'Exhibition & Event', ar: 'تصميم وتنفيذ المعارض' },
  'about.h3':      { en: 'Production Company', ar: 'والفعاليات بمصر' },
  'about.p1':      { en: 'MOPi Production is a Cairo-based company with 8+ years of experience designing and building exhibition booths, stands, and custom event solutions.', ar: 'موبي برودكشن شركة مصرية بخبرة +8 سنوات في تصميم وتنفيذ أجنحة المعارض والفعاليات المتكاملة.' },
  'about.p2':      { en: 'We provide full end-to-end services — from concept and design to logistics, setup, and on-site management. Quality, creativity, and seamless execution define everything we do.', ar: 'نقدم حلولاً متكاملة من أول الفكرة والتصميم وحتى التركيب والإدارة الميدانية. الجودة والإبداع والتنفيذ المثالي هي هويتنا.' },
  'about.p1a':     { en: 'Full A-to-Z Service', ar: 'خدمة متكاملة من أول لآخر' },
  'about.p1b':     { en: '8+ Years Experience', ar: '+8 سنوات خبرة' },
  'about.p1c':     { en: 'Egypt & MENA Region', ar: 'مصر ومنطقة الشرق الأوسط' },
  'about.p1d':     { en: 'On-Time Delivery',    ar: 'التسليم في الموعد دائماً' },
  'about.cta':     { en: 'Work With Us', ar: 'ابدأ مشروعك معنا' },

  // Services
  'services.label':  { en: 'What We Do', ar: 'خدماتنا' },
  'services.h1':     { en: 'Our Services', ar: 'ماذا نقدم' },
  'services.sub':    { en: 'End-to-end solutions for every exhibition and event need', ar: 'حلول متكاملة لكل احتياجات معارضك وفعالياتك' },
  'svc.1.title':     { en: 'Exhibition Booth Design & Build', ar: 'تصميم وتنفيذ أجنحة المعارض' },
  'svc.1.desc':      { en: 'Custom-designed booths that reflect your brand and command attention at any trade show.', ar: 'أجنحة مصممة خصيصاً تعكس هويتك وتستقطب الأنظار في أي معرض.' },
  'svc.2.title':     { en: 'Event Production & Management', ar: 'تنفيذ وإدارة الفعاليات' },
  'svc.2.desc':      { en: 'Full event execution — from initial planning to on-ground management and post-event wrap.', ar: 'تنفيذ متكامل للفعاليات — من التخطيط الأولي حتى الإدارة الميدانية والتقييم النهائي.' },
  'svc.3.title':     { en: 'Brand Activations', ar: 'براند أكتيفيشن' },
  'svc.3.desc':      { en: 'Creative installations and immersive experiences that deeply engage your audiences.', ar: 'تفعيلات إبداعية وتجارب تفاعلية تترك أثراً حقيقياً في ذاكرة جمهورك.' },
  'svc.4.title':     { en: 'Custom Fabrication', ar: 'تصنيع مخصص' },
  'svc.4.desc':      { en: 'Stands, partitions, kiosks, and branded structures built to your exact specifications.', ar: 'هياكل، بوثات، كيوسكات، ومنشآت مخصصة مصنوعة وفق مواصفاتك الدقيقة.' },
  'svc.5.title':     { en: 'Branding & Graphics', ar: 'هوية بصرية وجرافيك' },
  'svc.5.desc':      { en: 'Banners, signage, lightboxes, and full visual branding that elevates your presence.', ar: 'بانرات، لافتات، لايتبوكسات، وهوية بصرية متكاملة ترفع مستوى حضورك.' },
  'services.learnMore': { en: 'Learn More', ar: 'اعرف أكثر' },

  // Portfolio
  'portfolio.label':  { en: 'Our Work', ar: 'أعمالنا' },
  'portfolio.h1':     { en: 'Featured Projects', ar: 'مشاريع مختارة' },
  'portfolio.sub':    { en: 'A selection of our finest work across Egypt and the MENA region', ar: 'نماذج من أعمالنا المتميزة في مصر ومنطقة الشرق الأوسط' },
  'portfolio.all':    { en: 'All', ar: 'الكل' },
  'portfolio.viewAll':{ en: 'View All Projects', ar: 'جميع الأعمال' },
  'portfolio.cat':    { en: 'Category', ar: 'التصنيف' },
  'portfolio.loc':    { en: 'Location', ar: 'الموقع' },
  'portfolio.client': { en: 'Client', ar: 'العميل' },

  // Why Us
  'why.label':  { en: 'Why Choose Us', ar: 'لماذا موبي؟' },
  'why.h1':     { en: 'The MOPI', ar: 'الفرق الذي' },
  'why.h2':     { en: 'Difference', ar: 'يصنعه موبي' },
  'why.sub':    { en: "We don't just build booths. We build experiences that drive results.", ar: 'ما بنبنيش بوثات فقط. بنصنع تجارب تحقق نتائج حقيقية.' },
  'why.1.title':{ en: 'Award-Winning Designs', ar: 'تصاميم حائزة على جوائز' },
  'why.1.desc': { en: 'Creative, concept-driven booth designs that win awards and convert visitors.', ar: 'تصاميم إبداعية قائمة على فكرة واضحة تحقق نتائج فعلية.' },
  'why.2.title':{ en: 'Expert Team', ar: 'فريق متخصص' },
  'why.2.desc': { en: '50+ skilled professionals in design, fabrication, and event management.', ar: '+50 متخصص في التصميم والتصنيع وإدارة الفعاليات.' },
  'why.3.title':{ en: 'On-Time Delivery', ar: 'التسليم في الموعد' },
  'why.3.desc': { en: '98% on-time delivery rate. Your deadline is our commitment.', ar: '98% من مشاريعنا تُسلَّم في موعدها. التزامنا بكلمتنا.' },
  'why.4.title':{ en: 'End-to-End Service', ar: 'خدمة متكاملة' },
  'why.4.desc': { en: 'From concept to dismantling — we handle every single detail.', ar: 'من الفكرة للتركيب وحتى الفك — بنتحمل كل التفاصيل.' },
  'why.5.title':{ en: 'MENA Coverage', ar: 'تغطية الشرق الأوسط' },
  'why.5.desc': { en: 'Active in 15+ countries. Local expertise with global standards.', ar: 'نعمل في +15 دولة. خبرة محلية بمعايير دولية.' },
  'why.6.title':{ en: 'Budget Flexibility', ar: 'مرونة في الميزانية' },
  'why.6.desc': { en: 'Premium quality across a wide range of budgets. No compromises.', ar: 'جودة عالية بأسعار مرنة تناسب ميزانيتك. بدون تنازلات.' },

  // Process
  'process.label': { en: 'How We Work', ar: 'كيف نعمل' },
  'process.h1':    { en: 'Our Process', ar: 'خطوات العمل' },
  'process.sub':   { en: 'From your first call to the final installation — a proven process that delivers', ar: 'من أول تواصل لغاية آخر مسمار — منهجية مجربة تضمن النتائج' },
  'step.1.title':  { en: 'Brief & Consultation', ar: 'الاستشارة والتحليل' },
  'step.1.desc':   { en: 'We listen, understand your goals, and define the project scope together.', ar: 'بنسمع، بنفهم أهدافك، وبنحدد نطاق المشروع مع بعض.' },
  'step.2.title':  { en: 'Concept & Design', ar: 'التصور والتصميم' },
  'step.2.desc':   { en: 'Our creative team develops unique concepts that reflect your brand.', ar: 'فريقنا الإبداعي بيطور أفكاراً فريدة تعكس هوية براندك.' },
  'step.3.title':  { en: 'Fabrication', ar: 'التصنيع والإنتاج' },
  'step.3.desc':   { en: 'Built with premium materials in our Cairo workshop with strict quality control.', ar: 'تصنيع بخامات ممتازة في ورشتنا بالقاهرة مع مراقبة جودة صارمة.' },
  'step.4.title':  { en: 'Installation & Launch', ar: 'التركيب والإطلاق' },
  'step.4.desc':   { en: 'On-site setup, testing, and support throughout the entire event.', ar: 'تركيب واختبار ودعم ميداني طوال فترة الفعالية.' },

  // Clients
  'clients.label': { en: 'Trusted By', ar: 'يثقون بنا' },
  'clients.h1':    { en: 'Our Clients', ar: 'عملاؤنا' },
  'clients.sub':   { en: 'Leading brands and organizations trust MOPI Production', ar: 'كبرى الشركات والمؤسسات تختار موبي برودكشن' },

  // Contact
  'contact.label':    { en: 'Get In Touch', ar: 'تواصل معنا' },
  'contact.h1':       { en: 'Start Your', ar: 'ابدأ مشروعك' },
  'contact.h2':       { en: 'Next Project', ar: 'الجديد معنا' },
  'contact.sub':      { en: "Tell us about your project and we'll get back to you within 24 hours.", ar: 'شاركنا تفاصيل مشروعك وسنرد عليك خلال 24 ساعة.' },
  'contact.name':     { en: 'Your Name', ar: 'الاسم' },
  'contact.email':    { en: 'Email Address', ar: 'البريد الإلكتروني' },
  'contact.phone':    { en: 'Phone Number', ar: 'رقم الهاتف' },
  'contact.service':  { en: 'Service Needed', ar: 'الخدمة المطلوبة' },
  'contact.message':  { en: 'Project Details', ar: 'تفاصيل المشروع' },
  'contact.send':     { en: 'Send Message', ar: 'إرسال الرسالة' },
  'contact.sending':  { en: 'Sending...', ar: 'جاري الإرسال...' },
  'contact.sent':     { en: "Message sent! We'll be in touch shortly.", ar: 'تم إرسال رسالتك! سنتواصل معك قريباً.' },
  'contact.another':  { en: 'Send Another Message', ar: 'أرسل رسالة أخرى' },
  'contact.orDirect': { en: 'Or message us directly on', ar: 'أو تواصل معنا مباشرة عبر' },
  'contact.info':     { en: 'Contact Info', ar: 'بيانات التواصل' },
  'contact.follow':   { en: 'Follow Us', ar: 'تابعنا' },
  'contact.select':   { en: 'Select a service', ar: 'اختر الخدمة' },
  'contact.opt1':     { en: 'Exhibition Booth', ar: 'جناح معرض' },
  'contact.opt2':     { en: 'Event Production', ar: 'إنتاج فعالية' },
  'contact.opt3':     { en: 'Brand Activation', ar: 'براند أكتيفيشن' },
  'contact.opt4':     { en: 'Custom Fabrication', ar: 'تصنيع مخصص' },
  'contact.opt5':     { en: 'Other', ar: 'أخرى' },

  // CTA Band
  'cta.h1':    { en: 'Ready to Make an', ar: 'مستعد لإحداث' },
  'cta.h2':    { en: 'Impact?', ar: 'أثر حقيقي؟' },
  'cta.sub':   { en: "Let's create something extraordinary together.", ar: 'نصنع مشروعاً استثنائياً مع بعض.' },
  'cta.btn1':  { en: 'Start Your Project', ar: 'ابدأ مشروعك الآن' },
  'cta.btn2':  { en: 'View Our Work', ar: 'شوف أعمالنا' },

  // Footer
  'footer.services': { en: 'Services', ar: 'الخدمات' },
  'footer.contact':  { en: 'Contact', ar: 'التواصل' },
  'footer.rights':   { en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' },
  'footer.admin':    { en: 'Admin Dashboard', ar: 'لوحة التحكم' },
  'footer.email':    { en: 'Email Us', ar: 'راسلنا' },
  'footer.svc1':     { en: 'Exhibition Booth Design', ar: 'تصميم أجنحة المعارض' },
  'footer.svc2':     { en: 'Event Production', ar: 'تنفيذ الفعاليات' },
  'footer.svc3':     { en: 'Brand Activations', ar: 'براند أكتيفيشن' },
  'footer.svc4':     { en: 'Custom Fabrication', ar: 'تصنيع مخصص' },
  'footer.svc5':     { en: 'Branding & Graphics', ar: 'هوية بصرية وجرافيك' },
};

// ─── Context ─────────────────────────────────────────────────────────────────
import { createContext as _createContext } from 'react';
export const LanguageContext = createContext<LangContext>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
  isAr: false,
  dir: 'ltr',
  fontFamily: "'Montserrat', 'General Sans', sans-serif",
});

// ─── Provider logic (use inside App.tsx or per-page) ─────────────────────────
export function buildLangContext(lang: Lang, setLang: (l: Lang) => void): LangContext {
  const isAr = lang === 'ar';
  const t = (key: string): string => translations[key]?.[lang] ?? translations[key]?.['en'] ?? key;
  return {
    lang,
    setLang,
    t,
    isAr,
    dir: isAr ? 'rtl' : 'ltr',
    fontFamily: isAr
      ? "'Cairo', 'IBM Plex Sans Arabic', sans-serif"
      : "'Montserrat', 'General Sans', sans-serif",
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLanguage(): LangContext {
  return useContext(LanguageContext);
}

// ─── Standalone hook (no context needed, manages its own state) ───────────────
export function useLocalLanguage() {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (localStorage.getItem('mopi_lang') as Lang) || 'en'; } catch { return 'en'; }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('mopi_lang', l); } catch {}
    document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', l);
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  return buildLangContext(lang, setLang);
}
