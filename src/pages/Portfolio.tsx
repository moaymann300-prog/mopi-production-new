import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '@/assets/images';
import {
  ArrowRight, Phone, Mail, MapPin, MessageCircle,
  Menu, X, ChevronRight, ExternalLink, Award,
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
  <div className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.22em] uppercase mb-5" style={{ color: '#F4A300' }}>
    <span className="w-8 h-px block" style={{ background: '#F4A300' }} />{text}<span className="w-8 h-px block" style={{ background: '#F4A300' }} />
  </div>
);

const Badge = ({ text }: { text: string }) => (
  <span className="inline-block text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded tracking-wide uppercase" style={{ background: '#F4A300' }}>{text}</span>
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
  return <span ref={ref} style={{ color: '#F4A300' }}>{count}{suffix}</span>;
};

const SharedFooter = () => (
  <footer style={{ background: '#000000', borderTop: '3px solid #F4A300' }} className="py-14 px-5">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-10 mb-10">
        <div className="md:col-span-2">
          <img src="/images/mopi_logo_20260101_112924.png" alt="MOPi Production" className="h-12 w-auto object-contain mb-4 hover:opacity-80 transition-opacity" />
          <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: '#6b7280' }}>Cairo's leading exhibition booth design and event production company.</p>
          <div className="flex gap-3">
            <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.25)', color: '#4ade80' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#16a34a'); (e.currentTarget.style.color = '#fff'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(22,163,74,0.15)'); (e.currentTarget.style.color = '#4ade80'); }}>
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <a href="mailto:info@mopiproduction.com"
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{ background: 'rgba(244,163,0,0.1)', border: '1px solid rgba(244,163,0,0.25)', color: '#F4A300' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#F4A300'); (e.currentTarget.style.color = '#fff'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(244,163,0,0.1)'); (e.currentTarget.style.color = '#F4A300'); }}>
              <Mail className="h-3.5 w-3.5" /> Email Us
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-white">Services</h4>
          <ul className="space-y-2.5">
            {['Exhibition Booth Design', 'Event Production', 'Brand Activations', 'Custom Fabrication', 'Branding & Graphics'].map(s => (
              <li key={s}><Link to="/services" className="text-sm flex items-center gap-1.5" style={{ color: '#6b7280' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F4A300')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(244,163,0,0.4)' }} />{s}
              </Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-xs mb-5 uppercase tracking-widest text-white">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5 text-sm" style={{ color: '#6b7280' }}><MapPin className="h-4 w-4 shrink-0" style={{ color: '#F4A300' }} /> Cairo, Egypt</li>
            <li><a href="tel:+201000000000" className="flex items-center gap-2.5 text-sm transition-colors" style={{ color: '#6b7280' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
              <Phone className="h-4 w-4 shrink-0" style={{ color: '#F4A300' }} /> +20 100 000 0000</a></li>
            <li><a href="mailto:info@mopiproduction.com" className="flex items-center gap-2.5 text-sm transition-colors" style={{ color: '#6b7280' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
              <Mail className="h-4 w-4 shrink-0" style={{ color: '#F4A300' }} /> info@mopiproduction.com</a></li>
          </ul>
          <Link to="/admin" className="inline-flex items-center gap-1 mt-7 text-xs" style={{ color: '#374151' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')} onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>Admin Dashboard →</Link>
        </div>
      </div>
      <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-sm" style={{ color: '#374151' }}>© 2026 MOPi Production. All rights reserved. Cairo, Egypt.</p>
        <p className="text-xs tracking-wide" style={{ color: '#1f2937' }}>Exhibition Booths · Brand Activations · Event Production</p>
      </div>
    </div>
  </footer>
);

/* ════════════════ PORTFOLIO PAGE ════════════════ */
const Portfolio = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' }, { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' }, { label: 'Portfolio', to: '/portfolio' },
    { label: 'Contact', to: '/contact' },
  ];

  const categories = ['All', 'Exhibition', 'Event', 'Booth', 'Corporate'];

  const projects = [
    { title: 'Tech Innovation Expo 2026', cat: 'Exhibition', client: 'TechCorp International', location: 'Dubai, UAE', date: 'March 2026', visitors: '50,000+', image: IMAGES.BOOTH_8, award: 'Best Innovation Award 2026', desc: 'Cutting-edge exhibition booth featuring interactive displays, holographic presentations, and immersive brand experiences.' },
    { title: 'Global Healthcare Summit', cat: 'Event', client: 'MedTech Solutions', location: 'Cairo, Egypt', date: 'February 2026', visitors: '15,000+', image: IMAGES.EVENT_1, award: null, desc: 'Complete event production for a three-day healthcare summit including main stage, breakout rooms, and networking areas.' },
    { title: 'Automotive Excellence Booth', cat: 'Booth', client: 'AutoMax Industries', location: 'Riyadh, KSA', date: 'January 2026', visitors: '25,000+', image: IMAGES.BOOTH_4, award: 'Design Excellence Award', desc: 'Premium automotive exhibition booth showcasing luxury vehicles with sophisticated lighting and premium finishes.' },
    { title: 'Corporate Annual Conference', cat: 'Corporate', client: 'Global Finance Corp', location: 'Cairo, Egypt', date: 'December 2025', visitors: '8,000+', image: IMAGES.CORPORATE_4, award: null, desc: 'Elegant corporate event setup with multiple conference rooms, networking areas, and executive meeting spaces.' },
    { title: 'Luxury Brand Activation', cat: 'Event', client: 'Premium Brands Group', location: 'Alexandria, Egypt', date: 'November 2025', visitors: '12,000+', image: IMAGES.EVENT_3, award: 'Event of the Year 2025', desc: 'High-impact product launch event with dramatic staging, special effects, and immersive brand storytelling.' },
    { title: 'International Trade Show', cat: 'Exhibition', client: 'Trade Connect Ltd', location: 'Abu Dhabi, UAE', date: 'October 2025', visitors: '35,000+', image: IMAGES.CORPORATE_2, award: null, desc: 'Multi-brand exhibition space featuring modular booth systems and flexible display configurations.' },
    { title: 'Retail Pop-Up Installation', cat: 'Booth', client: 'Fashion House Egypt', location: 'Cairo, Egypt', date: 'September 2025', visitors: '18,000+', image: IMAGES.BOOTH_2, award: null, desc: 'Creative pop-up retail experience with immersive brand atmosphere and interactive customer touchpoints.' },
    { title: 'Financial Services Summit', cat: 'Corporate', client: 'Banking Alliance MENA', location: 'Cairo, Egypt', date: 'August 2025', visitors: '10,000+', image: IMAGES.CORPORATE_5, award: null, desc: 'Sophisticated corporate event featuring executive meeting spaces, presentation theaters, and networking lounges.' },
  ];

  const filtered = activeFilter === 'All' ? projects : projects.filter(p => p.cat === activeFilter);

  return (
    <div className="overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes slowZoom { from{transform:scale(1.05)} to{transform:scale(1.13)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
        .nav-link::after { content:''; display:block; height:2px; width:0; background:#F4A300; transition:width 0.3s ease; margin-top:2px; }
        .nav-link:hover::after { width:100%; }
        .port-img { transition: transform 0.7s ease; }
        .port-card:hover .port-img { transform: scale(1.1); }
      `}</style>

      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: scrolled ? '10px 0' : '14px 0', boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          <Link to="/"><img src="/images/mopi_logo_20260101_112924.png" alt="MOPi Production" className="h-11 w-auto object-contain transition-opacity hover:opacity-75" /></Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => <Link key={l.to} to={l.to} className="nav-link text-sm font-medium tracking-wide" style={{ color: l.to === '/portfolio' ? '#ffffff' : '#d1d5db' }}>{l.label}</Link>)}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all hover:scale-105" style={{ background: '#16a34a' }}>
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <Link to="/contact" className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105" style={{ background: '#F4A300' }}>
              Get a Quote <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <button onClick={() => setMenuOpen(p => !p)} className="md:hidden p-2 text-white">{menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
        </div>
        <div className="md:hidden overflow-hidden transition-all duration-300" style={{ maxHeight: menuOpen ? '400px' : '0', opacity: menuOpen ? 1 : 0 }}>
          <div style={{ background: 'rgba(0,0,0,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)' }} className="px-6 py-5 space-y-1">
            {navLinks.map(l => <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-3 text-sm font-medium" style={{ color: '#9ca3af', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {l.label} <ChevronRight className="h-4 w-4 opacity-50" /></Link>)}
            <div className="flex gap-3 pt-4">
              <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center text-white text-sm font-semibold px-4 py-3 rounded-full" style={{ background: '#16a34a' }}>WhatsApp</a>
              <Link to="/contact" className="flex-1 text-center text-white text-sm font-semibold px-4 py-3 rounded-full" style={{ background: '#F4A300' }}>Get a Quote</Link>
            </div>
          </div>
        </div>
      </header>

      {/* ══ § 1 · HERO — BLACK ══ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20" style={{ background: '#000000' }}>
        <div className="absolute inset-0">
          <img src={IMAGES.BOOTH_8} alt="" className="w-full h-full object-cover" style={{ opacity: 0.3, animation: 'slowZoom 22s ease-in-out infinite alternate' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,1) 100%)' }} />
        </div>
        <div className="absolute left-0 inset-y-0 w-[3px]" style={{ background: 'linear-gradient(to bottom, transparent, #F4A300, transparent)', opacity: 0.6 }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)', opacity: 0.4 }} />
        <div className="absolute top-20 right-16 pointer-events-none" style={{ width: 100, height: 100, border: '1px solid #F4A300', opacity: 0.1, transform: 'rotate(45deg)' }} />

        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto py-24">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(244,163,0,0.12)', border: '1px solid rgba(244,163,0,0.3)', color: '#F4A300', animation: 'fadeDown 0.8s ease 0.2s both' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#F4A300' }} />500+ Projects Delivered
          </div>
          <h1 className="font-black leading-tight text-white mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', animation: 'fadeDown 0.9s ease 0.35s both', fontFamily: "'Poppins', sans-serif" }}>
            Showcasing <span style={{ color: '#F4A300' }}>Excellence</span><br />Across Industries
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#d1d5db', animation: 'fadeDown 0.9s ease 0.5s both' }}>
            Award-winning projects that have transformed brands and created memorable experiences across Egypt and the MENA region.
          </p>
        </div>
      </section>

      {/* ══ § 2 · STATS — LIGHT GRAY ══ */}
      <section style={{ background: '#F2F2F2', borderTop: '3px solid #F4A300' }}>
        <div className="max-w-5xl mx-auto px-5 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: 500, suffix: '+', label: 'Projects Completed' },
            { num: 15, suffix: '+', label: 'Countries Served' },
            { num: 200, suffix: '+', label: 'Happy Clients' },
            { num: 25, suffix: '+', label: 'Industry Awards' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="group cursor-default">
                <div className="text-4xl md:text-5xl font-black mb-1.5 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <Counter target={s.num} suffix={s.suffix} />
                </div>
                <div className="text-xs font-bold tracking-widest uppercase" style={{ color: '#2B2B2B' }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ § 3 · PORTFOLIO GRID — WHITE ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-10">
            <SectionLabel text="Our Work" />
            <h2 className="font-black mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#000', fontFamily: "'Poppins', sans-serif" }}>Featured Projects</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#555' }}>A selection of our finest work across Egypt and the MENA region</p>
          </Reveal>

          {/* Filter */}
          <Reveal delay={80}>
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveFilter(c)}
                  className="px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105"
                  style={activeFilter === c
                    ? { background: '#F4A300', color: '#fff', boxShadow: '0 6px 20px rgba(244,163,0,0.35)' }
                    : { background: '#FFFFFF', color: '#555', border: '1.5px solid #e5e7eb' }}
                  onMouseEnter={e => { if (activeFilter !== c) { (e.currentTarget.style.borderColor = '#F4A300'); (e.currentTarget.style.color = '#F4A300'); } }}
                  onMouseLeave={e => { if (activeFilter !== c) { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.color = '#555'); } }}>
                  {c}
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
                onMouseEnter={e => { (e.currentTarget.style.borderColor = '#F4A300'); (e.currentTarget.style.boxShadow = '0 16px 40px rgba(244,163,0,0.12)'); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'); }}>

                <div className="relative overflow-hidden h-52">
                  <img src={p.image} alt={p.title} className="port-img w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                  {p.award && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 text-white text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(244,163,0,0.9)' }}>
                        <Award className="h-3 w-3" /> {p.award}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3"><Badge text={p.cat} /></div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: 'rgba(244,163,0,0.9)' }}>
                    <ExternalLink className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>

                <div className="p-5 bg-white">
                  <h3 className="font-bold text-base mb-1.5 transition-colors group-hover:text-[#F4A300]" style={{ color: '#000', fontFamily: "'Poppins', sans-serif" }}>{p.title}</h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#777' }}>{p.desc}</p>
                  <div className="flex items-center justify-between text-xs" style={{ color: '#9ca3af' }}>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" style={{ color: '#F4A300' }} />{p.location}</span>
                    <span>{p.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 4 · FEATURED SPOTLIGHT — BLACK ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#000000' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)' }} />
        <div className="absolute top-16 right-16 pointer-events-none" style={{ width: 130, height: 130, border: '1px solid #F4A300', opacity: 0.06, transform: 'rotate(45deg)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <SectionLabel text="Spotlight" />
            <h2 className="font-black mb-4 text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Poppins', sans-serif" }}>
              Featured Project <span style={{ color: '#F4A300' }}>Spotlight</span>
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl" style={{ border: '1.5px solid rgba(255,255,255,0.08)' }}>
              <div className="relative overflow-hidden group">
                <img src={projects[0].image} alt={projects[0].title} className="w-full h-full object-cover min-h-72 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.3))' }} />
                <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: '#F4A300' }} />
              </div>
              <div className="p-10 lg:p-12" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <Badge text={projects[0].cat} />
                <h3 className="text-2xl font-black text-white mt-4 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{projects[0].title}</h3>
                <p className="leading-relaxed mb-6 text-sm" style={{ color: '#9ca3af' }}>{projects[0].desc}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[['Client', projects[0].client], ['Location', projects[0].location], ['Date', projects[0].date], ['Visitors', projects[0].visitors]].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>{k}</div>
                      <div className="text-sm font-semibold text-white">{v}</div>
                    </div>
                  ))}
                </div>
                <Link to="/contact"
                  className="group inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all hover:scale-105"
                  style={{ background: '#F4A300', color: '#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#e09200')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F4A300')}>
                  Start a Similar Project <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ § 5 · CTA — DARK ══ */}
      <section className="relative py-24 px-5 overflow-hidden" style={{ background: '#1A1A1A' }}>
        <div className="absolute left-0 inset-y-0 w-[4px]" style={{ background: '#F4A300' }} />
        <Reveal className="relative max-w-4xl mx-auto text-center">
          <SectionLabel text="Your Project Next" />
          <h2 className="font-black text-white leading-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontFamily: "'Poppins', sans-serif" }}>
            Ready to Create Your<br /><span style={{ color: '#F4A300' }}>Success Story?</span>
          </h2>
          <p className="text-lg mb-11" style={{ color: '#9ca3af' }}>Join our portfolio of successful projects and let us bring your vision to life.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"
              className="group inline-flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-5 rounded-full transition-all hover:scale-105"
              style={{ background: '#F4A300', boxShadow: '0 12px 30px rgba(244,163,0,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e09200')}
              onMouseLeave={e => (e.currentTarget.style.background = '#F4A300')}>
              Start Your Project <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-5 rounded-full transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#16a34a'); (e.currentTarget.style.borderColor = '#16a34a'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(255,255,255,0.07)'); (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'); }}>
              <MessageCircle className="h-5 w-5" /> WhatsApp Us
            </a>
          </div>
        </Reveal>
      </section>

      <SharedFooter />
    </div>
  );
};

export default Portfolio;
