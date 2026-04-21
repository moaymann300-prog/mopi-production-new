import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '@/assets/images';
import {
  ArrowRight, Phone, Mail, MapPin, MessageCircle,
  ChevronDown, CheckCircle, Zap, Clock,
  Shield, Award, Users, Layers, Palette, Wrench,
  Menu, X, ExternalLink, ChevronRight, MoveRight,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   Animated counter – triggers once on first visibility
───────────────────────────────────────────────────────── */
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
  return <span ref={ref}>{count}{suffix}</span>;
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
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}>
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Floating particles
───────────────────────────────────────────────────────── */
const Particles = () => {
  const items = useRef(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      w: Math.random() * 3 + 1.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      dur: Math.random() * 4 + 3,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.current.map(p => (
        <div key={p.id} className="absolute rounded-full bg-orange-500/25 animate-pulse"
          style={{ width: p.w, height: p.w, left: `${p.left}%`, top: `${p.top}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Section heading helper
───────────────────────────────────────────────────────── */
const SectionLabel = ({ text }: { text: string }) => (
  <div className="inline-flex items-center gap-3 text-orange-400 text-xs font-bold tracking-[0.22em] uppercase mb-5">
    <span className="w-8 h-px bg-orange-500 block" />
    {text}
    <span className="w-8 h-px bg-orange-500 block" />
  </div>
);

/* ─────────────────────────────────────────────────────────
   Category badge
───────────────────────────────────────────────────────── */
const Badge = ({ text }: { text: string }) => (
  <span className="inline-block bg-orange-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded tracking-wide uppercase">{text}</span>
);

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
const Index = () => {
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

  /* ── DATA ── */
  const navLinks = [
    { label: 'Home',      href: '#hero' },
    { label: 'About',     href: '#about' },
    { label: 'Services',  href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Why Us',    href: '#why' },
    { label: 'Contact',   href: '#contact' },
  ];

  const services = [
    { icon: Layers,  title: 'Exhibition Booth Design & Build',   desc: 'Custom-designed booths that reflect your brand and command attention at any trade show.', image: IMAGES.BOOTH_8 },
    { icon: Zap,     title: 'Event Production & Management',     desc: 'Full event execution — from initial planning to on-ground management and post-event wrap.', image: IMAGES.EVENT_1 },
    { icon: Award,   title: 'Brand Activations',                 desc: 'Creative installations and immersive experiences that deeply engage your audiences.', image: IMAGES.EVENT_3 },
    { icon: Wrench,  title: 'Custom Fabrication',                desc: 'Stands, partitions, kiosks, and branded structures built to your exact specifications.', image: IMAGES.BOOTH_3 },
    { icon: Palette, title: 'Branding & Graphics',               desc: 'Banners, signage, lightboxes, and full visual branding that elevates your presence.', image: IMAGES.BOOTH_6 },
  ];

  const portfolioItems = [
    { title: 'Tech Innovation Expo 2026',   cat: 'Exhibition', client: 'TechCorp International', location: 'Dubai, UAE',         image: IMAGES.BOOTH_8 },
    { title: 'Global Healthcare Summit',    cat: 'Event',      client: 'MedTech Solutions',      location: 'Cairo, Egypt',       image: IMAGES.EVENT_1 },
    { title: 'Automotive Excellence Booth', cat: 'Booth',      client: 'AutoMax Industries',     location: 'Riyadh, KSA',        image: IMAGES.BOOTH_4 },
    { title: 'Luxury Brand Activation',     cat: 'Activation', client: 'Premium Brands Group',   location: 'Cairo, Egypt',       image: IMAGES.EVENT_3 },
    { title: 'Corporate Annual Conference', cat: 'Event',      client: 'Global Finance Corp',    location: 'Alexandria, Egypt',  image: IMAGES.CORPORATE_4 },
    { title: 'Product Launch Experience',   cat: 'Activation', client: 'Consumer Goods Co.',     location: 'Dubai, UAE',         image: IMAGES.EVENT_2 },
    { title: 'Retail Pop-Up Installation',  cat: 'Booth',      client: 'Fashion House',          location: 'Cairo, Egypt',       image: IMAGES.BOOTH_2 },
    { title: 'International Trade Show',    cat: 'Exhibition', client: 'Multi-Industry Group',   location: 'Abu Dhabi, UAE',     image: IMAGES.CORPORATE_2 },
  ];

  const categories = ['All', 'Exhibition', 'Event', 'Booth', 'Activation'];
  const filtered = activeFilter === 'All' ? portfolioItems : portfolioItems.filter(p => p.cat === activeFilter);

  const whyUs = [
    { icon: Palette, title: 'Creative & Innovative',  desc: 'Unique designs that make your brand impossible to ignore on any show floor.' },
    { icon: Shield,  title: 'Premium Execution',      desc: 'Uncompromising quality in every material, finish, and structural detail.' },
    { icon: Clock,   title: 'On-Time Delivery',       desc: 'We meet every deadline — no excuses, no exceptions, no surprises.' },
    { icon: Layers,  title: 'A-to-Z Service',         desc: 'Concept, logistics, hotel, setup, management — all under one roof.' },
    { icon: Users,   title: 'Expert Team',            desc: '8+ years of dedicated specialists in design, production, and live events.' },
    { icon: Award,   title: 'Proven Track Record',    desc: '500+ successful projects delivered across Egypt and the MENA region.' },
  ];

  /* ── RENDER ── */
  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">

      {/* ══════════════════════ NAVIGATION ══════════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-xl border-b border-white/8 py-3 shadow-2xl shadow-black/50'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          <a href="#hero">
            <img src="/images/mopi_logo_20260101_112924.png" alt="MOPi Production"
              className="h-11 w-auto object-contain transition-all duration-300 hover:opacity-80" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                className="relative text-sm text-gray-400 hover:text-white font-medium transition-colors duration-200 group tracking-wide">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600/90 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href="#contact"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/40">
              Get a Quote <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(p => !p)}
            className="md:hidden p-2 text-white hover:text-orange-400 transition-colors">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-400 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-black/98 border-t border-white/10 px-6 py-5 space-y-1">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-3 border-b border-white/5 text-gray-300 hover:text-orange-400 font-medium transition-colors text-sm group">
                {l.label}
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
            ))}
            <div className="flex gap-3 pt-4">
              <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center bg-green-600 text-white text-sm font-semibold px-4 py-3 rounded-full">WhatsApp</a>
              <a href="#contact"
                className="flex-1 text-center bg-orange-500 text-white text-sm font-semibold px-4 py-3 rounded-full">Get a Quote</a>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0">
          <img src={IMAGES.HERO_MAIN_20260421_114546_27} alt="" className="w-full h-full object-cover opacity-35 scale-105"
            style={{ animation: 'slowZoom 20s ease-in-out infinite alternate' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>
        <Particles />

        {/* Left orange line */}
        <div className="absolute left-0 inset-y-0 w-[3px] bg-gradient-to-b from-transparent via-orange-500 to-transparent opacity-60" />

        {/* Content */}
        <div className="relative z-10 text-center px-5 max-w-5xl mx-auto pt-28 pb-20">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/35 text-orange-400 text-[11px] font-bold tracking-[0.22em] uppercase px-4 py-2 rounded-full mb-9"
            style={{ animation: 'fadeSlideDown 0.8s ease 0.2s both' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Cairo, Egypt · 8+ Years of Excellence
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.88] tracking-tighter mb-8"
            style={{ animation: 'fadeSlideDown 0.9s ease 0.35s both' }}>
            High‑Impact
            <br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #f97316 30%, #fb923c 70%, #fdba74)' }}>
              Exhibition
            </span>
            <br />
            Booths &amp;{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #f97316 30%, #fb923c 70%)' }}>
              Events
            </span>
          </h1>

          {/* Sub */}
          <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ animation: 'fadeSlideDown 0.9s ease 0.5s both' }}>
            MOPi Production delivers premium booths, brand activations, and full-scale events that create{' '}
            <span className="text-orange-400 font-semibold">real business results.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            style={{ animation: 'fadeSlideDown 0.9s ease 0.65s both' }}>
            <a href="#contact"
              className="group flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-base px-9 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50">
              Get a Free Quote
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
            <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white/8 hover:bg-green-600 border border-white/20 hover:border-green-500 text-white font-bold text-base px-9 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30">
              <MessageCircle className="h-5 w-5" />
              WhatsApp Now
            </a>
          </div>

          {/* Scroll cue */}
          <a href="#about"
            className="inline-flex flex-col items-center gap-2 text-gray-600 hover:text-orange-400 transition-colors duration-300 group"
            style={{ animation: 'fadeSlideDown 1s ease 0.8s both' }}>
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold">Scroll to explore</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ══════════════════════ STATS BAR ══════════════════════ */}
      <section className="py-14 border-y border-white/10 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: 500, suffix: '+', label: 'Projects Completed' },
            { num: 8,   suffix: '+', label: 'Years Experience' },
            { num: 200, suffix: '+', label: 'Happy Clients' },
            { num: 15,  suffix: '+', label: 'Countries Served' },
          ].map(s => (
            <div key={s.label} className="group cursor-default">
              <div className="text-4xl md:text-5xl font-black text-orange-500 mb-1.5 group-hover:scale-110 transition-transform duration-300">
                <Counter target={s.num} suffix={s.suffix} />
              </div>
              <div className="text-gray-500 text-xs font-semibold tracking-widest uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ ABOUT ══════════════════════ */}
      <section id="about" className="py-28 px-5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">

          {/* Text side */}
          <Reveal>
            <SectionLabel text="About Us" />
            <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.05] mb-7">
              Cairo's Premier<br />
              <span className="text-orange-500">Exhibition &amp; Event</span><br />
              Production Company
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-5">
              MOPi Production is a Cairo-based company with{' '}
              <span className="text-white font-semibold">8+ years of experience</span> designing and building
              exhibition booths, stands, and custom event solutions across Egypt and the MENA region.
            </p>
            <p className="text-gray-400 leading-relaxed mb-9">
              We provide full end-to-end services — from concept, design, and planning to hotel bookings,
              logistics, full setup, and on-site management. Quality, creativity, and seamless execution
              define everything we do.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-9">
              {['Full A-to-Z Service', '8+ Years Experience', 'Egypt & MENA Region', 'On-Time Delivery'].map(p => (
                <div key={p} className="flex items-center gap-2.5 text-gray-300 text-sm group cursor-default">
                  <CheckCircle className="h-4 w-4 text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                  {p}
                </div>
              ))}
            </div>
            <a href="#contact"
              className="group inline-flex items-center gap-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/45">
              Work With Us
              <MoveRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>

          {/* Image mosaic */}
          <Reveal delay={150}>
            <div className="relative">
              <div className="absolute -inset-6 bg-orange-500/8 rounded-3xl blur-3xl pointer-events-none" />
              <div className="relative grid grid-cols-2 gap-3">
                {[
                  { src: IMAGES.BOOTH_8,     cls: '' },
                  { src: IMAGES.EVENT_1,     cls: 'mt-8' },
                  { src: IMAGES.CORPORATE_4, cls: '-mt-8' },
                  { src: IMAGES.EVENT_3,     cls: '' },
                ].map((img, i) => (
                  <div key={i} className={`overflow-hidden rounded-2xl ${img.cls} group`}>
                    <img src={img.src} alt="" className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100" />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════ SERVICES ══════════════════════ */}
      <section id="services" className="py-28 px-5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text="What We Do" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Our Services</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">End-to-end solutions for every exhibition and event need</p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#0d0d0d] cursor-pointer
                    hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/12"
                  onMouseEnter={() => setHoveredService(i)}
                  onMouseLeave={() => setHoveredService(null)}>

                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img src={s.image} alt={s.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      style={{ opacity: hoveredService === i ? 0.75 : 0.5 }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent" />
                    {/* Icon badge */}
                    <div className="absolute bottom-4 left-4 w-11 h-11 rounded-xl bg-orange-500/20 border border-orange-500/40
                        flex items-center justify-center backdrop-blur-sm group-hover:bg-orange-500/35 transition-colors duration-300">
                      <s.icon className="h-5 w-5 text-orange-400" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="p-6 pb-7">
                    <h3 className="text-white font-bold text-lg mb-2.5 group-hover:text-orange-400 transition-colors duration-300">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>

                  {/* Bottom orange line reveal */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                  {/* Top-right arrow on hover */}
                  <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/30
                      flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="h-3.5 w-3.5 text-orange-400" />
                  </div>
                </div>
              </Reveal>
            ))}

            {/* CTA tile */}
            <Reveal delay={services.length * 80}>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group w-full h-full min-h-[280px] rounded-2xl border border-orange-500/25 bg-orange-500/4
                  flex flex-col items-center justify-center text-center p-8
                  hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-400 hover:-translate-y-2
                  hover:shadow-xl hover:shadow-orange-500/15">
                <div className="w-16 h-16 rounded-full border border-orange-500/30 bg-orange-500/15 flex items-center justify-center mb-5
                    group-hover:bg-orange-500/25 group-hover:scale-110 transition-all duration-300">
                  <MoveRight className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Custom Requirements?</h3>
                <p className="text-gray-500 text-sm">Tell us your vision and we'll make it happen.</p>
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════ PORTFOLIO ══════════════════════ */}
      <section id="portfolio" className="py-28 px-5">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <SectionLabel text="Our Work" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Featured Projects</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">A selection of our finest work across Egypt and the MENA region</p>
          </Reveal>

          {/* Filter buttons */}
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveFilter(c)}
                  className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300
                    ${activeFilter === c
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/35 scale-105'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-orange-500/40 hover:text-orange-400 hover:bg-orange-500/5'
                    }`}>
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((p, i) => (
              <div key={`${p.title}-${i}`}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer
                  ${i === 0 || i === 5 ? 'sm:col-span-2 h-72' : 'h-60'}
                  transition-all duration-500 hover:shadow-2xl hover:shadow-black/60`}
                style={{ animation: `fadeSlideUp 0.5s ease ${i * 60}ms both` }}>

                <img src={p.image} alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                {/* Base overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />

                {/* Orange tint on hover */}
                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/8 transition-colors duration-400" />

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Badge text={p.cat} />
                  <h3 className="text-white font-bold mt-1.5 text-sm group-hover:text-orange-300 transition-colors">{p.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <MapPin className="h-3 w-3 text-orange-500" />{p.location}
                  </p>
                </div>

                {/* Top-right icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/12 backdrop-blur-md
                    flex items-center justify-center opacity-0 group-hover:opacity-100
                    scale-75 group-hover:scale-100 transition-all duration-300">
                  <ExternalLink className="h-4 w-4 text-white" />
                </div>
              </div>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="text-center mt-12">
              <a href="#contact"
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-bold text-sm tracking-wide transition-colors group">
                Start Your Project
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════ WHY US ══════════════════════ */}
      <section id="why" className="py-28 px-5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text="Why Choose Us" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">The MOPi Difference</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">We don't just build booths — we build brands</p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((w, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="group p-7 rounded-2xl border border-white/8 bg-[#0d0d0d]
                  hover:border-orange-500/40 hover:bg-orange-500/4
                  transition-all duration-400 hover:-translate-y-1.5 cursor-default">

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/12 border border-orange-500/20 flex items-center justify-center shrink-0
                        group-hover:bg-orange-500/22 group-hover:border-orange-500/40 group-hover:scale-110 transition-all duration-300">
                      <w.icon className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base mb-2 group-hover:text-orange-400 transition-colors duration-300">{w.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{w.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA BAND ══════════════════════ */}
      <section className="relative py-24 px-5 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.BOOTH_4} alt="" className="w-full h-full object-cover opacity-12" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black" />
        </div>
        <div className="absolute left-0 inset-y-0 w-[3px] bg-orange-500" />
        <div className="absolute right-0 inset-y-0 w-[3px] bg-orange-500/30" />

        <Reveal className="relative max-w-4xl mx-auto text-center">
          <SectionLabel text="Let's Work Together" />
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Let's Build Something<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #f97316, #fb923c, #fed7aa)' }}>
              Extraordinary Together
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-11">Ready to make your brand impossible to ignore?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact"
              className="group flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg px-10 py-5 rounded-full
                transition-all duration-300 hover:scale-105 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50">
              Request a Quote
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
            <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 bg-white/8 hover:bg-green-600 border border-white/15 hover:border-green-500 text-white font-bold text-lg px-10 py-5 rounded-full
                transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/25">
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </a>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════ CONTACT ══════════════════════ */}
      <section id="contact" className="py-28 px-5 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">

          {/* Info column */}
          <Reveal>
            <SectionLabel text="Get In Touch" />
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Ready to Start<br />
              <span className="text-orange-500">Your Project?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Contact us today for a free consultation. We respond within 2 hours.
            </p>

            <div className="space-y-4">
              {[
                { icon: Phone,          label: 'Phone',     value: '+20 100 000 0000',       href: 'tel:+201000000000' },
                { icon: Mail,           label: 'Email',     value: 'info@mopiproduction.com', href: 'mailto:info@mopiproduction.com' },
                { icon: MapPin,         label: 'Location',  value: 'Cairo, Egypt',            href: '#' },
                { icon: MessageCircle,  label: 'WhatsApp',  value: 'Chat directly with us',   href: 'https://wa.me/201000000000' },
              ].map(c => (
                <a key={c.label} href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-xl border border-white/8
                    hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-orange-500/12 border border-orange-500/20 flex items-center justify-center shrink-0
                      group-hover:bg-orange-500/22 transition-colors duration-300">
                    <c.icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">{c.label}</p>
                    <p className="text-white text-sm font-semibold group-hover:text-orange-300 transition-colors duration-300 truncate">{c.value}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                </a>
              ))}
            </div>
          </Reveal>

          {/* Form column */}
          <Reveal delay={150}>
            <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-8 hover:border-orange-500/20 transition-colors duration-400">
              {formSent ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5 border border-green-500/30">
                    <CheckCircle className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
                  <p className="text-gray-400 text-sm">We'll get back to you within 2 hours.</p>
                  <button onClick={() => setFormSent(false)}
                    className="mt-6 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors">
                    Send Another Message →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-white font-bold text-xl mb-6">Send Us a Message</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Your Name *</label>
                      <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="John Smith"
                        className="w-full bg-white/4 border border-white/10 text-white placeholder-gray-700 rounded-xl px-4 py-3 text-sm
                          focus:outline-none focus:border-orange-500/60 focus:bg-white/6 transition-all duration-300" />
                    </div>
                    <div>
                      <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Email *</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="john@company.com"
                        className="w-full bg-white/4 border border-white/10 text-white placeholder-gray-700 rounded-xl px-4 py-3 text-sm
                          focus:outline-none focus:border-orange-500/60 focus:bg-white/6 transition-all duration-300" />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Phone / WhatsApp</label>
                    <input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+20 100 000 0000"
                      className="w-full bg-white/4 border border-white/10 text-white placeholder-gray-700 rounded-xl px-4 py-3 text-sm
                        focus:outline-none focus:border-orange-500/60 focus:bg-white/6 transition-all duration-300" />
                  </div>

                  <div>
                    <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Service Needed</label>
                    <select value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}
                      className="w-full bg-white/4 border border-white/10 text-white rounded-xl px-4 py-3 text-sm
                        focus:outline-none focus:border-orange-500/60 transition-all duration-300">
                      <option value="" className="bg-gray-900">Select a service…</option>
                      {['Exhibition Booth Design & Build', 'Event Production & Management', 'Brand Activations', 'Custom Fabrication', 'Branding & Graphics', 'Other'].map(s => (
                        <option key={s} value={s} className="bg-gray-900">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">Message *</label>
                    <textarea required value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your project, timeline, and budget…" rows={4}
                      className="w-full bg-white/4 border border-white/10 text-white placeholder-gray-700 rounded-xl px-4 py-3 text-sm
                        focus:outline-none focus:border-orange-500/60 focus:bg-white/6 transition-all duration-300 resize-none" />
                  </div>

                  <button type="submit"
                    className="group w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-xl
                      transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40">
                    Send Message
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </button>

                  <div className="text-center">
                    <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      Or message us directly on WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className="bg-black border-t border-white/8 py-14 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">

            {/* Brand */}
            <div className="md:col-span-2">
              <img src="/images/mopi_logo_20260101_112924.png" alt="MOPi Production"
                className="h-12 w-auto object-contain mb-4 hover:opacity-80 transition-opacity" />
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-5">
                Cairo's leading exhibition booth design and event production company.
                Building experiences that stand out since 2016.
              </p>
              <div className="flex gap-3">
                <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600/15 hover:bg-green-600 border border-green-600/25 hover:border-green-500
                    text-green-400 hover:text-white text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <a href="mailto:info@mopiproduction.com"
                  className="flex items-center gap-2 bg-orange-500/10 hover:bg-orange-500 border border-orange-500/25 hover:border-orange-500
                    text-orange-400 hover:text-white text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105">
                  <Mail className="h-3.5 w-3.5" /> Email Us
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-bold text-xs mb-5 uppercase tracking-widest">Services</h4>
              <ul className="space-y-2.5">
                {['Exhibition Booth Design', 'Event Production', 'Brand Activations', 'Custom Fabrication', 'Branding & Graphics'].map(s => (
                  <li key={s}>
                    <a href="#services" className="text-gray-500 hover:text-orange-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-orange-500/50 group-hover:bg-orange-400 transition-colors" />
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-xs mb-5 uppercase tracking-widest">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-gray-500 text-sm">
                  <MapPin className="h-4 w-4 text-orange-500 shrink-0" /> Cairo, Egypt
                </li>
                <li>
                  <a href="tel:+201000000000" className="flex items-center gap-2.5 text-gray-500 hover:text-white text-sm transition-colors duration-200">
                    <Phone className="h-4 w-4 text-orange-500 shrink-0" /> +20 100 000 0000
                  </a>
                </li>
                <li>
                  <a href="mailto:info@mopiproduction.com" className="flex items-center gap-2.5 text-gray-500 hover:text-white text-sm transition-colors duration-200">
                    <Mail className="h-4 w-4 text-orange-500 shrink-0" /> info@mopiproduction.com
                  </a>
                </li>
              </ul>
              <Link to="/admin"
                className="inline-flex items-center gap-1 mt-7 text-gray-700 hover:text-gray-400 text-xs transition-colors duration-200">
                Admin Dashboard →
              </Link>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2026 MOPi Production. All rights reserved. Cairo, Egypt.</p>
            <p className="text-gray-700 text-xs tracking-wide">Exhibition Booths · Brand Activations · Event Production</p>
          </div>
        </div>
      </footer>

      {/* ── Global keyframe animations ── */}
      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to   { transform: scale(1.12); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Index;
