import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '@/assets/images';
import { useCMS, getLogoUrl } from '@/hooks/useCMS';
import {
  ArrowRight, Phone, Mail, MapPin, MessageCircle,
  ChevronDown, CheckCircle, Zap, Clock,
  Award, Layers, Palette, Wrench,
  Menu, X, ExternalLink, ChevronRight, MoveRight,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   Animated counter – triggers once on first visibility
───────────────────────────────────────────────────────── */
const Counter = ({ target, suffix = '', dark = false }: { target: number; suffix?: string; dark?: boolean }) => {
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
  return (
    <span ref={ref} style={{ color: '#F4A300' }}>{count}{suffix}</span>
  );
};

/* ─────────────────────────────────────────────────────────
   Reveal-on-scroll wrapper
───────────────────────────────────────────────────────── */
const Reveal = ({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.12 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}>
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Floating particles (hero only)
───────────────────────────────────────────────────────── */
const Particles = () => {
  const items = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i, w: Math.random() * 3 + 1.5,
      left: Math.random() * 100, top: Math.random() * 100,
      delay: Math.random() * 4, dur: Math.random() * 4 + 3,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.current.map(p => (
        <div key={p.id} className="absolute rounded-full animate-pulse"
          style={{ width: p.w, height: p.w, left: `${p.left}%`, top: `${p.top}%`,
            background: '#F4A300', opacity: 0.18,
            animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Section label — adapts to light/dark bg
───────────────────────────────────────────────────────── */
const SectionLabel = ({ text, light = false }: { text: string; light?: boolean }) => (
  <div className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.22em] uppercase mb-5"
    style={{ color: '#F4A300' }}>
    <span className="w-8 h-px block" style={{ background: '#F4A300' }} />
    {text}
    <span className="w-8 h-px block" style={{ background: '#F4A300' }} />
  </div>
);

/* ─────────────────────────────────────────────────────────
   Portfolio badge
───────────────────────────────────────────────────────── */
const Badge = ({ text }: { text: string }) => (
  <span className="inline-block text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded tracking-wide uppercase"
    style={{ background: '#F4A300' }}>{text}</span>
);

/* ─────────────────────────────────────────────────────────
   Geometric accent — "M" inspired diagonal shape
───────────────────────────────────────────────────────── */
const GeoDiamond = ({ cls = '' }: { cls?: string }) => (
  <div className={`absolute pointer-events-none ${cls}`}
    style={{
      width: 80, height: 80,
      border: '1.5px solid #F4A300',
      opacity: 0.12, transform: 'rotate(45deg)',
    }} />
);

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
const Index = () => {
  const cms = useCMS();

// CMS-driven contact info with fallbacks
  const companyName = cms.settings.company_name || 'MOPi Production';
  const cmsPhone = cms.settings.phone_1 || '+20 100 000 0000';
  const cmsPhone2 = cms.settings.phone_2 || '';
  const cmsEmail = cms.settings.email || 'info@mopiproduction.com';
  const cmsAddress = cms.settings.address || 'Cairo, Egypt';
  const logoUrl = getLogoUrl(cms.headerLogo);
  const whatsappUrl = cms.settings.whatsapp
    ? `https://wa.me/${cms.settings.whatsapp.replace(/[^0-9]/g, '')}`
    : 'https://wa.me/201000000000';
  const phoneHref = `tel:${cmsPhone.replace(/\s/g, '')}`;
  const emailHref = `mailto:${cmsEmail}`;

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.from('contact_submissions_2026_04_20').insert({ ...formData, status: 'new' });
    } catch { /* offline fallback */ }
    setFormSent(true);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

const navLinks: { label: string; to: string }[] = [
    { label: 'Home',      to: '/' },
    { label: 'About',     to: '/about' },
    { label: 'Services',  to: '/services' },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'Contact',   to: '/contact' },
  ];

  const services = [
    { icon: Layers, title: 'Exhibition Booth Design & Build', desc: 'Custom-designed booths that reflect your brand and command attention at any trade show.', image: IMAGES.BOOTH_8 },
    { icon: Zap, title: 'Event Production & Management', desc: 'Full event execution — from initial planning to on-ground management and post-event wrap.', image: IMAGES.EVENT_1 },
    { icon: Award, title: 'Brand Activations', desc: 'Creative installations and immersive experiences that deeply engage your audiences.', image: IMAGES.EVENT_3 },
    { icon: Wrench, title: 'Custom Fabrication', desc: 'Stands, partitions, kiosks, and branded structures built to your exact specifications.', image: IMAGES.BOOTH_3 },
    { icon: Palette, title: 'Branding & Graphics', desc: 'Banners, signage, lightboxes, and full visual branding that elevates your presence.', image: IMAGES.BOOTH_6 },
  ];

  const portfolioItems = [
    { title: 'Tech Innovation Expo 2026', cat: 'Exhibition', client: 'TechCorp International', location: 'Dubai, UAE', image: IMAGES.BOOTH_8 },
    { title: 'Global Healthcare Summit', cat: 'Event', client: 'MedTech Solutions', location: 'Cairo, Egypt', image: IMAGES.EVENT_1 },
    { title: 'Automotive Excellence Booth', cat: 'Booth', client: 'AutoMax Industries', location: 'Riyadh, KSA', image: IMAGES.BOOTH_4 },
    { title: 'Luxury Brand Activation', cat: 'Activation', client: 'Premium Brands Group', location: 'Cairo, Egypt', image: IMAGES.EVENT_3 },
    { title: 'Corporate Annual Conference', cat: 'Event', client: 'Global Finance Corp', location: 'Alexandria, Egypt', image: IMAGES.CORPORATE_4 },
    { title: 'Product Launch Experience', cat: 'Activation', client: 'Consumer Goods Co.', location: 'Dubai, UAE', image: IMAGES.EVENT_2 },
    { title: 'Retail Pop-Up Installation', cat: 'Booth', client: 'Fashion House', location: 'Cairo, Egypt', image: IMAGES.BOOTH_2 },
    { title: 'International Trade Show', cat: 'Exhibition', client: 'Multi-Industry Group', location: 'Abu Dhabi, UAE', image: IMAGES.CORPORATE_2 },
  ];

  const categories = ['All', 'Exhibition', 'Event', 'Booth', 'Activation'];
  const filtered = activeFilter === 'All' ? portfolioItems : portfolioItems.filter(p => p.cat === activeFilter);

  /* ── shared input style for light bg form ── */
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm transition-all duration-300 focus:outline-none focus:ring-2
    bg-white text-gray-800 placeholder-gray-400 border-gray-200 focus:border-[#F4A300] focus:ring-[#F4A300]/20`;

  return (
    <div className="overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ══════════════════ GLOBAL KEYFRAMES ══════════════════ */}
      <style>{`
        @keyframes slowZoom { from{transform:scale(1.05)} to{transform:scale(1.13)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes orangePulse { 0%,100%{opacity:0.15} 50%{opacity:0.35} }
        .nav-link::after {
          content:''; display:block; height:2px; width:0; background:#F4A300;
          transition:width 0.3s ease; margin-top:2px;
        }
        .nav-link:hover::after { width:100%; }
        .service-card:hover .service-img { transform:scale(1.08); }
        .service-img { transition:transform 0.6s ease; }
        .portfolio-card:hover .port-img { transform:scale(1.1); }
        .port-img { transition:transform 0.7s ease; }
      `}</style>

      {/* ══════════════════ NAVIGATION ══════════════════ */}
      {/* Always dark nav — sits above Hero (black) */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(0,0,0,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
          padding: scrolled ? '10px 0' : '18px 0',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
<a href="#hero">
            <img src={logoUrl} alt={companyName}
              className="h-11 w-auto object-contain transition-opacity duration-300 hover:opacity-75" />
          </a>

<nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.label} to={l.to}
                className="nav-link text-sm font-medium tracking-wide transition-colors duration-200"
                style={{ color: '#d1d5db' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
<a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#16a34a' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
              onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}>
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href="#contact"
              className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#F4A300' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#e09200'); (e.currentTarget.style.boxShadow = '0 8px 20px rgba(244,163,0,0.4)'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#F4A300'); (e.currentTarget.style.boxShadow = 'none'); }}>
              Get a Quote <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <button onClick={() => setMenuOpen(p => !p)} className="md:hidden p-2 text-white transition-colors"
            onMouseEnter={e => (e.currentTarget.style.color = '#F4A300')}
            onMouseLeave={e => (e.currentTarget.style.color = '#fff')}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden overflow-hidden transition-all duration-300"
          style={{ maxHeight: menuOpen ? '400px' : '0', opacity: menuOpen ? 1 : 0 }}>
          <div style={{ background: 'rgba(0,0,0,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
            className="px-6 py-5 space-y-1">
{navLinks.map(l => (
              <Link key={l.label} to={l.to} onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-3 text-sm font-medium transition-colors"
                style={{ color: '#9ca3af', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F4A300')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
                {l.label}
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            ))}
            <div className="flex gap-3 pt-4">
<a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center text-white text-sm font-semibold px-4 py-3 rounded-full"
                style={{ background: '#16a34a' }}>WhatsApp</a>
              <a href="#contact"
                className="flex-1 text-center text-white text-sm font-semibold px-4 py-3 rounded-full"
                style={{ background: '#F4A300' }}>Get a Quote</a>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════ § 1 · HERO — BLACK ══════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: '#000000' }}>

        {/* BG image with slow zoom */}
        <div className="absolute inset-0">
          <img src={IMAGES.HERO_MAIN_20260421_114546_27} alt="" className="w-full h-full object-cover"
            style={{ opacity: 0.32, animation: 'slowZoom 22s ease-in-out infinite alternate' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,1) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55), transparent, rgba(0,0,0,0.55))' }} />
        </div>

        <Particles />

        {/* Orange accent lines */}
        <div className="absolute left-0 inset-y-0 w-[3px]"
          style={{ background: 'linear-gradient(to bottom, transparent, #F4A300, transparent)', opacity: 0.6 }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)', opacity: 0.4 }} />

        {/* Geo accent shapes */}
        <GeoDiamond cls="top-32 right-24 opacity-10" />
        <GeoDiamond cls="bottom-40 left-20 opacity-8" />

        <div className="relative z-10 text-center px-5 max-w-5xl mx-auto pt-28 pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase px-4 py-2 rounded-full mb-9"
            style={{ background: 'rgba(244,163,0,0.12)', border: '1px solid rgba(244,163,0,0.3)', color: '#F4A300',
              animation: 'fadeDown 0.8s ease 0.2s both' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#F4A300' }} />
            Cairo, Egypt · 8+ Years of Excellence
          </div>

          {/* Headline */}
          <h1 className="font-black leading-[0.88] tracking-tighter mb-8 text-white"
            style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', animation: 'fadeDown 0.9s ease 0.35s both', fontFamily: "'Poppins', sans-serif" }}>
            High‑Impact<br />
            <span style={{ color: '#F4A300' }}>Exhibition</span><br />
            Booths &amp; <span style={{ color: '#F4A300' }}>Events</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#d1d5db', animation: 'fadeDown 0.9s ease 0.5s both' }}>
            MOPi Production delivers premium booths, brand activations, and full-scale events that create{' '}
            <span style={{ color: '#F4A300', fontWeight: 600 }}>real business results.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            style={{ animation: 'fadeDown 0.9s ease 0.65s both' }}>
            <a href="#contact"
              className="group flex items-center gap-3 text-white font-bold text-base px-9 py-4 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#F4A300', boxShadow: '0 10px 30px rgba(244,163,0,0.3)' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#e09200'); (e.currentTarget.style.boxShadow = '0 12px 35px rgba(244,163,0,0.5)'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#F4A300'); (e.currentTarget.style.boxShadow = '0 10px 30px rgba(244,163,0,0.3)'); }}>
              Get a Free Quote <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
            </a>
<a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-3 text-white font-bold text-base px-9 py-4 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.2)' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#16a34a'); (e.currentTarget.style.borderColor = '#16a34a'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(255,255,255,0.07)'); (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'); }}>
              <MessageCircle className="h-5 w-5" /> WhatsApp Now
            </a>
          </div>

          {/* Scroll cue */}
          <a href="#stats" className="inline-flex flex-col items-center gap-2 transition-colors duration-300 group"
            style={{ color: '#6b7280', animation: 'fadeDown 1s ease 0.8s both' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F4A300')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold">Scroll to explore</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ══════════════════ § 2 · STATS — LIGHT GRAY ══════════════════ */}
      <section id="stats" style={{ background: '#F2F2F2', borderTop: '3px solid #F4A300' }}>
        <div className="max-w-5xl mx-auto px-5 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: 500, suffix: '+', label: 'Projects Completed' },
            { num: 8, suffix: '+', label: 'Years Experience' },
            { num: 200, suffix: '+', label: 'Happy Clients' },
            { num: 15, suffix: '+', label: 'Countries Served' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="group cursor-default">
                <div className="text-4xl md:text-5xl font-black mb-1.5 group-hover:scale-110 transition-transform duration-300"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <Counter target={s.num} suffix={s.suffix} />
                </div>
                <div className="text-xs font-bold tracking-widest uppercase" style={{ color: '#2B2B2B' }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════ § 3 · ABOUT — WHITE ══════════════════ */}
      <section id="about" className="py-28 px-5 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        {/* Subtle geometric accent */}
        <div className="absolute top-12 right-12 pointer-events-none"
          style={{ width: 180, height: 180, border: '1.5px solid #F4A300', opacity: 0.07, transform: 'rotate(45deg)' }} />
        <div className="absolute bottom-16 left-8 pointer-events-none"
          style={{ width: 100, height: 100, border: '1.5px solid #F4A300', opacity: 0.07, transform: 'rotate(45deg)' }} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <Reveal>
            <SectionLabel text="About Us" />
            <h2 className="font-black leading-tight mb-7" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#000000', fontFamily: "'Poppins', sans-serif" }}>
              Cairo's Premier<br />
              <span style={{ color: '#F4A300' }}>Exhibition &amp; Event</span><br />
              Production Company
            </h2>
            <p className="text-lg leading-relaxed mb-5" style={{ color: '#2B2B2B' }}>
              MOPi Production is a Cairo-based company with{' '}
              <span style={{ color: '#000000', fontWeight: 700 }}>8+ years of experience</span> designing and building
              exhibition booths, stands, and custom event solutions.
            </p>
            <p className="leading-relaxed mb-9" style={{ color: '#555555' }}>
              We provide full end-to-end services — from concept, design, and planning to hotel bookings,
              logistics, full setup, and on-site management. Quality, creativity, and seamless execution
              define everything we do.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-9">
              {['Full A-to-Z Service', '8+ Years Experience', 'Egypt & MENA Region', 'On-Time Delivery'].map(p => (
                <div key={p} className="flex items-center gap-2.5 text-sm group cursor-default" style={{ color: '#1A1A1A' }}>
                  <CheckCircle className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform" style={{ color: '#F4A300' }} />
                  {p}
                </div>
              ))}
            </div>

            <a href="#contact"
              className="group inline-flex items-center gap-2.5 text-white font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#F4A300', boxShadow: '0 8px 24px rgba(244,163,0,0.25)' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#e09200'); (e.currentTarget.style.boxShadow = '0 10px 30px rgba(244,163,0,0.4)'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#F4A300'); (e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,163,0,0.25)'); }}>
              Work With Us <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>

          {/* Image mosaic */}
          <Reveal delay={140}>
            <div className="relative">
              {/* Orange glow behind mosaic */}
              <div className="absolute -inset-4 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(244,163,0,0.08) 0%, transparent 70%)' }} />
              <div className="relative grid grid-cols-2 gap-3">
                {[
                  { src: IMAGES.BOOTH_8, cls: '' },
                  { src: IMAGES.EVENT_1, cls: 'mt-8' },
                  { src: IMAGES.CORPORATE_4, cls: '-mt-8' },
                  { src: IMAGES.EVENT_3, cls: '' },
                ].map((img, i) => (
                  <div key={i} className={`overflow-hidden rounded-2xl ${img.cls} group`}
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                    <img src={img.src} alt=""
                      className="w-full h-52 object-cover service-img group-hover:brightness-110 brightness-95" />
                  </div>
                ))}
              </div>
              {/* Orange corner accent */}
              <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-br-2xl pointer-events-none"
                style={{ borderRight: '3px solid #F4A300', borderBottom: '3px solid #F4A300', opacity: 0.6 }} />
              <div className="absolute -top-3 -left-3 w-12 h-12 rounded-tl-2xl pointer-events-none"
                style={{ borderLeft: '3px solid #F4A300', borderTop: '3px solid #F4A300', opacity: 0.6 }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════ § 4 · SERVICES — LIGHT GRAY ══════════════════ */}
      <section id="services" className="py-28 px-5 relative overflow-hidden" style={{ background: '#F2F2F2' }}>
        {/* Diagonal orange accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text="What We Do" />
            <h2 className="font-black mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#000000', fontFamily: "'Poppins', sans-serif" }}>
              Our Services
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#555555' }}>
              End-to-end solutions for every exhibition and event need
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="service-card group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-2"
                  style={{
                    background: '#FFFFFF',
                    border: hoveredService === i ? '1.5px solid #F4A300' : '1.5px solid #e5e7eb',
                    boxShadow: hoveredService === i
                      ? '0 20px 40px rgba(244,163,0,0.12), 0 4px 12px rgba(0,0,0,0.08)'
                      : '0 2px 12px rgba(0,0,0,0.07)',
                  }}
                  onMouseEnter={() => setHoveredService(i)}
                  onMouseLeave={() => setHoveredService(null)}>

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img src={s.image} alt={s.title}
                      className="w-full h-full object-cover service-img"
                      style={{ opacity: hoveredService === i ? 0.85 : 0.7 }} />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
                    <div className="absolute bottom-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300"
                      style={{
                        background: hoveredService === i ? '#F4A300' : 'rgba(244,163,0,0.2)',
                        border: '1px solid rgba(244,163,0,0.5)',
                      }}>
                      <s.icon className="h-5 w-5" style={{ color: hoveredService === i ? '#fff' : '#F4A300' }} />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="p-6 pb-7">
                    <h3 className="font-bold text-lg mb-2.5 transition-colors duration-300"
                      style={{ color: hoveredService === i ? '#F4A300' : '#000000', fontFamily: "'Poppins', sans-serif" }}>
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>{s.desc}</p>
                  </div>

                  {/* Bottom orange line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-400"
                    style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)', opacity: hoveredService === i ? 1 : 0 }} />
                </div>
              </Reveal>
            ))}

            {/* CTA tile */}
            <Reveal delay={services.length * 70}>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group w-full min-h-[320px] rounded-2xl flex flex-col items-center justify-center text-center p-8 cursor-pointer transition-all duration-400 hover:-translate-y-2"
                style={{
                  background: '#000000',
                  border: '1.5px solid #1A1A1A',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={e => { (e.currentTarget.style.border = '1.5px solid #F4A300'); (e.currentTarget.style.boxShadow = '0 20px 40px rgba(244,163,0,0.15)'); }}
                onMouseLeave={e => { (e.currentTarget.style.border = '1.5px solid #1A1A1A'); (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)'); }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(244,163,0,0.15)', border: '1.5px solid rgba(244,163,0,0.3)' }}>
                  <MoveRight className="h-7 w-7" style={{ color: '#F4A300' }} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Custom Requirements?</h3>
                <p className="text-sm" style={{ color: '#9ca3af' }}>Tell us your vision and we'll make it happen.</p>
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════ § 5 · PORTFOLIO — BLACK ══════════════════ */}
      <section id="portfolio" className="py-28 px-5 relative overflow-hidden" style={{ background: '#000000' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)' }} />

        {/* Subtle geo shapes */}
        <div className="absolute top-20 right-16 pointer-events-none"
          style={{ width: 120, height: 120, border: '1px solid #F4A300', opacity: 0.06, transform: 'rotate(45deg)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <SectionLabel text="Our Work" />
            <h2 className="font-black mb-4 text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Poppins', sans-serif" }}>
              Featured Projects
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#9ca3af' }}>
              A selection of our finest work across Egypt and the MENA region
            </p>
          </Reveal>

          {/* Filter */}
          <Reveal delay={80}>
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveFilter(c)}
                  className="px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105"
                  style={activeFilter === c
                    ? { background: '#F4A300', color: '#fff', boxShadow: '0 6px 20px rgba(244,163,0,0.35)' }
                    : { background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1.5px solid rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => { if (activeFilter !== c) { (e.currentTarget.style.borderColor = '#F4A300'); (e.currentTarget.style.color = '#F4A300'); } }}
                  onMouseLeave={e => { if (activeFilter !== c) { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'); (e.currentTarget.style.color = '#9ca3af'); } }}>
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((p, i) => (
              <div key={`${p.title}-${i}`}
                className={`portfolio-card group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500
                  ${i === 0 || i === 5 ? 'sm:col-span-2 h-72' : 'h-60'}`}
                style={{ animation: `fadeUp 0.5s ease ${i * 55}ms both`, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>

                <img src={p.image} alt={p.title} className="w-full h-full object-cover port-img" />

                {/* Gradient overlay */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />

                {/* Orange tint on hover */}
                <div className="absolute inset-0 transition-colors duration-400 group-hover:bg-[rgba(244,163,0,0.06)]" />

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-300 group-hover:translate-y-0 translate-y-1">
                  <Badge text={p.cat} />
                  <h3 className="text-white font-bold mt-1.5 text-sm transition-colors group-hover:text-[#F4A300]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>{p.title}</h3>
                  <p className="text-xs mt-1 flex items-center gap-1 transition-opacity duration-400 opacity-0 group-hover:opacity-100"
                    style={{ color: '#9ca3af' }}>
                    <MapPin className="h-3 w-3" style={{ color: '#F4A300' }} />{p.location}
                  </p>
                </div>

                {/* Top-right icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center
                    opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
                  style={{ background: 'rgba(244,163,0,0.2)', border: '1px solid rgba(244,163,0,0.4)' }}>
                  <ExternalLink className="h-4 w-4 text-white" />
                </div>

                {/* Bottom orange line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)' }} />
              </div>
            ))}
          </div>

          <Reveal delay={180}>
            <div className="text-center mt-12">
              <a href="#contact"
                className="inline-flex items-center gap-2 font-bold text-sm tracking-wide transition-colors group"
                style={{ color: '#F4A300' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e09200')}
                onMouseLeave={e => (e.currentTarget.style.color = '#F4A300')}>
                Start Your Project
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════ § 7 · CTA BAND — BLACK (DARK) ══════════════════ */}
      <section className="relative py-24 px-5 overflow-hidden" style={{ background: '#1A1A1A' }}>
        {/* BG image tint */}
        <div className="absolute inset-0">
          <img src={IMAGES.BOOTH_4} alt="" className="w-full h-full object-cover"
            style={{ opacity: 0.1, filter: 'grayscale(0.5)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(26,26,26,0.95), rgba(26,26,26,0.85), rgba(26,26,26,0.95))' }} />
        </div>

        {/* Orange side lines */}
        <div className="absolute left-0 inset-y-0 w-[4px]" style={{ background: '#F4A300' }} />
        <div className="absolute right-0 inset-y-0 w-[4px]" style={{ background: 'rgba(244,163,0,0.25)' }} />

        {/* Geo accent */}
        <div className="absolute top-1/2 right-24 -translate-y-1/2 pointer-events-none"
          style={{ width: 160, height: 160, border: '1.5px solid #F4A300', opacity: 0.08, transform: 'translateY(-50%) rotate(45deg)' }} />

        <Reveal className="relative max-w-4xl mx-auto text-center">
          <SectionLabel text="Let's Work Together" />
          <h2 className="font-black text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontFamily: "'Poppins', sans-serif" }}>
            Let's Build Something<br />
            <span style={{ color: '#F4A300' }}>Extraordinary Together</span>
          </h2>
          <p className="text-lg mb-11" style={{ color: '#9ca3af' }}>Ready to make your brand impossible to ignore?</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact"
              className="group flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-5 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#F4A300', boxShadow: '0 12px 30px rgba(244,163,0,0.3)' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#e09200'); (e.currentTarget.style.boxShadow = '0 16px 40px rgba(244,163,0,0.5)'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#F4A300'); (e.currentTarget.style.boxShadow = '0 12px 30px rgba(244,163,0,0.3)'); }}>
              Request a Quote <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
            </a>
<a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-5 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#16a34a'); (e.currentTarget.style.borderColor = '#16a34a'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(255,255,255,0.07)'); (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'); }}>
              <MessageCircle className="h-5 w-5" /> WhatsApp Us
            </a>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════ § 8 · CONTACT — LIGHT GRAY ══════════════════ */}
      <section id="contact" className="py-28 px-5 relative overflow-hidden" style={{ background: '#F2F2F2' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)' }} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">

          {/* Info column */}
          <Reveal>
            <SectionLabel text="Get In Touch" />
            <h2 className="font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#000000', fontFamily: "'Poppins', sans-serif" }}>
              Ready to Start<br />
              <span style={{ color: '#F4A300' }}>Your Project?</span>
            </h2>
            <p className="text-lg mb-10 leading-relaxed" style={{ color: '#555555' }}>
              Contact us today for a free consultation. We respond within 2 hours.
            </p>

            <div className="space-y-4">
              {[
{ icon: Phone, label: 'Phone', value: cmsPhone2 ? `${cmsPhone} / ${cmsPhone2}` : cmsPhone, href: phoneHref },
                { icon: Mail, label: 'Email', value: cmsEmail, href: emailHref },
                { icon: MapPin, label: 'Location', value: cmsAddress, href: '#' },
                { icon: MessageCircle, label: 'WhatsApp', value: 'Chat directly with us', href: whatsappUrl },
              ].map(c => (
                <a key={c.label} href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300"
                  style={{ background: '#FFFFFF', border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = '#F4A300'); (e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,163,0,0.1)'); (e.currentTarget.style.transform = 'translateX(4px)'); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'); (e.currentTarget.style.transform = 'translateX(0)'); }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300"
                    style={{ background: 'rgba(244,163,0,0.1)', border: '1.5px solid rgba(244,163,0,0.2)' }}>
                    <c.icon className="h-5 w-5" style={{ color: '#F4A300' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>{c.label}</p>
                    <p className="text-sm font-semibold truncate transition-colors duration-300" style={{ color: '#000000' }}>{c.value}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" style={{ color: '#F4A300' }} />
                </a>
              ))}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={140}>
            <div className="rounded-2xl p-8 transition-all duration-400"
              style={{ background: '#FFFFFF', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
              {formSent ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.3)' }}>
                    <CheckCircle className="h-10 w-10" style={{ color: '#16a34a' }} />
                  </div>
                  <h3 className="font-bold text-xl mb-2" style={{ color: '#000', fontFamily: "'Poppins', sans-serif" }}>Message Sent!</h3>
                  <p className="text-sm" style={{ color: '#555' }}>We'll get back to you within 2 hours.</p>
                  <button onClick={() => setFormSent(false)}
                    className="mt-6 text-sm font-semibold transition-colors"
                    style={{ color: '#F4A300' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#e09200')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#F4A300')}>
                    Send Another Message →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-bold text-xl mb-6" style={{ color: '#000', fontFamily: "'Poppins', sans-serif" }}>Send Us a Message</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#9ca3af' }}>Your Name *</label>
                      <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="John Smith" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#9ca3af' }}>Email *</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="john@company.com" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#9ca3af' }}>Phone / WhatsApp</label>
                    <input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+20 100 000 0000" className={inputCls} />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#9ca3af' }}>Service Needed</label>
                    <select value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}
                      className={inputCls} style={{ color: formData.service ? '#1f2937' : '#9ca3af' }}>
                      <option value="" style={{ color: '#9ca3af' }}>Select a service…</option>
                      {['Exhibition Booth Design & Build', 'Event Production & Management', 'Brand Activations', 'Custom Fabrication', 'Branding & Graphics', 'Other'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#9ca3af' }}>Message *</label>
                    <textarea required value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your project, timeline, and budget…" rows={4}
                      className={`${inputCls} resize-none`} />
                  </div>

                  <button type="submit"
                    className="group w-full flex items-center justify-center gap-3 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: '#F4A300', boxShadow: '0 8px 24px rgba(244,163,0,0.25)' }}
                    onMouseEnter={e => { (e.currentTarget.style.background = '#e09200'); (e.currentTarget.style.boxShadow = '0 12px 32px rgba(244,163,0,0.4)'); }}
                    onMouseLeave={e => { (e.currentTarget.style.background = '#F4A300'); (e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,163,0,0.25)'); }}>
                    Send Message <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </button>

                  <div className="text-center">
<a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                      style={{ color: '#16a34a' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#15803d')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#16a34a')}>
                      <MessageCircle className="h-4 w-4" /> Or message us directly on WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════ § 9 · FOOTER — BLACK ══════════════════ */}
      <footer style={{ background: '#000000', borderTop: '3px solid #F4A300' }} className="py-14 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">

            {/* Brand */}
            <div className="md:col-span-2">
<img src={logoUrl} alt={companyName}
                className="h-12 w-auto object-contain mb-4 hover:opacity-80 transition-opacity" />
              <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: '#6b7280' }}>
                Cairo's leading exhibition booth design and event production company.
                Building experiences that stand out since 2016.
              </p>
              <div className="flex gap-3">
<a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.25)', color: '#4ade80' }}
                  onMouseEnter={e => { (e.currentTarget.style.background = '#16a34a'); (e.currentTarget.style.color = '#fff'); }}
                  onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(22,163,74,0.15)'); (e.currentTarget.style.color = '#4ade80'); }}>
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <a href={emailHref}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  style={{ background: 'rgba(244,163,0,0.1)', border: '1px solid rgba(244,163,0,0.25)', color: '#F4A300' }}
                  onMouseEnter={e => { (e.currentTarget.style.background = '#F4A300'); (e.currentTarget.style.color = '#fff'); }}
                  onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(244,163,0,0.1)'); (e.currentTarget.style.color = '#F4A300'); }}>
                  <Mail className="h-3.5 w-3.5" /> Email Us
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-white">Services</h4>
              <ul className="space-y-2.5">
                {['Exhibition Booth Design', 'Event Production', 'Brand Activations', 'Custom Fabrication', 'Branding & Graphics'].map(s => (
                  <li key={s}>
                    <a href="#services"
                      className="text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                      style={{ color: '#6b7280' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#F4A300')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                      <span className="w-1 h-1 rounded-full transition-colors group-hover:bg-[#F4A300]" style={{ background: 'rgba(244,163,0,0.4)' }} />
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-white">Contact</h4>
              <ul className="space-y-3">
<li className="flex items-center gap-2.5 text-sm" style={{ color: '#6b7280' }}>
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: '#F4A300' }} /> {cmsAddress}
                </li>
<li>
                  <a href={phoneHref}
                    className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                    style={{ color: '#6b7280' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                    <Phone className="h-4 w-4 shrink-0" style={{ color: '#F4A300' }} /> {cmsPhone}
                  </a>
                </li>
                {cmsPhone2 && <li>
                  <a href={`tel:${cmsPhone2.replace(/\s/g, '')}`}
                    className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                    style={{ color: '#6b7280' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                    <Phone className="h-4 w-4 shrink-0" style={{ color: '#F4A300' }} /> {cmsPhone2}
                  </a>
                </li>}
                <li>
                  <a href={emailHref}
                    className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                    style={{ color: '#6b7280' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                    <Mail className="h-4 w-4 shrink-0" style={{ color: '#F4A300' }} /> {cmsEmail}
                  </a>
                </li>
              </ul>
              <Link to="/admin"
                className="inline-flex items-center gap-1 mt-7 text-xs transition-colors duration-200"
                style={{ color: '#374151' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
                onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
                Admin Dashboard →
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
<p className="text-sm" style={{ color: '#374151' }}>© 2026 {companyName}. All rights reserved. {cmsAddress}.</p>
            <p className="text-xs tracking-wide" style={{ color: '#1f2937' }}>Exhibition Booths · Brand Activations · Event Production</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
