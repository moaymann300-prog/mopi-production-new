import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '@/assets/images';
import { useCMS, getLogoUrl } from '@/hooks/useCMS';
import { useLocalLanguage } from '@/hooks/useLanguage';
import {
  ArrowRight, Phone, Mail, MapPin, MessageCircle,
  Menu, X, ChevronRight, ExternalLink, Award, Users, Calendar, Eye, XCircle,
} from 'lucide-react';

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); o.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
};

const SectionLabel = ({ text }: { text: string }) => (
  <div className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.22em] uppercase mb-5" style={{ color: '#ED8214' }}>
    <span className="w-8 h-px block" style={{ background: '#ED8214' }} />{text}<span className="w-8 h-px block" style={{ background: '#ED8214' }} />
  </div>
);

const Badge = ({ text }: { text: string }) => (
  <span className="inline-block text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded tracking-wide uppercase" style={{ background: '#ED8214' }}>{text}</span>
);

const Counter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let v = 0; const step = target / 60;
        const t = setInterval(() => { v += step; if (v >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(v)); }, 20);
      }
    });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [target]);
  return <span ref={ref} style={{ color: '#ED8214' }}>{count}{suffix}</span>;
};

/* ── Shared Bilingual Footer ── */
const SharedFooter = () => {
  const cms = useCMS();
  const { isAr } = useLocalLanguage();
  const companyName = cms.settings.company_name || 'MOPi Production';
  const email = cms.settings.email || 'info@mopiproduction.com';
  const phone = cms.settings.phone_1 || '+20 100 000 0000';
  const phone2 = cms.settings.phone_2 || '';
  const address = cms.settings.address || 'Cairo, Egypt';
  const tagline = cms.settings.footer_tagline || cms.settings.tagline || (isAr ? 'شركة موبي برودكشن — الرائدة في تصميم المعارض وإنتاج الفعاليات.' : "Cairo's leading exhibition booth design and event production company.");
  const logoUrl = getLogoUrl(cms.footerLogo || cms.headerLogo);
  const whatsappUrl = cms.settings.whatsapp_number ? `https://wa.me/${cms.settings.whatsapp_number.replace(/[^0-9]/g, '')}` : 'https://wa.me/201000000000';

  const footerServices = isAr
    ? ['تصميم أجنحة المعارض', 'تنفيذ الفعاليات', 'براند أكتيفيشن', 'تصنيع مخصص', 'هوية بصرية وجرافيك']
    : ['Exhibition Booth Design', 'Event Production', 'Brand Activations', 'Custom Fabrication', 'Branding & Graphics'];

  return (
    <footer style={{ background: '#000000', borderTop: '3px solid #ED8214' }} className="py-14 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <img src={logoUrl} alt={companyName} className="h-12 w-auto object-contain mb-4 hover:opacity-80 transition-opacity" />
            <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: '#6b7280', lineHeight: isAr ? '2' : '1.7' }}>{tagline}</p>
            <div className="flex gap-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
                style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.25)', color: '#4ade80' }}
                onMouseEnter={e => { (e.currentTarget.style.background = '#16a34a'); (e.currentTarget.style.color = '#fff'); }}
                onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(22,163,74,0.15)'); (e.currentTarget.style.color = '#4ade80'); }}>
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
              <a href={`mailto:${email}`}
                className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
                style={{ background: 'rgba(244,163,0,0.1)', border: '1px solid rgba(244,163,0,0.25)', color: '#ED8214' }}
                onMouseEnter={e => { (e.currentTarget.style.background = '#ED8214'); (e.currentTarget.style.color = '#fff'); }}
                onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(244,163,0,0.1)'); (e.currentTarget.style.color = '#ED8214'); }}>
                <Mail className="h-3.5 w-3.5" /> {isAr ? 'راسلنا' : 'Email Us'}
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-white">{isAr ? 'خدماتنا' : 'Services'}</h4>
            <ul className="space-y-2.5">
              {footerServices.map(s => (
                <li key={s}><Link to="/services" className="text-sm flex items-center gap-1.5" style={{ color: '#6b7280' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ED8214')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                  <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(244,163,0,0.4)' }} />{s}
                </Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-white">{isAr ? 'تواصل معنا' : 'Contact'}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm" style={{ color: '#6b7280' }}><MapPin className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} /> {address}</li>
              <li><a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-sm transition-colors" style={{ color: '#6b7280' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                <Phone className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} /> {phone}</a></li>
              {phone2 && <li><a href={`tel:${phone2.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-sm transition-colors" style={{ color: '#6b7280' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                <Phone className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} /> {phone2}</a></li>}
              <li><a href={`mailto:${email}`} className="flex items-center gap-2.5 text-sm transition-colors" style={{ color: '#6b7280' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                <Mail className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} /> {email}</a></li>
            </ul>
            <Link to="/admin" className="inline-flex items-center gap-1 mt-7 text-xs" style={{ color: '#374151' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')} onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
              {isAr ? 'لوحة التحكم' : 'Admin Dashboard'} →
            </Link>
          </div>
        </div>
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm" style={{ color: '#374151' }}>© 2026 {companyName}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          <p className="text-xs tracking-wide" style={{ color: '#1f2937' }}>{isAr ? 'أجنحة المعارض · براند أكتيفيشن · إنتاج الفعاليات' : 'Exhibition Booths · Brand Activations · Event Production'}</p>
        </div>
      </div>
    </footer>
  );
};

/* ════════════════ PORTFOLIO PAGE ════════════════ */
const Portfolio = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<null | {
    title: string; titleAr: string; cat: string; catAr: string;
    client: string; clientAr: string; location: string; locationAr: string;
    date: string; dateAr: string; visitors: string;
    image: string; award: string | null; awardAr: string | null;
    desc: string; descAr: string;
  }>(null);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [spotlightTransition, setSpotlightTransition] = useState(false);
  const spotlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cms = useCMS();
  const { t, isAr, dir, fontFamily } = useLocalLanguage();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.services'), to: '/services' },
    { label: t('nav.portfolio'), to: '/portfolio' },
    { label: t('nav.contact'), to: '/contact' },
  ];

  // Bilingual categories
  const categories = [
    { key: 'all', en: 'All', ar: 'الكل' },
    { key: 'exhibition', en: 'Exhibition', ar: 'معارض' },
    { key: 'event', en: 'Event', ar: 'فعاليات' },
    { key: 'booth', en: 'Booth', ar: 'أجنحة' },
    { key: 'corporate', en: 'Corporate', ar: 'شركات' },
  ];

  // Bilingual projects
  const projects = [
    {
      title: 'Tech Innovation Expo 2026', titleAr: 'معرض التكنولوجيا والابتكار 2026',
      cat: 'exhibition', catAr: 'معارض',
      client: 'TechCorp International', clientAr: 'تك كورب الدولية',
      location: 'Dubai, UAE', locationAr: 'دبي، الإمارات',
      date: 'March 2026', dateAr: 'مارس 2026',
      visitors: '50,000+',
      image: IMAGES.BOOTH_8,
      award: 'Best Innovation Award 2026', awardAr: 'جائزة أفضل ابتكار 2026',
      desc: 'Cutting-edge exhibition booth featuring interactive displays, holographic presentations, and immersive brand experiences.',
      descAr: 'جناح معرض متطور يضم شاشات تفاعلية وعروضاً هولوغرافية وتجارب براند استثنائية.',
    },
    {
      title: 'Global Healthcare Summit', titleAr: 'قمة الرعاية الصحية العالمية',
      cat: 'event', catAr: 'فعاليات',
      client: 'MedTech Solutions', clientAr: 'ميدتك سوليوشنز',
      location: 'Cairo, Egypt', locationAr: 'القاهرة، مصر',
      date: 'February 2026', dateAr: 'فبراير 2026',
      visitors: '15,000+',
      image: IMAGES.EVENT_1,
      award: null, awardAr: null,
      desc: 'Complete event production for a three-day healthcare summit including main stage, breakout rooms, and networking areas.',
      descAr: 'تنفيذ متكامل لقمة رعاية صحية لمدة ثلاثة أيام شملت المسرح الرئيسي وغرف العمل وأركان التواصل.',
    },
    {
      title: 'Automotive Excellence Booth', titleAr: 'جناح السيارات الفاخرة',
      cat: 'booth', catAr: 'أجنحة',
      client: 'AutoMax Industries', clientAr: 'أوتوماكس إندستريز',
      location: 'Riyadh, KSA', locationAr: 'الرياض، السعودية',
      date: 'January 2026', dateAr: 'يناير 2026',
      visitors: '25,000+',
      image: IMAGES.BOOTH_4,
      award: 'Design Excellence Award', awardAr: 'جائزة التميز في التصميم',
      desc: 'Premium automotive exhibition booth showcasing luxury vehicles with sophisticated lighting and premium finishes.',
      descAr: 'جناح معارض للسيارات الفاخرة مع إضاءة احترافية وتشطيبات راقية تعكس الفخامة والتميز.',
    },
    {
      title: 'Corporate Annual Conference', titleAr: 'المؤتمر السنوي للشركات',
      cat: 'corporate', catAr: 'شركات',
      client: 'Global Finance Corp', clientAr: 'جلوبال فاينانس كورب',
      location: 'Cairo, Egypt', locationAr: 'القاهرة، مصر',
      date: 'December 2025', dateAr: 'ديسمبر 2025',
      visitors: '8,000+',
      image: IMAGES.CORPORATE_4,
      award: null, awardAr: null,
      desc: 'Elegant corporate event setup with multiple conference rooms, networking areas, and executive meeting spaces.',
      descAr: 'إعداد راقٍ لفعالية شركات مع قاعات مؤتمرات متعددة وأركان تواصل وغرف اجتماعات تنفيذية.',
    },
    {
      title: 'Luxury Brand Activation', titleAr: 'براند أكتيفيشن للعلامات الفاخرة',
      cat: 'event', catAr: 'فعاليات',
      client: 'Premium Brands Group', clientAr: 'بريميوم براندز جروب',
      location: 'Alexandria, Egypt', locationAr: 'الإسكندرية، مصر',
      date: 'November 2025', dateAr: 'نوفمبر 2025',
      visitors: '12,000+',
      image: IMAGES.EVENT_3,
      award: 'Event of the Year 2025', awardAr: 'فعالية العام 2025',
      desc: 'High-impact product launch event with dramatic staging, special effects, and immersive brand storytelling.',
      descAr: 'فعالية إطلاق منتج عالية التأثير مع مسرح درامي ومؤثرات خاصة ورواية براند استثنائية.',
    },
    {
      title: 'International Trade Show', titleAr: 'معرض التجارة الدولي',
      cat: 'exhibition', catAr: 'معارض',
      client: 'Trade Connect Ltd', clientAr: 'تريد كونكت',
      location: 'Abu Dhabi, UAE', locationAr: 'أبوظبي، الإمارات',
      date: 'October 2025', dateAr: 'أكتوبر 2025',
      visitors: '35,000+',
      image: IMAGES.CORPORATE_2,
      award: null, awardAr: null,
      desc: 'Multi-brand exhibition space featuring modular booth systems and flexible display configurations.',
      descAr: 'فضاء معارض متعدد البراندات بأنظمة أجنحة معيارية وتكوينات عرض مرنة.',
    },
    {
      title: 'Retail Pop-Up Installation', titleAr: 'منفذ بيع بوب-أب مبتكر',
      cat: 'booth', catAr: 'أجنحة',
      client: 'Fashion House Egypt', clientAr: 'فاشون هاوس مصر',
      location: 'Cairo, Egypt', locationAr: 'القاهرة، مصر',
      date: 'September 2025', dateAr: 'سبتمبر 2025',
      visitors: '18,000+',
      image: IMAGES.BOOTH_2,
      award: null, awardAr: null,
      desc: 'Creative pop-up retail experience with immersive brand atmosphere and interactive customer touchpoints.',
      descAr: 'تجربة تسوق بوب-أب مبتكرة بأجواء براند استثنائية ونقاط تفاعل مع العملاء.',
    },
    {
      title: 'Financial Services Summit', titleAr: 'قمة الخدمات المالية',
      cat: 'corporate', catAr: 'شركات',
      client: 'Banking Alliance MENA', clientAr: 'تحالف البنوك - منطقة الشرق الأوسط',
      location: 'Cairo, Egypt', locationAr: 'القاهرة، مصر',
      date: 'August 2025', dateAr: 'أغسطس 2025',
      visitors: '10,000+',
      image: IMAGES.CORPORATE_5,
      award: null, awardAr: null,
      desc: 'Sophisticated corporate event featuring executive meeting spaces, presentation theaters, and networking lounges.',
      descAr: 'فعالية شركات راقية تضم مساحات اجتماعات تنفيذية ومسارح عرض وصالات تواصل.',
    },
  ];

  const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.cat === activeFilter);

  // CMS data with fallbacks
  const companyNamePortfolio = cms.settings.company_name || 'MOPi Production';
  const logoUrlPortfolio = getLogoUrl(cms.headerLogo);
  const whatsappUrlPortfolio = cms.settings.whatsapp_number ? `https://wa.me/${cms.settings.whatsapp_number.replace(/[^0-9]/g, '')}` : 'https://wa.me/201000000000';
  const heroPortfolio = cms.heroes['portfolio'];

  // Stats bilingual
  const stats = [
    { num: 500, suffix: '+', label: isAr ? 'مشروع منجز' : 'Projects Completed' },
    { num: 15, suffix: '+', label: isAr ? 'دولة حول العالم' : 'Countries Served' },
    { num: 200, suffix: '+', label: isAr ? 'عميل راضٍ' : 'Happy Clients' },
    { num: 25, suffix: '+', label: isAr ? 'جائزة صناعية' : 'Industry Awards' },
  ];

  return (
    <div className="overflow-x-hidden" dir={dir} style={{ fontFamily }}>
      <style>{`
        @keyframes slowZoom  { from{transform:scale(1.05)} to{transform:scale(1.13)} }
        @keyframes fadeDown  { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-32px)} to{opacity:1;transform:translateX(0)} }
        .nav-link::after { content:''; display:block; height:2px; width:0; background:#ED8214; transition:width 0.3s ease; margin-top:2px; }
        .nav-link:hover::after { width:100%; }
        .port-img { transition: transform 0.7s ease; }
        .port-card:hover .port-img { transform: scale(1.1); }
      `}</style>

      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: scrolled ? '14px 0' : '19px 0', boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          <Link to="/"><img src={logoUrlPortfolio} alt={companyNamePortfolio} className="h-16 w-auto object-contain transition-opacity hover:opacity-75" /></Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => <Link key={l.to} to={l.to} className="nav-link text-sm font-medium tracking-wide" style={{ color: l.to === '/portfolio' ? '#ffffff' : '#d1d5db' }}>{l.label}</Link>)}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => { const stored = localStorage.getItem('mopi_lang'); const next = stored === 'ar' ? 'en' : 'ar'; localStorage.setItem('mopi_lang', next); window.dispatchEvent(new Event('mopi-lang-change')); window.location.reload(); }}
              className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105"
              style={{ background: 'rgba(244,163,0,0.12)', border: '1px solid rgba(244,163,0,0.3)', color: '#ED8214' }}>
              {isAr ? 'EN' : 'عربي'}
            </button>
            <a href={whatsappUrlPortfolio} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all hover:scale-105" style={{ background: '#16a34a' }}>
              <MessageCircle className="h-4 w-4" /> {t('nav.whatsapp')}
            </a>
            <Link to="/contact" className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105" style={{ background: '#ED8214' }}>
              {t('nav.quote')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <button onClick={() => setMenuOpen(p => !p)} className="md:hidden p-2 text-white">{menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
        </div>
        <div className="md:hidden overflow-hidden transition-all duration-300" style={{ maxHeight: menuOpen ? '460px' : '0', opacity: menuOpen ? 1 : 0 }}>
          <div style={{ background: 'rgba(0,0,0,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)' }} className="px-6 py-5 space-y-1">
            {navLinks.map(l => <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-3 text-sm font-medium" style={{ color: '#9ca3af', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {l.label} <ChevronRight className="h-4 w-4 opacity-50" /></Link>)}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => { const stored = localStorage.getItem('mopi_lang'); const next = stored === 'ar' ? 'en' : 'ar'; localStorage.setItem('mopi_lang', next); window.dispatchEvent(new Event('mopi-lang-change')); window.location.reload(); }}
                className="flex-1 text-center text-sm font-semibold px-4 py-3 rounded-full"
                style={{ background: 'rgba(244,163,0,0.15)', color: '#ED8214', border: '1px solid rgba(244,163,0,0.3)' }}>
                {isAr ? 'EN' : 'عربي'}
              </button>
              <a href={whatsappUrlPortfolio} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center text-white text-sm font-semibold px-4 py-3 rounded-full" style={{ background: '#16a34a' }}>{t('nav.whatsapp')}</a>
              <Link to="/contact" className="flex-1 text-center text-white text-sm font-semibold px-4 py-3 rounded-full" style={{ background: '#ED8214' }}>{t('nav.quote')}</Link>
            </div>
          </div>
        </div>
      </header>

      {/* ══ § 1 · HERO — BLACK ══ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20" style={{ background: '#000000' }}>
        <div className="absolute inset-0">
          <img src={heroPortfolio?.bg_image_url || IMAGES.BOOTH_8} alt="" className="w-full h-full object-cover" style={{ opacity: 0.3, animation: 'slowZoom 22s ease-in-out infinite alternate' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,1) 100%)' }} />
        </div>
        <div className="absolute left-0 inset-y-0 w-[3px]" style={{ background: 'linear-gradient(to bottom, transparent, #ED8214, transparent)', opacity: 0.6 }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)', opacity: 0.4 }} />
        <div className="absolute top-20 right-16 pointer-events-none" style={{ width: 100, height: 100, border: '1px solid #ED8214', opacity: 0.1, transform: 'rotate(45deg)' }} />

        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto py-24">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(244,163,0,0.12)', border: '1px solid rgba(244,163,0,0.3)', color: '#ED8214', animation: 'fadeDown 0.8s ease 0.2s both' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ED8214' }} />
            {heroPortfolio?.badge_text || (isAr ? '+500 مشروع تم تسليمه' : '500+ Projects Delivered')}
          </div>
          <h1 className="font-black leading-tight text-white mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', animation: 'fadeDown 0.9s ease 0.35s both', lineHeight: isAr ? '1.4' : '1.15' }}>
            {heroPortfolio?.heading
              ? <span dangerouslySetInnerHTML={{ __html: heroPortfolio.heading }} />
              : isAr
                ? <>أعمالنا تتحدث<br /><span style={{ color: '#ED8214' }}>عنا</span></>
                : <>Showcasing <span style={{ color: '#ED8214' }}>Excellence</span><br />Across Industries</>}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#d1d5db', animation: 'fadeDown 0.9s ease 0.5s both', lineHeight: isAr ? '2' : '1.7' }}>
            {isAr
              ? 'مشاريع حائزة على جوائز حوّلت البراندات وصنعت تجارب لا تُنسى في مصر ومنطقة الشرق الأوسط.'
              : 'Award-winning projects that have transformed brands and created memorable experiences across Egypt and the MENA region.'}
          </p>
        </div>
      </section>

      {/* ══ § 2 · STATS — LIGHT GRAY ══ */}
      <section style={{ background: '#F2F2F2', borderTop: '3px solid #ED8214' }}>
        <div className="max-w-5xl mx-auto px-5 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="group cursor-default">
                <div className="text-4xl md:text-5xl font-black mb-1.5 group-hover:scale-110 transition-transform">
                  <Counter target={s.num} suffix={s.suffix} />
                </div>
                <div className="text-xs font-bold tracking-widest uppercase" style={{ color: '#2B2B2B' }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ § 3 · PORTFOLIO GRID — WHITE ══ */}
      <section id="portfolio-grid" className="py-28 px-5 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-10">
            <SectionLabel text={isAr ? 'أعمالنا' : 'Our Work'} />
            <h2 className="font-black mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#000' }}>
              {isAr ? 'المشاريع المميزة' : 'Featured Projects'}
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#555', lineHeight: isAr ? '2' : '1.7' }}>
              {isAr ? 'نخبة من أفضل أعمالنا في مصر ومنطقة الشرق الأوسط' : 'A selection of our finest work across Egypt and the MENA region'}
            </p>
          </Reveal>

          {/* Filter */}
          <Reveal delay={80}>
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {categories.map(c => (
                <button key={c.key} onClick={() => setActiveFilter(c.key)}
                  className="px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105"
                  style={activeFilter === c.key
                    ? { background: '#ED8214', color: '#fff', boxShadow: '0 6px 20px rgba(244,163,0,0.35)' }
                    : { background: '#FFFFFF', color: '#555', border: '1.5px solid #e5e7eb' }}
                  onMouseEnter={e => { if (activeFilter !== c.key) { (e.currentTarget.style.borderColor = '#ED8214'); (e.currentTarget.style.color = '#ED8214'); } }}
                  onMouseLeave={e => { if (activeFilter !== c.key) { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.color = '#555'); } }}>
                  {isAr ? c.ar : c.en}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => (
              <div key={`${p.title}-${i}`}
                className="port-card group overflow-hidden rounded-2xl cursor-pointer transition-all duration-400 hover:-translate-y-2"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)', animation: `fadeUp 0.5s ease ${i * 55}ms both`, border: '1.5px solid #e5e7eb' }}
                onClick={() => setSelectedProject(p)}
                onMouseEnter={e => { (e.currentTarget.style.borderColor = '#ED8214'); (e.currentTarget.style.boxShadow = '0 16px 40px rgba(244,163,0,0.12)'); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'); }}>

                <div className="relative overflow-hidden h-52">
                  <img src={p.image} alt={isAr ? p.titleAr : p.title} className="port-img w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                  {(isAr ? p.awardAr : p.award) && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 text-white text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(244,163,0,0.9)' }}>
                        <Award className="h-3 w-3" /> {isAr ? p.awardAr : p.award}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3"><Badge text={isAr ? p.catAr : p.cat} /></div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: 'rgba(244,163,0,0.9)' }}>
                    <ExternalLink className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>

                <div className="p-5 bg-white">
                  <h3 className="font-bold text-base mb-1.5 transition-colors group-hover:text-[#ED8214]" style={{ color: '#000' }}>
                    {isAr ? p.titleAr : p.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#777', lineHeight: isAr ? '1.9' : '1.6' }}>
                    {isAr ? p.descAr : p.desc}
                  </p>
                  <div className="flex items-center justify-between text-xs" style={{ color: '#9ca3af' }}>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" style={{ color: '#ED8214' }} />{isAr ? p.locationAr : p.location}</span>
                    <span>{isAr ? p.dateAr : p.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Project Detail Modal ── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', animation: 'fadeUp 0.25s ease both' }}
          onClick={e => { e.stopPropagation(); setSelectedProject(null); }}>
          <div
            className="relative w-full max-w-2xl rounded-2xl"
            style={{ background: '#111827', border: '1.5px solid rgba(244,163,0,0.3)', maxHeight: '88vh', overflowY: 'auto', overflowX: 'hidden', animation: 'fadeUp 0.3s ease both' }}
            onClick={e => e.stopPropagation()}>

            {/* Hero image */}
            <div className="relative h-64 overflow-hidden">
              <img src={selectedProject.image} alt={isAr ? selectedProject.titleAr : selectedProject.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,24,39,1) 0%, rgba(17,24,39,0.2) 60%, transparent 100%)' }} />
              {(isAr ? selectedProject.awardAr : selectedProject.award) && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(244,163,0,0.9)' }}>
                    <Award className="h-3.5 w-3.5" />{isAr ? selectedProject.awardAr : selectedProject.award}
                  </span>
                </div>
              )}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <XCircle className="h-5 w-5 text-white" />
              </button>
              <div className="absolute bottom-4 left-4">
                <Badge text={isAr ? selectedProject.catAr : selectedProject.cat} />
              </div>
            </div>

            {/* Body */}
            <div className="p-7">
              <h2 className="text-2xl font-black text-white mb-3">{isAr ? selectedProject.titleAr : selectedProject.title}</h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#9ca3af', lineHeight: isAr ? '2' : '1.7' }}>
                {isAr ? selectedProject.descAr : selectedProject.desc}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-7 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {[
                  { icon: Users, label: isAr ? 'العميل' : 'Client', value: isAr ? selectedProject.clientAr : selectedProject.client },
                  { icon: MapPin, label: isAr ? 'الموقع' : 'Location', value: isAr ? selectedProject.locationAr : selectedProject.location },
                  { icon: Calendar, label: isAr ? 'التاريخ' : 'Date', value: isAr ? selectedProject.dateAr : selectedProject.date },
                  { icon: Eye, label: isAr ? 'الزوار' : 'Visitors', value: selectedProject.visitors },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>
                      <Icon className="h-3 w-3" style={{ color: '#ED8214' }} />{label}
                    </div>
                    <div className="text-sm font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link to="/contact"
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 inline-flex items-center justify-center gap-2 text-white font-bold text-sm py-3.5 rounded-full transition-all hover:scale-[1.02]"
                  style={{ background: '#ED8214' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#e09200')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#ED8214')}>
                  {isAr ? 'ابدأ مشروعاً مشابهاً' : 'Start a Similar Project'} <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={e => { e.stopPropagation(); setSelectedProject(null); }}
                  className="px-6 py-3.5 rounded-full text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ § 4 · FEATURED SPOTLIGHT — BLACK ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#000000' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />
        <div className="absolute top-16 right-16 pointer-events-none" style={{ width: 130, height: 130, border: '1px solid #ED8214', opacity: 0.06, transform: 'rotate(45deg)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <SectionLabel text={isAr ? 'أبرز المشاريع' : 'Spotlight'} />
            <h2 className="font-black mb-4 text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              {isAr ? <>مشروع <span style={{ color: '#ED8214' }}>مميز</span></> : <>Featured Project <span style={{ color: '#ED8214' }}>Spotlight</span></>}
            </h2>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              {isAr ? 'مرّر المؤشر فوق أي مشروع أعلاه للمعاينة هنا' : 'Hover over any project card above to preview it here'}
            </p>
          </Reveal>

          <Reveal delay={100}>
            {/* Main spotlight card — layout fixed, only content slides */}
            <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl" style={{ border: '1.5px solid rgba(255,255,255,0.08)', minHeight: 340 }}>

              {/* Left — image slides in */}
              <div className="relative overflow-hidden" style={{ minHeight: 300 }}>
                <img
                  key={`img-${spotlightIndex}`}
                  src={projects[spotlightIndex].image}
                  alt={isAr ? projects[spotlightIndex].titleAr : projects[spotlightIndex].title}
                  className="w-full h-full object-cover absolute inset-0"
                  style={{ animation: 'slideInLeft 0.45s ease both' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.35))' }} />
                <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: '#ED8214' }} />
                {/* Index dots */}
                <div className="absolute bottom-5 left-5 flex gap-1.5">
                  {projects.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSpotlightTransition(true);
                        setSpotlightIndex(i);
                        setTimeout(() => setSpotlightTransition(false), 450);
                      }}
                      style={{
                        width: i === spotlightIndex ? 20 : 7,
                        height: 7, borderRadius: 4,
                        background: i === spotlightIndex ? '#ED8214' : 'rgba(255,255,255,0.35)',
                        transition: 'all 0.3s ease', border: 'none', cursor: 'pointer', padding: 0,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Right — details slide in */}
              <div
                key={`info-${spotlightIndex}`}
                className="p-10 lg:p-12"
                style={{ background: 'rgba(255,255,255,0.03)', animation: 'slideInRight 0.45s ease both' }}>
                <Badge text={isAr ? projects[spotlightIndex].catAr : projects[spotlightIndex].cat} />
                {(isAr ? projects[spotlightIndex].awardAr : projects[spotlightIndex].award) && (
                  <div className="flex items-center gap-1.5 mt-2 mb-1">
                    <Award className="h-3.5 w-3.5" style={{ color: '#ED8214' }} />
                    <span className="text-xs font-bold" style={{ color: '#ED8214' }}>
                      {isAr ? projects[spotlightIndex].awardAr : projects[spotlightIndex].award}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-black text-white mt-3 mb-3">
                  {isAr ? projects[spotlightIndex].titleAr : projects[spotlightIndex].title}
                </h3>
                <p className="leading-relaxed mb-6 text-sm" style={{ color: '#9ca3af', lineHeight: isAr ? '2' : '1.7' }}>
                  {isAr ? projects[spotlightIndex].descAr : projects[spotlightIndex].desc}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    [isAr ? 'العميل' : 'Client', isAr ? projects[spotlightIndex].clientAr : projects[spotlightIndex].client],
                    [isAr ? 'الموقع' : 'Location', isAr ? projects[spotlightIndex].locationAr : projects[spotlightIndex].location],
                    [isAr ? 'التاريخ' : 'Date', isAr ? projects[spotlightIndex].dateAr : projects[spotlightIndex].date],
                    [isAr ? 'الزوار' : 'Visitors', projects[spotlightIndex].visitors],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>{k}</div>
                      <div className="text-sm font-semibold text-white">{v}</div>
                    </div>
                  ))}
                </div>
                {/* Buttons row */}
                <div className="flex flex-wrap gap-3">
                  <Link to="/contact"
                    className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all hover:scale-105"
                    style={{ background: '#ED8214', color: '#fff' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#e09200')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#ED8214')}>
                    {isAr ? 'ابدأ مشروعاً مشابهاً' : 'Start a Similar Project'} <ArrowRight className="h-4 w-4" />
                  </Link>
                  {/* Back to All Projects button */}
                  <button
                    onClick={() => {
                      const el = document.getElementById('portfolio-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.07)', color: '#d1d5db', border: '1.5px solid rgba(255,255,255,0.15)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ED8214'; (e.currentTarget as HTMLButtonElement).style.color = '#ED8214'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#d1d5db'; }}>
                    <ArrowRight className="h-4 w-4 rotate-180" /> {isAr ? 'جميع المشاريع' : 'Back to All Projects'}
                  </button>
                </div>
              </div>
            </div>

            {/* Mini project strip — hover to change spotlight */}
            <div className="flex gap-3 mt-5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {projects.map((p, i) => (
                <button
                  key={p.title}
                  onClick={() => {
                    if (spotlightTimerRef.current) clearTimeout(spotlightTimerRef.current);
                    setSpotlightIndex(i);
                  }}
                  onMouseEnter={() => {
                    if (spotlightTimerRef.current) clearTimeout(spotlightTimerRef.current);
                    spotlightTimerRef.current = setTimeout(() => setSpotlightIndex(i), 120);
                  }}
                  onMouseLeave={() => {
                    if (spotlightTimerRef.current) clearTimeout(spotlightTimerRef.current);
                  }}
                  className="relative shrink-0 overflow-hidden rounded-xl transition-all duration-300"
                  style={{
                    width: 110, height: 70,
                    border: i === spotlightIndex ? '2px solid #ED8214' : '2px solid rgba(255,255,255,0.08)',
                    boxShadow: i === spotlightIndex ? '0 0 14px rgba(244,163,0,0.4)' : 'none',
                    transform: i === spotlightIndex ? 'scale(1.06)' : 'scale(1)',
                    padding: 0, background: 'none', cursor: 'pointer',
                  }}>
                  <img src={p.image} alt={isAr ? p.titleAr : p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-end p-1.5"
                    style={{ background: i === spotlightIndex ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.5)' }}>
                    <span className="text-white text-[9px] font-bold leading-tight line-clamp-2 text-left">
                      {isAr ? p.titleAr : p.title}
                    </span>
                  </div>
                  {i === spotlightIndex && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2.5px]" style={{ background: '#ED8214' }} />
                  )}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ § 5 · CTA — DARK ══ */}
      <section className="relative py-24 px-5 overflow-hidden" style={{ background: '#1A1A1A' }}>
        <div className="absolute left-0 inset-y-0 w-[4px]" style={{ background: '#ED8214' }} />
        <Reveal className="relative max-w-4xl mx-auto text-center">
          <SectionLabel text={isAr ? 'مشروعك القادم' : 'Your Project Next'} />
          <h2 className="font-black text-white leading-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            {isAr
              ? <>مستعد لكتابة<br /><span style={{ color: '#ED8214' }}>قصة نجاحك؟</span></>
              : <>Ready to Create Your<br /><span style={{ color: '#ED8214' }}>Success Story?</span></>}
          </h2>
          <p className="text-lg mb-11" style={{ color: '#9ca3af', lineHeight: isAr ? '2' : '1.7' }}>
            {isAr
              ? 'انضم لقائمة مشاريعنا الناجحة ودعنا نحوّل رؤيتك إلى واقع.'
              : 'Join our portfolio of successful projects and let us bring your vision to life.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"
              className="group inline-flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-5 rounded-full transition-all hover:scale-105"
              style={{ background: '#ED8214', boxShadow: '0 12px 30px rgba(244,163,0,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e09200')}
              onMouseLeave={e => (e.currentTarget.style.background = '#ED8214')}>
              {isAr ? 'ابدأ مشروعك' : 'Start Your Project'} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href={whatsappUrlPortfolio} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-5 rounded-full transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#16a34a'); (e.currentTarget.style.borderColor = '#16a34a'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(255,255,255,0.07)'); (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'); }}>
              <MessageCircle className="h-5 w-5" /> {isAr ? 'واتساب' : 'WhatsApp Us'}
            </a>
          </div>
        </Reveal>
      </section>

      <SharedFooter />
    </div>
  );
};

export default Portfolio;
