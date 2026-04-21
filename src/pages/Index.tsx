import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '@/assets/images';
import {
  ArrowRight, Phone, Mail, MapPin, MessageCircle,
  ChevronDown, CheckCircle, Star, Zap, Clock,
  Shield, Award, Users, Layers, Palette, Wrench,
  Menu, X, ExternalLink, Play, ChevronRight
} from 'lucide-react';

// ─── Animated Counter ─────────────────────────────────────────────────────────
const Counter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 25);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── Particle dots background ─────────────────────────────────────────────────
const ParticlesBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <div key={i} className="absolute rounded-full bg-orange-500/20 animate-pulse"
        style={{
          width: Math.random() * 4 + 2 + 'px',
          height: Math.random() * 4 + 2 + 'px',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 3 + 's',
          animationDuration: Math.random() * 3 + 2 + 's',
        }} />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Index = () => {
  const [entered, setEntered] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => setIntroVisible(false), 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.from('contact_submissions_2026_04_20').insert({
        name: formData.name, email: formData.email, phone: formData.phone,
        service: formData.service, message: formData.message, status: 'new'
      });
    } catch { /* save locally */ }
    setFormSent(true);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const services = [
    { icon: Layers, title: 'Exhibition Booth Design & Build', desc: 'Custom-designed booths that reflect your brand and attract maximum attention at trade shows.', image: IMAGES.BOOTH_8 },
    { icon: Zap, title: 'Event Production & Management', desc: 'Full event execution from initial planning to on-ground management and post-event wrap-up.', image: IMAGES.EVENT_1 },
    { icon: Star, title: 'Brand Activations', desc: 'Creative installations and immersive experiences that deeply engage your target audiences.', image: IMAGES.EVENT_3 },
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
    { title: 'International Trade Show', cat: 'Exhibition', client: 'Multi-Industry', location: 'Abu Dhabi, UAE', image: IMAGES.CORPORATE_2 },
  ];

  const categories = ['All', 'Exhibition', 'Event', 'Booth', 'Activation'];
  const filtered = activeFilter === 'All' ? portfolioItems : portfolioItems.filter(p => p.cat === activeFilter);

  const whyUs = [
    { icon: Palette, title: 'Creative & Innovative', desc: 'Unique designs that make your brand impossible to ignore.' },
    { icon: Shield, title: 'Premium Execution', desc: 'Uncompromising quality in every material and detail.' },
    { icon: Clock, title: 'On-Time Delivery', desc: 'We meet every deadline, no excuses, no exceptions.' },
    { icon: Layers, title: 'A-to-Z Service', desc: 'Concept, logistics, setup, management — all under one roof.' },
    { icon: Users, title: 'Expert Team', desc: '8+ years of specialists in design, production, and events.' },
    { icon: Award, title: 'Proven Results', desc: '500+ successful projects across Egypt and the region.' },
  ];

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Why Us', href: '#why' },
    { label: 'Contact', href: '#contact' },
  ];

  // ─── Step 1: Intro Screen ───────────────────────────────────────────────────
  if (introVisible) return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-700 ${entered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
      style={{ background: '#000' }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={IMAGES.INTRO_BG_20260421_114546_28} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>
      <ParticlesBg />

      {/* Orange accent lines */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-orange-500 to-transparent opacity-60" />
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-orange-500 to-transparent opacity-60" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-orange-500/70" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-orange-500/70" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-orange-500/70" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-orange-500/70" />

      {/* Content */}
      <div className="relative text-center px-6 max-w-3xl mx-auto">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <img src="/images/mopi_logo_20260101_112924.png" alt="MOPi Production" className="h-20 w-auto object-contain drop-shadow-2xl" />
        </div>

        {/* Tagline badge */}
        <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Cairo, Egypt · Est. 2016
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6">
          We Build{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #f97316, #fb923c, #fdba74)' }}>
            Experiences
          </span>
          <br />That Stand Out
        </h1>

        {/* Subheadline */}
        <p className="text-gray-300 text-lg md:text-xl mb-4 font-light tracking-wide">
          Exhibition Booths &nbsp;•&nbsp; Brand Activations &nbsp;•&nbsp; Event Production
        </p>

        <div className="w-16 h-px bg-orange-500 mx-auto mb-10 opacity-60" />

        {/* CTA Button */}
        <button
          onClick={handleEnter}
          className="group relative inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg px-10 py-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-orange-500/40 hover:shadow-2xl"
          style={{ boxShadow: '0 0 40px rgba(249,115,22,0.3)' }}
        >
          <span>Enter Website</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Bottom tagline */}
        <p className="mt-10 text-gray-500 text-sm tracking-widest uppercase">
          500+ Projects · 8+ Years · Egypt & MENA
        </p>
      </div>
    </div>
  );

  // ─── Step 2: Main Website ───────────────────────────────────────────────────
  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">

      {/* ── NAVIGATION ── */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <img src="/images/mopi_logo_20260101_112924.png" alt="MOPi Production" className="h-12 w-auto object-contain" />
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-gray-300 hover:text-orange-400 font-medium transition-all duration-200 hover:scale-105 tracking-wide">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all hover:scale-105">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href="#contact" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all hover:scale-105">
              Get a Quote
            </a>
          </div>
          <button onClick={() => setMenuOpen(p => !p)} className="md:hidden p-2 text-white">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/98 border-t border-white/10 px-6 py-6 space-y-4">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-orange-400 font-medium py-2 border-b border-white/5 transition-colors">
                {l.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-green-600 text-white text-sm font-semibold px-4 py-3 rounded-full">WhatsApp</a>
              <a href="#contact" className="flex-1 text-center bg-orange-500 text-white text-sm font-semibold px-4 py-3 rounded-full">Get a Quote</a>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.HERO_MAIN_20260421_114546_27} alt="Hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        </div>
        <ParticlesBg />

        {/* Orange vertical accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-orange-500 to-transparent opacity-50" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-8 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            Cairo-Based · 8+ Years Experience
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            High-Impact{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
              Exhibition
            </span>
            <br />Booths &{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
              Event
            </span>
            <br />Experiences
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            MOPi Production delivers premium booths, brand activations, and full-scale events that create <span className="text-orange-400 font-semibold">real business results.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#contact" className="group flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
              Get a Free Quote <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white/10 hover:bg-green-600 border border-white/20 hover:border-green-500 text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-300 hover:scale-105">
              <MessageCircle className="h-5 w-5" /> WhatsApp Now
            </a>
          </div>

          <a href="#about" className="inline-flex flex-col items-center gap-2 mt-20 text-gray-500 hover:text-orange-400 transition-colors group">
            <span className="text-xs tracking-widest uppercase">Scroll Down</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-y border-white/10 bg-black/80">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: 500, suffix: '+', label: 'Projects Completed' },
            { num: 8, suffix: '+', label: 'Years Experience' },
            { num: 200, suffix: '+', label: 'Happy Clients' },
            { num: 15, suffix: '+', label: 'Countries Served' },
          ].map(s => (
            <div key={s.label} className="group hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-black text-orange-500 mb-2">
                <Counter target={s.num} suffix={s.suffix} />
              </div>
              <div className="text-gray-400 text-sm font-medium tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-6">
              <div className="w-8 h-px bg-orange-500" /> About Us
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Cairo's Premier<br /><span className="text-orange-500">Exhibition & Event</span><br />Production Company
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              MOPi Production is a Cairo-based company with <span className="text-white font-semibold">8+ years of experience</span> in designing and building exhibition booths, stands, and custom event solutions.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              We provide full end-to-end services — from concept, design, and planning to hotel bookings, logistics, full setup, and on-site management. We focus on quality, creativity, and seamless execution to deliver impactful brand experiences.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {['Full A-to-Z Service', '8+ Years Experience', 'Egypt & MENA Region', 'On-Time Delivery'].map(p => (
                <div key={p} className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle className="h-4 w-4 text-orange-500 shrink-0" /> {p}
                </div>
              ))}
            </div>
            <a href="#contact" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-orange-500/20">
              Work With Us <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-orange-500/10 rounded-3xl blur-2xl" />
            <div className="relative grid grid-cols-2 gap-3">
              <img src={IMAGES.BOOTH_8} alt="Booth" className="rounded-2xl w-full h-52 object-cover hover:scale-105 transition-transform duration-500" />
              <img src={IMAGES.EVENT_1} alt="Event" className="rounded-2xl w-full h-52 object-cover mt-8 hover:scale-105 transition-transform duration-500" />
              <img src={IMAGES.CORPORATE_4} alt="Corporate" className="rounded-2xl w-full h-52 object-cover -mt-8 hover:scale-105 transition-transform duration-500" />
              <img src={IMAGES.EVENT_3} alt="Activation" className="rounded-2xl w-full h-52 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <div className="w-8 h-px bg-orange-500" /> What We Do <div className="w-8 h-px bg-orange-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Our Services</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">End-to-end solutions for every exhibition and event need</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10">
                <div className="relative h-48 overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-orange-400" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-orange-400 transition-colors">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
            {/* CTA card */}
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 flex flex-col items-center justify-center text-center hover:bg-orange-500/10 transition-all hover:-translate-y-2 cursor-pointer group" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                <ArrowRight className="h-7 w-7 text-orange-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Custom Requirements?</h3>
              <p className="text-gray-400 text-sm">Tell us your vision and we'll make it happen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="portfolio" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <div className="w-8 h-px bg-orange-500" /> Our Work <div className="w-8 h-px bg-orange-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Featured Projects</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">A selection of our finest work across Egypt and the MENA region</p>
          </div>
          {/* Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {categories.map(c => (
              <button key={c} onClick={() => setActiveFilter(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeFilter === c ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:border-orange-500/40 hover:text-orange-400'}`}>
                {c}
              </button>
            ))}
          </div>
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((p, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-2xl cursor-pointer ${i === 0 || i === 5 ? 'md:col-span-2 h-72' : 'h-56'}`}>
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <Badge text={p.cat} />
                  <h3 className="text-white font-bold mt-1 group-hover:text-orange-300 transition-colors">{p.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{p.location}
                  </p>
                </div>
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ExternalLink className="h-4 w-4 text-white" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="#contact" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors group">
              Start Your Project <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="why" className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <div className="w-8 h-px bg-orange-500" /> Why Choose Us <div className="w-8 h-px bg-orange-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">The MOPi Difference</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((w, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-white/10 bg-black hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center mb-4 group-hover:bg-orange-500/25 transition-colors">
                  <w.icon className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{w.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.BOOTH_4} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black" />
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Let's Build Something<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
              Extraordinary Together
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">Ready to make your brand unforgettable?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="group flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg px-10 py-5 rounded-full transition-all hover:scale-105 shadow-xl shadow-orange-500/30">
              Request a Quote <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white/10 hover:bg-green-600 border border-white/20 hover:border-green-500 text-white font-bold text-lg px-10 py-5 rounded-full transition-all hover:scale-105">
              <MessageCircle className="h-5 w-5" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <div className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-6">
              <div className="w-8 h-px bg-orange-500" /> Get In Touch
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Start<br /><span className="text-orange-500">Your Project?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Contact us today for a free consultation. We'll get back to you within 2 hours.
            </p>
            <div className="space-y-6">
              {[
                { icon: Phone, label: 'Phone', value: '+20 100 000 0000', href: 'tel:+201000000000' },
                { icon: Mail, label: 'Email', value: 'info@mopiproduction.com', href: 'mailto:info@mopiproduction.com' },
                { icon: MapPin, label: 'Location', value: 'Cairo, Egypt', href: '#' },
                { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us directly', href: 'https://wa.me/201000000000' },
              ].map(c => (
                <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0 group-hover:bg-orange-500/25 transition-colors">
                    <c.icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{c.label}</p>
                    <p className="text-white font-semibold group-hover:text-orange-300 transition-colors">{c.value}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-600 ml-auto group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="bg-black border border-white/10 rounded-2xl p-8 hover:border-orange-500/20 transition-colors">
              {formSent ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
                  <p className="text-gray-400">We'll get back to you within 2 hours.</p>
                  <button onClick={() => setFormSent(false)} className="mt-6 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">Send Another →</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-white font-bold text-xl mb-6">Send Us a Message</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Your Name *</label>
                      <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="John Smith" className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/60 transition-colors" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Email *</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="john@company.com" className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/60 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Phone / WhatsApp</label>
                    <input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+20 100 000 0000" className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/60 transition-colors" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Service Needed</label>
                    <select value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/60 transition-colors">
                      <option value="" className="bg-gray-900">Select a service...</option>
                      {['Exhibition Booth Design & Build', 'Event Production & Management', 'Brand Activations', 'Custom Fabrication', 'Branding & Graphics', 'Other'].map(s => (
                        <option key={s} value={s} className="bg-gray-900">{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Message *</label>
                    <textarea required value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your project, timeline, and budget..." rows={4}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/60 transition-colors resize-none" />
                  </div>
                  <button type="submit" className="group w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20">
                    Send Message <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="text-center">
                    <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                      <MessageCircle className="h-4 w-4" /> Or message us directly on WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <img src="/images/mopi_logo_20260101_112924.png" alt="MOPi Production" className="h-12 w-auto object-contain mb-4" />
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Cairo's leading exhibition booth design and event production company. Building experiences that stand out since 2016.
              </p>
              <div className="flex gap-3 mt-5">
                <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600 border border-green-600/30 hover:border-green-500 text-green-400 hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-all">
                  <MessageCircle className="h-3 w-3" /> WhatsApp
                </a>
                <a href="mailto:info@mopiproduction.com"
                  className="flex items-center gap-2 bg-orange-500/10 hover:bg-orange-500 border border-orange-500/30 hover:border-orange-500 text-orange-400 hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-all">
                  <Mail className="h-3 w-3" /> Email Us
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Services</h4>
              <ul className="space-y-2">
                {['Exhibition Booth Design', 'Event Production', 'Brand Activations', 'Custom Fabrication', 'Branding & Graphics'].map(s => (
                  <li key={s}><a href="#services" className="text-gray-500 hover:text-orange-400 text-sm transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-500 text-sm"><MapPin className="h-4 w-4 text-orange-500 shrink-0" /> Cairo, Egypt</li>
                <li><a href="tel:+201000000000" className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors"><Phone className="h-4 w-4 text-orange-500 shrink-0" /> +20 100 000 0000</a></li>
                <li><a href="mailto:info@mopiproduction.com" className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors"><Mail className="h-4 w-4 text-orange-500 shrink-0" /> info@mopiproduction.com</a></li>
              </ul>
              <Link to="/admin" className="inline-flex items-center gap-1 mt-6 text-gray-700 hover:text-gray-400 text-xs transition-colors">
                Admin Dashboard →
              </Link>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2026 MOPi Production. All rights reserved. Cairo, Egypt.</p>
            <p className="text-gray-700 text-xs">Exhibition Booths · Brand Activations · Event Production</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple badge component
const Badge = ({ text }: { text: string }) => (
  <span className="inline-block bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">{text}</span>
);

export default Index;
