import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '@/assets/images';
import { useCMS, getLogoUrl, getCMSText, getCMSImage } from '@/hooks/useCMS';
import { useLocalLanguage } from '@/hooks/useLanguage';
import {
  ArrowRight, Phone, Mail, MapPin, MessageCircle,
  ChevronDown, CheckCircle, Clock,
  Layers,
  Menu, X, ChevronRight, MoveRight,
  Shield, Users, Star,
} from 'lucide-react';

/* ─── Counter ─────────────────────────────────────── */
const Counter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let v = 0;
        const step = target / 60;
        const t = setInterval(() => {
          v += step;
          if (v >= target) { setCount(target); clearInterval(t); }
          else setCount(Math.floor(v));
        }, 20);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref} style={{ color: '#ED8214' }}>{count}{suffix}</span>;
};

/* ─── Reveal ──────────────────────────────────────── */
const Reveal = ({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
      }}>
      {children}
    </div>
  );
};

/* ─── Particles ───────────────────────────────────── */
const Particles = () => {
  const items = useRef(
    Array.from({ length: 16 }, (_, i) => ({
      id: i, w: Math.random() * 2.5 + 1,
      left: Math.random() * 100, top: Math.random() * 100,
      delay: Math.random() * 4, dur: Math.random() * 4 + 4,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.current.map(p => (
        <div key={p.id} className="absolute rounded-full animate-pulse"
          style={{ width: p.w, height: p.w, left: `${p.left}%`, top: `${p.top}%`,
            background: '#ED8214', opacity: 0.14,
            animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
      ))}
    </div>
  );
};

/* ─── SectionLabel ────────────────────────────────── */
const SectionLabel = ({ text, dark = false }: { text: string; dark?: boolean }) => (
  <div className="inline-flex items-center gap-6 text-[20px] font-bold tracking-[0.3em] uppercase mb-5"
    style={{ color: '#ED8214' }}>
    <span className="w-20 h-0.5 block" style={{ background: '#ED8214' }} />
    {text}
    <span className="w-20 h-0.5 block" style={{ background: '#ED8214' }} />
  </div>
);

/* ─── LangToggle ──────────────────────────────────── */
const LangToggle = ({ lang, setLang }: { lang: string; setLang: (l: 'en' | 'ar') => void }) => (
  <div className="flex items-center gap-0.5 rounded-full overflow-hidden"
    style={{ border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}>
    {(['en', 'ar'] as const).map(l => (
      <button key={l} onClick={() => setLang(l)}
        className="px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase transition-all duration-300"
        style={{
          color: lang === l ? '#111' : 'rgba(255,255,255,0.55)',
          background: lang === l ? '#ED8214' : 'transparent',
        }}>
        {l.toUpperCase()}
      </button>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
const Index = () => {
  const cms = useCMS();
  const { lang, setLang, t, isAr, dir, fontFamily } = useLocalLanguage();

  // CMS text + image helpers
  const ct = (page: string, section: string, field: string, fallback: string) =>
    getCMSText(cms.pageContent, page, section, field, lang as 'en' | 'ar', fallback);
  const ci = (page: string, section: string, key: string, fallback: string) =>
    getCMSImage(cms.pageImages, page, section, key, fallback);

  const companyName = cms.settings.company_name || 'MOPi Production';
  const cmsPhone    = cms.settings.phone_1 || '+20 100 000 0000';
  const cmsPhone2   = cms.settings.phone_2 || '';
  const cmsEmail    = cms.settings.email || 'info@mopiproduction.com';
  const cmsAddress  = cms.settings.address || 'Cairo, Egypt';
  const logoUrl     = getLogoUrl(cms.headerLogo);
  const footerTagline = cms.settings.footer_tagline || cms.settings.footer_description || "Cairo's leading exhibition booth design and event production company.";
  const whatsappUrl = cms.settings.whatsapp_number
    ? `https://wa.me/${cms.settings.whatsapp_number.replace(/[^0-9]/g, '')}`
    : 'https://wa.me/201000000000';
  const phoneHref = `tel:${cmsPhone.replace(/\s/g, '')}`;
  const emailHref = `mailto:${cmsEmail}`;

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [hoveredWhy, setHoveredWhy] = useState<number | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.from('contact_submissions_2026_04_20').insert({ ...formData, status: 'new' });
    } catch { /* offline fallback */ }
    setFormSent(true);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const navLinks = [
    { label: t('nav.home'),      to: '/' },
    { label: t('nav.about'),     to: '/about' },
    { label: t('nav.services'),  to: '/services' },
    { label: t('nav.portfolio'), to: '/portfolio' },
    { label: t('nav.contact'),   to: '/contact' },
  ];

  const whyUs = [
    { icon: Users,  title: t('why.2.title'), desc: t('why.2.desc') },
    { icon: Clock,  title: t('why.3.title'), desc: t('why.3.desc') },
    { icon: Shield, title: t('why.4.title'), desc: t('why.4.desc') },
    { icon: Layers, title: t('why.6.title'), desc: t('why.6.desc') },
  ];

  const process = [
    { num: '01', title: t('step.1.title'), desc: t('step.1.desc') },
    { num: '02', title: t('step.2.title'), desc: t('step.2.desc') },
    { num: '03', title: t('step.3.title'), desc: t('step.3.desc') },
    { num: '04', title: t('step.4.title'), desc: t('step.4.desc') },
  ];

  const inputCls = `w-full border rounded-xl px-4 py-3.5 text-sm transition-all duration-300 focus:outline-none focus:ring-2
    bg-white text-gray-800 placeholder-gray-400 border-gray-200 focus:border-[#ED8214] focus:ring-[#ED8214]/20`;

  const clients = [
    'Samsung', 'Huawei', 'L\'Oréal', 'Nestlé', 'BMW', 'Pfizer',
    'KPMG', 'Siemens', 'Oracle', 'Unilever', 'ABB', 'Mastercard',
  ];

  return (
    <div className="overflow-x-hidden" style={{ fontFamily, direction: dir }}>

      {/* ══ KEYFRAMES ══ */}
      <style>{`
        @keyframes slowZoom   { from{transform:scale(1.04)} to{transform:scale(1.12)} }
        @keyframes fadeDown   { from{opacity:0;transform:translateY(-22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(22px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes lineGrow   { from{width:0} to{width:100%} }
        @keyframes shimmer    { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .nav-link::after {
          content:''; display:block; height:1.5px; width:0; background:#ED8214;
          transition:width 0.35s cubic-bezier(0.4,0,0.2,1); margin-top:3px;
        }
        .nav-link:hover::after { width:100%; }
        .svc-img { transition:transform 0.6s ease; }
        .svc-card:hover .svc-img { transform:scale(1.07); }
        .port-img { transition:transform 0.7s ease; }
        .port-card:hover .port-img { transform:scale(1.09); }
        .orange-shimmer {
          background: linear-gradient(90deg, #ED8214 0%, #ffaa4d 50%, #ED8214 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .process-line::before {
          content:''; position:absolute; top:50%; left:100%;
          width:100%; height:1px; background:linear-gradient(to right, rgba(244,123,32,0.4), transparent);
        }
        @media (max-width:768px) { .process-line::before { display:none; } }
      `}</style>

      {/* ══ NAVIGATION ══ */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(17,17,17,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          padding: scrolled ? '12px 0' : '22px 0',
          boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.5)' : 'none',
        }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between gap-4">
          <button onClick={() => scrollTo('hero')} className="shrink-0">
            <img src={logoUrl} alt={companyName}
              className="h-14 w-auto object-contain transition-opacity duration-300 hover:opacity-75" />
          </button>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(l => (
              <Link key={l.label} to={l.to}
                className="nav-link text-[13px] font-semibold tracking-wide transition-colors duration-200"
                style={{ color: '#c9cdd6', fontFamily }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#c9cdd6')}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LangToggle lang={lang} setLang={setLang} />
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-[13px] font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#16a34a' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
              onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}>
              <MessageCircle className="h-4 w-4" /> {t('nav.whatsapp')}
            </a>
<Link to="/contact"
              className="flex items-center gap-2 text-white text-[13px] font-bold px-5 py-2 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#ED8214', textDecoration: 'none' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#d96b18'); (e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,123,32,0.4)'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#ED8214'); (e.currentTarget.style.boxShadow = 'none'); }}>
              {t('nav.quote')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button onClick={() => setMenuOpen(p => !p)} className="md:hidden p-2 text-white"
            onMouseEnter={e => (e.currentTarget.style.color = '#ED8214')}
            onMouseLeave={e => (e.currentTarget.style.color = '#fff')}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden overflow-hidden transition-all duration-350"
          style={{ maxHeight: menuOpen ? '520px' : '0', opacity: menuOpen ? 1 : 0 }}>
          <div style={{ background: 'rgba(17,17,17,0.99)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
            className="px-6 py-5 space-y-1">
            {navLinks.map(l => (
              <Link key={l.label} to={l.to} onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-3.5 text-sm font-semibold transition-colors"
                style={{ color: '#9ca3af', borderBottom: '1px solid rgba(255,255,255,0.04)', fontFamily }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ED8214')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
                {l.label}
                <ChevronRight className={`h-4 w-4 opacity-40 ${isAr ? 'rotate-180' : ''}`} />
              </Link>
            ))}
            <div className="flex items-center justify-between py-3">
              <span className="text-xs text-gray-500 uppercase tracking-widest">Language</span>
              <LangToggle lang={lang} setLang={setLang} />
            </div>
            <div className="flex gap-3 pt-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center text-white text-sm font-bold px-4 py-3 rounded-full"
                style={{ background: '#16a34a' }}>{t('nav.whatsapp')}</a>
<Link to="/contact"
                className="flex-1 text-center text-white text-sm font-bold px-4 py-3 rounded-full"
                style={{ background: '#ED8214', textDecoration: 'none' }}>{t('nav.quote')}</Link>
            </div>
          </div>
        </div>
      </header>

      {/* ══ § 1 · HERO ══ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: '#111111' }}>

        <div className="absolute inset-0">
          <img
            src={
              cms.heroes['home']?.bg_image_url ||
              getCMSImage(cms.pageImages, 'home', 'hero', 'background', IMAGES.HERO_MAIN_20260421_114546_27)
            }
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.28, animation: 'slowZoom 24s ease-in-out infinite alternate' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(17,17,17,0.8) 0%, rgba(17,17,17,0.4) 45%, rgba(17,17,17,1) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(17,17,17,0.6), transparent, rgba(17,17,17,0.6))' }} />
        </div>

        {/* Subtle orange ambient */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ width: '60%', height: '40%', background: 'radial-gradient(ellipse at center bottom, rgba(244,123,32,0.08) 0%, transparent 70%)' }} />

        <Particles />

        {/* Side accent lines */}
        <div className="absolute left-0 inset-y-0 w-[2px]"
          style={{ background: 'linear-gradient(to bottom, transparent 20%, #ED8214 50%, transparent 80%)', opacity: 0.5 }} />
        <div className="absolute right-0 inset-y-0 w-[1px]"
          style={{ background: 'linear-gradient(to bottom, transparent 20%, rgba(244,123,32,0.3) 50%, transparent 80%)' }} />

        {/* Geo diamonds */}
        <div className="absolute top-28 right-20 pointer-events-none"
          style={{ width: 80, height: 80, border: '1px solid #ED8214', opacity: 0.1, transform: 'rotate(45deg)' }} />
        <div className="absolute bottom-36 left-16 pointer-events-none"
          style={{ width: 50, height: 50, border: '1px solid #ED8214', opacity: 0.08, transform: 'rotate(45deg)' }} />

        <div className="relative z-10 text-center px-5 max-w-5xl mx-auto pt-28 pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.28em] uppercase px-5 py-2 rounded-full mb-10"
            style={{ background: 'rgba(244,123,32,0.1)', border: '1px solid rgba(244,123,32,0.25)', color: '#ED8214',
              animation: 'fadeDown 0.8s ease 0.2s both' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ED8214' }} />
            {t('hero.badge')}
          </div>

          {/* Main headline */}
          <h1 className="font-black leading-none tracking-tighter mb-8"
            style={{
              fontSize: isAr ? 'clamp(2.8rem,7vw,5.2rem)' : 'clamp(3.2rem,8.5vw,6.5rem)',
              animation: 'fadeDown 0.9s ease 0.35s both',
              fontFamily: isAr ? "'Cairo', sans-serif" : "'Montserrat', sans-serif",
              lineHeight: isAr ? 1.15 : 0.88,
              color: '#FFFFFF',
            }}>
            {isAr ? (
              <>
                <span className="block orange-shimmer">{t('hero.line1')}</span>
                <span className="block text-white">{t('hero.line2')}</span>
              </>
            ) : (
              <>
                <span className="block text-white">{t('hero.line1')}</span>
                <span className="block orange-shimmer">{t('hero.line2')}</span>
              </>
            )}
          </h1>

          {/* Divider line */}
          <div className="w-24 h-[2px] mx-auto mb-7" style={{ background: '#ED8214', animation: 'fadeDown 0.8s ease 0.5s both' }} />

          {/* Subtext */}
          <p className="text-base md:text-lg mb-14 max-w-2xl mx-auto"
            style={{
              color: '#9ca3af',
              animation: 'fadeDown 0.9s ease 0.55s both',
              fontFamily,
              lineHeight: isAr ? 2 : 1.7,
              letterSpacing: isAr ? '0.02em' : '0.06em',
            }}>
            {t('hero.sub')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            style={{ animation: 'fadeDown 0.9s ease 0.7s both' }}>
<Link to="/contact"
              className="group flex items-center gap-3 text-white font-bold text-base px-10 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#ED8214', boxShadow: '0 10px 30px rgba(244,123,32,0.3)', paddingTop: '1.1rem', paddingBottom: '1.1rem', fontFamily, textDecoration: 'none' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#d96b18'); (e.currentTarget.style.boxShadow = '0 14px 40px rgba(244,123,32,0.5)'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#ED8214'); (e.currentTarget.style.boxShadow = '0 10px 30px rgba(244,123,32,0.3)'); }}>
              {t('hero.cta1')}
              {isAr ? <ArrowRight className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-x-1.5" /> : <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />}
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-3 text-white font-bold text-base px-10 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.18)', paddingTop: '1.1rem', paddingBottom: '1.1rem', fontFamily }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#16a34a'); (e.currentTarget.style.borderColor = '#16a34a'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(255,255,255,0.06)'); (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'); }}>
              <MessageCircle className="h-5 w-5" /> {t('hero.cta2')}
            </a>
          </div>

          {/* Scroll cue */}
          <button onClick={() => scrollTo('stats')}
            className="inline-flex flex-col items-center gap-2 transition-colors duration-300"
            style={{ color: '#6b7280', animation: 'fadeDown 1s ease 0.85s both' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ED8214')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
            <span className="text-[9px] tracking-[0.3em] uppercase font-bold">{t('hero.scroll')}</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </button>
        </div>
      </section>

      {/* ══ § 2 · STATS ══ */}
      <section id="stats" style={{ background: '#F2F2F2', borderTop: '3px solid #ED8214' }}>
        <div className="max-w-5xl mx-auto px-5 py-18 grid grid-cols-2 md:grid-cols-4 gap-10 text-center"
          style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
          {[
            { num: 500, suffix: '+', label: t('stats.projects') },
            { num: 8,   suffix: '+', label: t('stats.years') },
            { num: 200, suffix: '+', label: t('stats.clients') },
            { num: 15,  suffix: '+', label: t('stats.countries') },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="group cursor-default">
                <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300"
                  style={{ fontFamily: isAr ? "'Cairo', sans-serif" : "'Montserrat', sans-serif" }}>
                  <Counter target={s.num} suffix={s.suffix} />
                </div>
                <div className="text-[11px] font-bold tracking-widest uppercase"
                  style={{ color: '#2B2B2B', fontFamily }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ § 3 · ABOUT ══ */}
      <section id="about" className="py-28 px-5 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <div className="absolute top-12 right-12 pointer-events-none"
          style={{ width: 200, height: 200, border: '1px solid #ED8214', opacity: 0.055, transform: 'rotate(45deg)' }} />
        <div className="absolute bottom-16 left-8 pointer-events-none"
          style={{ width: 100, height: 100, border: '1px solid #ED8214', opacity: 0.055, transform: 'rotate(45deg)' }} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <Reveal>
            <SectionLabel text={ct('home','about','label','Who We Are')} />
            <h2 className="font-black leading-tight mb-7"
              style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#111111', fontFamily }}>
              {ct('home','about','heading1','Where Vision')}<br />
              <span style={{ color: '#ED8214' }}>{ct('home','about','heading2','Meets Execution')}</span><br />
              {ct('home','about','heading3','Excellence')}
            </h2>
            <p className="text-lg leading-relaxed mb-5" style={{ color: '#2B2B2B', fontFamily, lineHeight: isAr ? 2.1 : 1.75 }}>
              {ct('home','about','paragraph1',"MOPI Production is Egypt's leading exhibition and event production company. Since 2016, we have been transforming spaces into extraordinary brand experiences across Egypt and the MENA region.")}
            </p>
            <p className="leading-relaxed mb-10" style={{ color: '#555555', fontFamily, lineHeight: isAr ? 2 : 1.7 }}>
              {ct('home','about','paragraph2','From concept to completion, our team of designers, engineers, and project managers deliver world-class results that exceed expectations every time.')}
            </p>

            <div className="grid grid-cols-2 gap-3.5 mb-10">
              {[
                ct('home','about','point1','400+ Projects Delivered'),
                ct('home','about','point2','10+ Years of Excellence'),
                ct('home','about','point3','Egypt & MENA Coverage'),
                ct('home','about','point4','International Standards'),
              ].map(p => (
                <div key={p} className="flex items-center gap-2.5 text-sm group cursor-default" style={{ color: '#111111', fontFamily }}>
                  <CheckCircle className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform" style={{ color: '#ED8214' }} />
                  {p}
                </div>
              ))}
            </div>

<Link to="/contact"
              className="group inline-flex items-center gap-2.5 text-white font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#ED8214', boxShadow: '0 8px 24px rgba(244,123,32,0.25)', fontFamily, textDecoration: 'none' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#d96b18'); (e.currentTarget.style.boxShadow = '0 12px 32px rgba(244,123,32,0.4)'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#ED8214'); (e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,123,32,0.25)'); }}>
              {ct('home','about','cta','Work With Us')}
              {isAr ? <MoveRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" /> : <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </Link>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(244,123,32,0.06) 0%, transparent 70%)' }} />
              <div className="relative grid grid-cols-2 gap-3">
                {[
                  { src: ci('home','about','image1', IMAGES.BOOTH_8), cls: '' },
                  { src: ci('home','about','image2', IMAGES.EVENT_1), cls: 'mt-8' },
                  { src: ci('home','about','image3', IMAGES.CORPORATE_4), cls: '-mt-8' },
                  { src: ci('home','about','image4', IMAGES.EVENT_3), cls: '' },
                ].map((img, i) => (
                  <div key={i} className={`overflow-hidden rounded-2xl ${img.cls} group`}
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <img src={img.src} alt=""
                      className="w-full h-52 object-cover svc-img group-hover:brightness-110 brightness-95" />
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-br-2xl pointer-events-none"
                style={{ borderRight: '2.5px solid #ED8214', borderBottom: '2.5px solid #ED8214', opacity: 0.7 }} />
              <div className="absolute -top-3 -left-3 w-14 h-14 rounded-tl-2xl pointer-events-none"
                style={{ borderLeft: '2.5px solid #ED8214', borderTop: '2.5px solid #ED8214', opacity: 0.7 }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ § 4 · EXPLORE — Services & Portfolio links ══ */}
      <section className="py-16 px-5 relative overflow-hidden" style={{ background: '#111111' }}>
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Services card */}
            <Reveal>
              <Link to="/services"
                className="group block relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1"
                style={{ background: '#1A1A1A', border: '1.5px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { (e.currentTarget.style.borderColor = '#ED8214'); (e.currentTarget.style.boxShadow = '0 16px 40px rgba(237,130,20,0.14)'); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'); (e.currentTarget.style.boxShadow = 'none'); }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(237,130,20,0.12)', border: '1px solid rgba(237,130,20,0.3)' }}>
                  <Layers className="h-6 w-6" style={{ color: '#ED8214' }} />
                </div>
                <span className="text-[11px] font-black tracking-[0.25em] uppercase" style={{ color: '#ED8214' }}>
                  {isAr ? 'خدماتنا' : 'Our Services'}
                </span>
                <h3 className="font-black text-white text-xl mt-3 mb-3 group-hover:text-[#ED8214] transition-colors" style={{ fontFamily }}>
                  {isAr ? 'اكتشف كل خدماتنا' : 'Explore All Services'}
                </h3>
                <p className="text-sm" style={{ color: '#9ca3af', lineHeight: isAr ? 2 : 1.7 }}>
                  {isAr ? 'تصميم وتنفيذ أجنحة المعارض، إدارة الفعاليات، براند أكتيفيشن والمزيد.' : 'Exhibition booths, event production, brand activations, custom fabrication and more.'}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold" style={{ color: '#ED8214' }}>
                  {isAr ? 'شاهد الخدمات' : 'View Services'}
                  {isAr ? <ChevronRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </div>
              </Link>
            </Reveal>

            {/* Portfolio card */}
            <Reveal delay={80}>
              <Link to="/portfolio"
                className="group block relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1"
                style={{ background: '#1A1A1A', border: '1.5px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { (e.currentTarget.style.borderColor = '#ED8214'); (e.currentTarget.style.boxShadow = '0 16px 40px rgba(237,130,20,0.14)'); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'); (e.currentTarget.style.boxShadow = 'none'); }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(237,130,20,0.12)', border: '1px solid rgba(237,130,20,0.3)' }}>
                  <Star className="h-6 w-6" style={{ color: '#ED8214' }} />
                </div>
                <span className="text-[11px] font-black tracking-[0.25em] uppercase" style={{ color: '#ED8214' }}>
                  {isAr ? 'أعمالنا' : 'Our Work'}
                </span>
                <h3 className="font-black text-white text-xl mt-3 mb-3 group-hover:text-[#ED8214] transition-colors" style={{ fontFamily }}>
                  {isAr ? 'شاهد مشاريعنا' : 'Browse Our Portfolio'}
                </h3>
                <p className="text-sm" style={{ color: '#9ca3af', lineHeight: isAr ? 2 : 1.7 }}>
                  {isAr ? 'مجموعة من أفضل أعمالنا في مصر ومنطقة الشرق الأوسط وشمال أفريقيا.' : 'A curated selection of our finest projects across Egypt and the MENA region.'}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold" style={{ color: '#ED8214' }}>
                  {isAr ? 'شاهد الأعمال' : 'View Portfolio'}
                  {isAr ? <ChevronRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ § 5 · WHY CHOOSE US ══ */}
      <section id="why" className="py-28 px-5 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text={t('why.label')} />
            <h2 className="font-black mb-4"
              style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#111111', fontFamily }}>
              {t('why.h1')}{' '}
              <span style={{ color: '#ED8214' }}>{t('why.h2')}</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#555555', fontFamily, lineHeight: isAr ? 2 : 1.7 }}>
              {t('why.sub')}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((w, i) => (
              <Reveal key={i} delay={i * 70}>
                <div
                  className="p-7 rounded-2xl transition-all duration-400 cursor-default group"
                  style={{
                    border: hoveredWhy === i ? '1.5px solid #ED8214' : '1.5px solid #e9eaec',
                    background: hoveredWhy === i ? '#FAFAFA' : '#FFFFFF',
                    boxShadow: hoveredWhy === i ? '0 16px 40px rgba(244,123,32,0.1)' : '0 2px 12px rgba(0,0,0,0.05)',
                    transform: hoveredWhy === i ? 'translateY(-4px)' : 'translateY(0)',
                  }}
                  onMouseEnter={() => setHoveredWhy(i)}
                  onMouseLeave={() => setHoveredWhy(null)}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: hoveredWhy === i ? '#ED8214' : 'rgba(244,123,32,0.1)',
                      border: `1.5px solid ${hoveredWhy === i ? '#ED8214' : 'rgba(244,123,32,0.25)'}`,
                    }}>
                    <w.icon className="h-5 w-5 transition-colors duration-300"
                      style={{ color: hoveredWhy === i ? '#fff' : '#ED8214' }} />
                  </div>
                  <h3 className="font-bold text-[1rem] mb-2.5 transition-colors duration-300"
                    style={{ color: hoveredWhy === i ? '#ED8214' : '#111111', fontFamily, lineHeight: isAr ? 1.7 : 1.3 }}>
                    {w.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#555555', fontFamily, lineHeight: isAr ? 1.9 : 1.65 }}>
                    {w.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 7 · CLIENTS ══ */}
      <section id="clients" className="py-20 px-5 relative overflow-hidden" style={{ background: '#111111' }}>
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <SectionLabel text={t('clients.label')} />
            <h2 className="font-black mb-3 text-white"
              style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontFamily }}>
              {t('clients.h1')}
            </h2>
            <p className="text-base" style={{ color: '#6b7280', fontFamily }}>{t('clients.sub')}</p>
          </Reveal>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {clients.map((c, i) => (
              <Reveal key={c} delay={i * 40}>
                <div className="group flex items-center justify-center rounded-xl py-5 px-4 transition-all duration-300 cursor-default"
                  style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(244,123,32,0.3)'); (e.currentTarget.style.background = 'rgba(244,123,32,0.04)'); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'); (e.currentTarget.style.background = 'rgba(255,255,255,0.02)'); }}>
                  <span className="text-sm font-bold tracking-wide transition-colors duration-300"
                    style={{ color: '#6b7280', fontFamily }}>
                    {c}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 8 · PROCESS ══ */}
      <section id="process" className="py-28 px-5 relative overflow-hidden" style={{ background: '#F2F2F2' }}>
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text={t('process.label')} />
            <h2 className="font-black mb-4"
              style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#111111', fontFamily }}>
              {t('process.h1')}
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#555555', fontFamily, lineHeight: isAr ? 2 : 1.7 }}>
              {t('process.sub')}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="relative p-7 rounded-2xl transition-all duration-400 group cursor-default"
                  style={{ background: '#FFFFFF', border: '1.5px solid #e9eaec', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#ED8214'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(244,123,32,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9eaec'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div className="text-5xl font-black mb-4 leading-none opacity-12"
                    style={{ color: '#ED8214', fontFamily: "'Montserrat', sans-serif", opacity: 0.12 }}>
                    {step.num}
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(244,123,32,0.1)', border: '1.5px solid rgba(244,123,32,0.25)' }}>
                    <span className="font-black text-sm" style={{ color: '#ED8214', fontFamily: "'Montserrat', sans-serif" }}>{step.num}</span>
                  </div>
                  <h3 className="font-bold text-[1rem] mb-2.5 transition-colors duration-300 group-hover:text-[#ED8214]"
                    style={{ color: '#111111', fontFamily, lineHeight: isAr ? 1.7 : 1.3 }}>
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#555555', fontFamily, lineHeight: isAr ? 1.9 : 1.65 }}>
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 9 · CTA BAND ══ */}
      <section className="relative py-28 px-5 overflow-hidden" style={{ background: '#1E1E1E' }}>
        <div className="absolute inset-0">
          <img src={IMAGES.BOOTH_4} alt="" className="w-full h-full object-cover"
            style={{ opacity: 0.08, filter: 'grayscale(0.6)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(30,30,30,0.97), rgba(30,30,30,0.88), rgba(30,30,30,0.97))' }} />
        </div>
        <div className="absolute left-0 inset-y-0 w-[3px]" style={{ background: '#ED8214' }} />
        <div className="absolute right-0 inset-y-0 w-[1px]" style={{ background: 'rgba(244,123,32,0.2)' }} />
        <div className="absolute top-1/2 right-24 -translate-y-1/2 pointer-events-none"
          style={{ width: 160, height: 160, border: '1px solid #ED8214', opacity: 0.07, transform: 'translateY(-50%) rotate(45deg)' }} />

        <Reveal className="relative max-w-4xl mx-auto text-center">
          <SectionLabel text={isAr ? 'لنبدأ معاً' : "Let's Work Together"} />
          <h2 className="font-black text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', fontFamily }}>
            {t('cta.h1')}{' '}
            <span style={{ color: '#ED8214' }}>{t('cta.h2')}</span>
          </h2>
          <p className="text-lg mb-12" style={{ color: '#9ca3af', fontFamily, lineHeight: isAr ? 2 : 1.7 }}>
            {t('cta.sub')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
<Link to="/contact"
              className="group flex items-center justify-center gap-3 text-white font-bold text-lg px-11 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#ED8214', boxShadow: '0 12px 32px rgba(244,123,32,0.3)', paddingTop: '1.15rem', paddingBottom: '1.15rem', fontFamily, textDecoration: 'none' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#d96b18'); (e.currentTarget.style.boxShadow = '0 16px 44px rgba(244,123,32,0.5)'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#ED8214'); (e.currentTarget.style.boxShadow = '0 12px 32px rgba(244,123,32,0.3)'); }}>
              {t('cta.btn1')}
              {isAr ? <ArrowRight className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-x-1.5" /> : <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />}
            </Link>
            <Link to="/portfolio"
              className="group flex items-center justify-center gap-3 text-white font-bold text-lg px-11 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.15)', paddingTop: '1.15rem', paddingBottom: '1.15rem', fontFamily, textDecoration: 'none' }}
              onMouseEnter={e => { (e.currentTarget.style.borderColor = '#ED8214'); (e.currentTarget.style.color = '#ED8214'); }}
              onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'); (e.currentTarget.style.color = '#fff'); }}>
              {t('cta.btn2')}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ══ § 10 · CONTACT ══ */}
      <section id="contact" className="py-16 sm:py-28 px-4 sm:px-5 relative overflow-hidden" style={{ background: '#F2F2F2' }}>
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />
        <div className="absolute top-12 right-12 pointer-events-none"
          style={{ width: 150, height: 150, border: '1px solid #ED8214', opacity: 0.055, transform: 'rotate(45deg)' }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

          {/* Info */}
          <Reveal>
            <SectionLabel text={t('contact.label')} />
            <h2 className="font-black leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#111111', fontFamily }}>
              {t('contact.h1')}<br />
              <span style={{ color: '#ED8214' }}>{t('contact.h2')}</span>
            </h2>
            <p className="text-lg mb-10 leading-relaxed" style={{ color: '#555555', fontFamily, lineHeight: isAr ? 2 : 1.7 }}>
              {t('contact.sub')}
            </p>

            <div className="space-y-4">
              {[
                { icon: Phone, label: isAr ? 'الهاتف' : 'Phone', value: cmsPhone2 ? `${cmsPhone} / ${cmsPhone2}` : cmsPhone, href: phoneHref },
                { icon: Mail, label: isAr ? 'البريد الإلكتروني' : 'Email', value: cmsEmail, href: emailHref },
                { icon: MapPin, label: isAr ? 'الموقع' : 'Location', value: cmsAddress, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cmsAddress)}` },
                { icon: MessageCircle, label: 'WhatsApp', value: isAr ? 'تواصل معنا مباشرةً' : 'Chat directly with us', href: whatsappUrl },
              ].map(c => (
                <a key={c.label} href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300"
                  style={{ background: '#FFFFFF', border: '1.5px solid #e9eaec', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = '#ED8214'); (e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,123,32,0.1)'); (e.currentTarget.style.transform = isAr ? 'translateX(-4px)' : 'translateX(4px)'); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e9eaec'); (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'); (e.currentTarget.style.transform = 'translateX(0)'); }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(244,123,32,0.1)', border: '1.5px solid rgba(244,123,32,0.2)' }}>
                    <c.icon className="h-5 w-5" style={{ color: '#ED8214' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af', fontFamily }}>{c.label}</p>
                    <p className="text-sm font-semibold truncate" style={{ color: '#111111', fontFamily }}>{c.value}</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180' : ''}`} style={{ color: '#ED8214' }} />
                </a>
              ))}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={150}>
            <div className="rounded-2xl p-5 sm:p-8"
              style={{ background: '#FFFFFF', border: '1.5px solid #e9eaec', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
              {formSent ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.3)' }}>
                    <CheckCircle className="h-10 w-10" style={{ color: '#16a34a' }} />
                  </div>
                  <h3 className="font-bold text-xl mb-2" style={{ color: '#111111', fontFamily }}>
                    {isAr ? '!تم الإرسال' : 'Message Sent!'}
                  </h3>
                  <p className="text-sm" style={{ color: '#555555', fontFamily }}>{t('contact.sent')}</p>
                  <button onClick={() => setFormSent(false)}
                    className="mt-6 text-sm font-semibold transition-colors"
                    style={{ color: '#ED8214', fontFamily }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#d96b18')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#ED8214')}>
                    {t('contact.another')} →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-bold text-xl mb-7" style={{ color: '#111111', fontFamily }}>
                    {isAr ? 'أرسل لنا رسالة' : 'Send Us a Message'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#9ca3af', fontFamily }}>{t('contact.name')} *</label>
                      <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder={isAr ? 'اسمك الكريم' : 'John Smith'} className={inputCls} style={{ fontFamily }} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#9ca3af', fontFamily }}>{t('contact.email')} *</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="email@company.com" className={inputCls} dir="ltr" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#9ca3af', fontFamily }}>{t('contact.phone')}</label>
                    <input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+20 100 000 0000" className={inputCls} dir="ltr" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#9ca3af', fontFamily }}>{t('contact.service')}</label>
                    <select value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}
                      className={inputCls} style={{ color: formData.service ? '#1f2937' : '#9ca3af', fontFamily }}>
                      <option value="">{t('contact.select')}</option>
                      <option value="Exhibition Booth">{t('contact.opt1')}</option>
                      <option value="Event Production">{t('contact.opt2')}</option>
                      <option value="Brand Activation">{t('contact.opt3')}</option>
                      <option value="Custom Fabrication">{t('contact.opt4')}</option>
                      <option value="Other">{t('contact.opt5')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#9ca3af', fontFamily }}>{t('contact.message')} *</label>
                    <textarea required value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      placeholder={isAr ? 'أخبرنا عن مشروعك والموعد المطلوب...' : 'Tell us about your project, timeline, and budget…'}
                      rows={4} className={`${inputCls} resize-none`} style={{ fontFamily }} />
                  </div>

                  <button type="submit"
                    className="group w-full flex items-center justify-center gap-3 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: '#ED8214', boxShadow: '0 8px 24px rgba(244,123,32,0.25)', fontFamily }}
                    onMouseEnter={e => { (e.currentTarget.style.background = '#d96b18'); (e.currentTarget.style.boxShadow = '0 12px 32px rgba(244,123,32,0.4)'); }}
                    onMouseLeave={e => { (e.currentTarget.style.background = '#ED8214'); (e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,123,32,0.25)'); }}>
                    {t('contact.send')}
                    {isAr ? <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1.5" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />}
                  </button>

                  <div className="text-center">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                      style={{ color: '#16a34a', fontFamily }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#15803d')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#16a34a')}>
                      <MessageCircle className="h-4 w-4" />
                      {t('contact.orDirect')} WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ § 11 · FOOTER ══ */}
      <footer style={{ background: '#111111', borderTop: '2px solid #ED8214' }} className="py-14 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">

            <div className="md:col-span-2">
              <img src={logoUrl} alt={companyName}
                className="h-12 w-auto object-contain mb-4 hover:opacity-75 transition-opacity" />
              <p className="text-sm leading-relaxed max-w-xs mb-5"
                style={{ color: '#6b7280', fontFamily, lineHeight: isAr ? 2 : 1.7 }}>
                {footerTagline}
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.25)', color: '#4ade80' }}
                  onMouseEnter={e => { (e.currentTarget.style.background = '#16a34a'); (e.currentTarget.style.color = '#fff'); }}
                  onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(22,163,74,0.15)'); (e.currentTarget.style.color = '#4ade80'); }}>
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <a href={emailHref}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  style={{ background: 'rgba(244,123,32,0.1)', border: '1px solid rgba(244,123,32,0.25)', color: '#ED8214' }}
                  onMouseEnter={e => { (e.currentTarget.style.background = '#ED8214'); (e.currentTarget.style.color = '#fff'); }}
                  onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(244,123,32,0.1)'); (e.currentTarget.style.color = '#ED8214'); }}>
                  <Mail className="h-3.5 w-3.5" /> {t('footer.email')}
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-white" style={{ fontFamily }}>
                {t('footer.services')}
              </h4>
              <ul className="space-y-2.5">
                {[t('footer.svc1'), t('footer.svc2'), t('footer.svc3'), t('footer.svc4'), t('footer.svc5')].map(s => (
                  <li key={s}>
                    <Link to="/services"
                      className="text-sm flex items-center gap-1.5 transition-colors duration-200"
                      style={{ color: '#6b7280', textDecoration: 'none', fontFamily }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ED8214')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'rgba(244,123,32,0.4)' }} />{s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-white" style={{ fontFamily }}>
                {t('footer.contact')}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-sm" style={{ color: '#6b7280', fontFamily }}>
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} /> {cmsAddress}
                </li>
                <li>
                  <a href={phoneHref} className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                    style={{ color: '#6b7280', fontFamily }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                    <Phone className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} /> {cmsPhone}
                  </a>
                </li>
                {cmsPhone2 && (
                  <li>
                    <a href={`tel:${cmsPhone2.replace(/\s/g, '')}`}
                      className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                      style={{ color: '#6b7280', fontFamily }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                      <Phone className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} /> {cmsPhone2}
                    </a>
                  </li>
                )}
                <li>
                  <a href={emailHref} className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                    style={{ color: '#6b7280', fontFamily }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                    <Mail className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} /> {cmsEmail}
                  </a>
                </li>
              </ul>
              <Link to="/admin"
                className="inline-flex items-center gap-1 mt-7 text-xs transition-colors duration-200"
                style={{ color: '#374151', fontFamily }}
                onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
                onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
                {t('footer.admin')} →
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: '#374151', fontFamily }}>
              © 2026 {companyName}. {t('footer.rights')}
            </p>
            <p className="text-xs tracking-wide" style={{ color: '#1f2937', fontFamily }}>
              {isAr ? 'أجنحة المعارض · تفعيل البراندات · إنتاج الفعاليات' : 'Exhibition Booths · Brand Activations · Event Production'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
