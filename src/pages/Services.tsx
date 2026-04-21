import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '@/assets/images';
import {
  ArrowRight, Phone, Mail, MapPin, MessageCircle,
  Menu, X, ChevronRight, CheckCircle, MoveRight,
  Layers, Zap, Award, Wrench, Palette, Settings, Truck,
  Clock, Shield, Users,
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
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}><Phone className="h-4 w-4 shrink-0" style={{ color: '#F4A300' }} /> +20 100 000 0000</a></li>
            <li><a href="mailto:info@mopiproduction.com" className="flex items-center gap-2.5 text-sm transition-colors" style={{ color: '#6b7280' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}><Mail className="h-4 w-4 shrink-0" style={{ color: '#F4A300' }} /> info@mopiproduction.com</a></li>
          </ul>
          <Link to="/admin" className="inline-flex items-center gap-1 mt-7 text-xs transition-colors" style={{ color: '#374151' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
            onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>Admin Dashboard →</Link>
        </div>
      </div>
      <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-sm" style={{ color: '#374151' }}>© 2026 MOPi Production. All rights reserved. Cairo, Egypt.</p>
        <p className="text-xs tracking-wide" style={{ color: '#1f2937' }}>Exhibition Booths · Brand Activations · Event Production</p>
      </div>
    </div>
  </footer>
);

/* ════════════════ SERVICES PAGE ════════════════ */
const Services = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'Contact', to: '/contact' },
  ];

  const mainServices = [
    {
      icon: Layers, title: 'Exhibition Booth Design & Build',
      subtitle: 'Custom-designed booths that captivate and convert',
      desc: 'From concept to completion, we create stunning exhibition booths that tell your brand story and drive meaningful engagement with your target audience.',
      image: IMAGES.BOOTH_8,
      features: ['3D Design & Visualization', 'Custom Branding Integration', 'Interactive Elements', 'Premium Materials', 'Modular Systems', 'On-site Installation'],
      process: ['Initial Consultation & Brief', '3D Design Development', 'Client Approval & Refinement', 'Production & Fabrication', 'Installation & Setup', 'Post-Event Support'],
    },
    {
      icon: Zap, title: 'Event Production & Management',
      subtitle: 'Complete event management from concept to execution',
      desc: 'Full-service event production including stage design, lighting, audio-visual systems, and on-the-ground management for corporate events and product launches.',
      image: IMAGES.EVENT_1,
      features: ['Stage Design & Construction', 'Professional Lighting Systems', 'Audio-Visual Integration', 'Technical Support Team', 'Project Management', 'Live Event Coordination'],
      process: ['Event Planning & Strategy', 'Technical Requirements Analysis', 'Design & Setup Planning', 'Equipment Installation', 'Live Event Management', 'Post-Event Breakdown'],
    },
    {
      icon: Award, title: 'Brand Activations',
      subtitle: 'Immersive experiences that deeply engage audiences',
      desc: 'Creative brand activations and installations that create memorable interactions between your brand and your audience, driving real engagement and recall.',
      image: IMAGES.EVENT_3,
      features: ['Concept & Strategy', 'Custom Installations', 'Interactive Experiences', 'Brand Storytelling', 'Audience Engagement', 'Post-Activation Reports'],
      process: ['Brand Analysis & Strategy', 'Creative Concept Development', 'Design & Production', 'Installation & Testing', 'Live Activation Management', 'Performance Analysis'],
    },
    {
      icon: Wrench, title: 'Custom Fabrication',
      subtitle: 'Tailored structures for any space and purpose',
      desc: 'Modular and custom structures designed to your exact specifications — from temporary installations to permanent displays, kiosks, and architectural elements.',
      image: IMAGES.BOOTH_3,
      features: ['Modular Design Systems', 'Custom Fabrication', 'Structural Engineering', 'Premium Materials', 'Quick Assembly Systems', 'Maintenance Support'],
      process: ['Site Assessment & Planning', 'Structural Design', 'Material Selection', 'Fabrication & QC', 'Installation & Testing', 'Handover & Training'],
    },
  ];

  const additionalServices = [
    { icon: Palette, title: 'Branding & Graphics', desc: 'Banners, signage, lightboxes, and full visual branding that elevates your presence at any show.' },
    { icon: Settings, title: 'Technical Support', desc: '24/7 on-site technical support during events and exhibitions — no detail is too small.' },
    { icon: Truck, title: 'Logistics Management', desc: 'Complete logistics coordination including shipping, storage, and transportation management.' },
    { icon: Users, title: 'Project Management', desc: 'Dedicated project managers ensuring on-time, on-budget delivery with zero surprises.' },
  ];

  const industries = ['Technology & IT', 'Healthcare & Pharma', 'Automotive', 'Financial Services', 'Consumer Goods', 'Energy & Utilities', 'Education', 'Government & Public'];

  return (
    <div className="overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes slowZoom { from{transform:scale(1.05)} to{transform:scale(1.13)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        .nav-link::after { content:''; display:block; height:2px; width:0; background:#F4A300; transition:width 0.3s ease; margin-top:2px; }
        .nav-link:hover::after { width:100%; }
        .svc-img { transition: transform 0.6s ease; }
        .svc-card:hover .svc-img { transform: scale(1.05); }
      `}</style>

      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: scrolled ? '10px 0' : '14px 0', boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          <Link to="/"><img src="/images/mopi_logo_20260101_112924.png" alt="MOPi Production" className="h-11 w-auto object-contain transition-opacity hover:opacity-75" /></Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="nav-link text-sm font-medium tracking-wide transition-colors duration-200"
                style={{ color: l.to === '/services' ? '#ffffff' : '#d1d5db' }}>{l.label}</Link>
            ))}
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
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-3 text-sm font-medium" style={{ color: '#9ca3af', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {l.label} <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            ))}
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
          <img src={IMAGES.BOOTH_4} alt="" className="w-full h-full object-cover" style={{ opacity: 0.28, animation: 'slowZoom 22s ease-in-out infinite alternate' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,1) 100%)' }} />
        </div>
        <div className="absolute left-0 inset-y-0 w-[3px]" style={{ background: 'linear-gradient(to bottom, transparent, #F4A300, transparent)', opacity: 0.6 }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)', opacity: 0.4 }} />

        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto py-24">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(244,163,0,0.12)', border: '1px solid rgba(244,163,0,0.3)', color: '#F4A300', animation: 'fadeDown 0.8s ease 0.2s both' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#F4A300' }} />End-to-End Solutions
          </div>
          <h1 className="font-black leading-tight text-white mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', animation: 'fadeDown 0.9s ease 0.35s both', fontFamily: "'Poppins', sans-serif" }}>
            Comprehensive<br /><span style={{ color: '#F4A300' }}>Exhibition Solutions</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: '#d1d5db', animation: 'fadeDown 0.9s ease 0.5s both' }}>
            From concept to completion — we provide end-to-end services that transform your brand vision into powerful, engaging experiences.
          </p>
          <Link to="/contact"
            className="inline-flex items-center gap-3 text-white font-bold text-base px-9 py-4 rounded-full transition-all hover:scale-105"
            style={{ background: '#F4A300', boxShadow: '0 10px 30px rgba(244,163,0,0.3)', animation: 'fadeDown 0.9s ease 0.65s both' }}>
            Get Custom Quote <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ══ § 2 · MAIN SERVICES — alternating WHITE / LIGHT GRAY ══ */}
      {mainServices.map((svc, i) => (
        <section key={i} className="py-24 px-5 relative overflow-hidden" style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F2F2F2' }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)' }} />
          {i % 2 === 0 && <div className="absolute top-12 right-12 pointer-events-none" style={{ width: 140, height: 140, border: '1.5px solid #F4A300', opacity: 0.06, transform: 'rotate(45deg)' }} />}

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Text — flip on odd */}
            <div className={i % 2 === 1 ? 'md:order-2' : ''}>
              <Reveal>
                <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase px-3 py-1.5 rounded-full mb-5"
                  style={{ background: 'rgba(244,163,0,0.1)', border: '1px solid rgba(244,163,0,0.2)', color: '#F4A300' }}>
                  <svc.icon className="h-3.5 w-3.5" /> {svc.title}
                </div>
                <h2 className="font-black mb-4" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#000', fontFamily: "'Poppins', sans-serif" }}>{svc.subtitle}</h2>
                <p className="text-base leading-relaxed mb-7" style={{ color: '#555' }}>{svc.desc}</p>

                <div className="mb-7">
                  <h3 className="font-bold text-sm mb-4 uppercase tracking-widest" style={{ color: '#000' }}>Key Features</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {svc.features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2 text-sm" style={{ color: '#2B2B2B' }}>
                        <CheckCircle className="h-4 w-4 shrink-0" style={{ color: '#F4A300' }} />{f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-sm mb-4 uppercase tracking-widest" style={{ color: '#000' }}>Our Process</h3>
                  <div className="space-y-2">
                    {svc.process.map((step, si) => (
                      <div key={si} className="flex items-center gap-3 text-sm" style={{ color: '#555' }}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0" style={{ background: '#F4A300' }}>{si + 1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <Link to="/contact"
                  className="group inline-flex items-center gap-2.5 text-white font-bold px-7 py-3.5 rounded-full transition-all hover:scale-105"
                  style={{ background: '#F4A300', boxShadow: '0 8px 24px rgba(244,163,0,0.25)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#e09200')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F4A300')}>
                  Get a Quote <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>

            {/* Image — flip on odd */}
            <div className={i % 2 === 1 ? 'md:order-1' : ''}>
              <Reveal delay={120}>
                <div className="svc-card relative overflow-hidden rounded-2xl group" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  <img src={svc.image} alt={svc.title} className="svc-img w-full h-80 object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)' }} />
                  {/* Orange corner accents */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)' }} />
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(244,163,0,0.9)' }}>
                    {svc.title}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* ══ § 3 · ADDITIONAL SERVICES — BLACK ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#000000' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)' }} />
        <div className="absolute top-16 right-16 pointer-events-none" style={{ width: 120, height: 120, border: '1px solid #F4A300', opacity: 0.06, transform: 'rotate(45deg)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text="Support Services" />
            <h2 className="font-black mb-4 text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Poppins', sans-serif" }}>
              Additional <span style={{ color: '#F4A300' }}>Services</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#9ca3af' }}>Comprehensive support to ensure every project's complete success</p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {additionalServices.map((s, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="group p-7 rounded-2xl text-center cursor-default transition-all duration-400 hover:-translate-y-2"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(244,163,0,0.4)'); (e.currentTarget.style.background = 'rgba(244,163,0,0.05)'); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'); (e.currentTarget.style.background = 'rgba(255,255,255,0.04)'); }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 transition-all group-hover:scale-110"
                    style={{ background: 'rgba(244,163,0,0.12)', border: '1.5px solid rgba(244,163,0,0.3)' }}>
                    <s.icon className="h-6 w-6" style={{ color: '#F4A300' }} />
                  </div>
                  <h3 className="font-bold text-base mb-3 text-white transition-colors group-hover:text-[#F4A300]" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 4 · INDUSTRIES — LIGHT GRAY ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#F2F2F2' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-14">
            <SectionLabel text="Sectors We Serve" />
            <h2 className="font-black mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#000', fontFamily: "'Poppins', sans-serif" }}>Industries We Serve</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#555' }}>Our expertise spans multiple industries with tailored solutions</p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((ind, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="group p-5 rounded-xl text-center cursor-default transition-all duration-300 hover:-translate-y-1"
                  style={{ background: '#FFFFFF', border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = '#F4A300'); (e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,163,0,0.1)'); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'); }}>
                  <span className="text-sm font-semibold transition-colors group-hover:text-[#F4A300]" style={{ color: '#1A1A1A' }}>{ind}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 5 · WHY CHOOSE US — WHITE ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #F4A300, transparent)' }} />
        <div className="absolute bottom-16 right-16 pointer-events-none" style={{ width: 160, height: 160, border: '1.5px solid #F4A300', opacity: 0.07, transform: 'rotate(45deg)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-14">
            <SectionLabel text="Why Choose Us" />
            <h2 className="font-black mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#000', fontFamily: "'Poppins', sans-serif" }}>Why Choose MOPi?</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Clock, t: 'On-Time Delivery', d: 'We meet every deadline — no excuses, no exceptions.' },
              { icon: Award, t: 'Award-Winning Design', d: 'Multiple industry awards for innovation and excellence.' },
              { icon: Shield, t: 'Premium Quality', d: 'Uncompromising quality at every material, finish, and structural detail.' },
              { icon: Users, t: 'Expert Team', d: '8+ years of specialists in design, production, and live events.' },
              { icon: Layers, t: 'A-to-Z Service', d: 'Concept, logistics, hotel, setup, management — all under one roof.' },
              { icon: Zap, t: '8+ Years Experience', d: 'Proven track record delivering 500+ projects across the MENA region.' },
            ].map((w, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="group flex items-start gap-5 p-7 rounded-2xl cursor-default transition-all duration-400 hover:-translate-y-1"
                  style={{ background: '#FFFFFF', border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = '#F4A300'); (e.currentTarget.style.boxShadow = '0 12px 30px rgba(244,163,0,0.12)'); (e.currentTarget.style.background = '#fffef9'); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'); (e.currentTarget.style.background = '#FFFFFF'); }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                    style={{ background: 'rgba(244,163,0,0.1)', border: '1.5px solid rgba(244,163,0,0.25)' }}>
                    <w.icon className="h-5 w-5" style={{ color: '#F4A300' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2 transition-colors group-hover:text-[#F4A300]" style={{ color: '#000', fontFamily: "'Poppins', sans-serif" }}>{w.t}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{w.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 6 · CTA — DARK ══ */}
      <section className="relative py-24 px-5 overflow-hidden" style={{ background: '#1A1A1A' }}>
        <div className="absolute inset-0">
          <img src={IMAGES.BOOTH_5} alt="" className="w-full h-full object-cover" style={{ opacity: 0.08 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,26,26,0.95), rgba(26,26,26,0.85), rgba(26,26,26,0.95))' }} />
        </div>
        <div className="absolute left-0 inset-y-0 w-[4px]" style={{ background: '#F4A300' }} />

        <Reveal className="relative max-w-4xl mx-auto text-center">
          <SectionLabel text="Let's Get Started" />
          <h2 className="font-black text-white leading-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontFamily: "'Poppins', sans-serif" }}>
            Ready to Start<br /><span style={{ color: '#F4A300' }}>Your Project?</span>
          </h2>
          <p className="text-lg mb-11" style={{ color: '#9ca3af' }}>Let's discuss your exhibition needs and create a custom solution that exceeds expectations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"
              className="group inline-flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-5 rounded-full transition-all hover:scale-105"
              style={{ background: '#F4A300', boxShadow: '0 12px 30px rgba(244,163,0,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e09200')}
              onMouseLeave={e => (e.currentTarget.style.background = '#F4A300')}>
              Free Consultation <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="tel:+201000000000"
              className="inline-flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-5 rounded-full transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(255,255,255,0.12)'); (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(255,255,255,0.07)'); (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'); }}>
              <Phone className="h-5 w-5" /> +20 100 000 0000
            </a>
          </div>
        </Reveal>
      </section>

      <SharedFooter />
    </div>
  );
};

export default Services;
