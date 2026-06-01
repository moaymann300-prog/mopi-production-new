import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '@/assets/images';
import { useCMS, getLogoUrl, getSocialUrl } from '@/hooks/useCMS';
import { useLocalLanguage } from '@/hooks/useLanguage';
import {
  ArrowRight, Phone, Mail, MapPin, MessageCircle,
  Menu, X, ChevronRight, MoveRight, CheckCircle,
  Target, Star, Lightbulb, Shield, Users, Globe,
  Award,
} from 'lucide-react';

/* ── Shared helpers (same as homepage) ── */
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
    <span className="w-8 h-px block" style={{ background: '#ED8214' }} />
    {text}
    <span className="w-8 h-px block" style={{ background: '#ED8214' }} />
  </div>
);

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
  return (
  <footer style={{ background: '#000000', borderTop: '3px solid #ED8214' }} className="py-14 px-5">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-10 mb-10">
        <div className="md:col-span-2">
          <img src={logoUrl} alt={companyName} className="h-12 w-auto object-contain mb-4 hover:opacity-80 transition-opacity" />
          <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: '#6b7280' }}>{tagline}</p>
          <div className="flex gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.25)', color: '#4ade80' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#16a34a'); (e.currentTarget.style.color = '#fff'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(22,163,74,0.15)'); (e.currentTarget.style.color = '#4ade80'); }}>
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <a href={`mailto:${email}`}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
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
            {(isAr ? ['تصميم أجنحة المعارض', 'تنفيذ الفعاليات', 'براند أكتيفيشن', 'تصنيع مخصص', 'هوية بصرية وجرافيك'] : ['Exhibition Booth Design', 'Event Production', 'Brand Activations', 'Custom Fabrication', 'Branding & Graphics']).map(s => (
              <li key={s}><Link to="/services" className="text-sm flex items-center gap-1.5 group" style={{ color: '#6b7280' }}
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
              onMouseEnter={e => (e.currentTarget.style.color = '#ED8214')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
              <Phone className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} /> {phone}
            </a></li>
            {phone2 && <li><a href={`tel:${phone2.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-sm transition-colors" style={{ color: '#6b7280' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ED8214')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
              <Phone className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} /> {phone2}
            </a></li>}
            <li><a href={`mailto:${email}`} className="flex items-center gap-2.5 text-sm transition-colors" style={{ color: '#6b7280' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
              <Mail className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} /> {email}
            </a></li>
          </ul>
          <Link to="/admin" className="inline-flex items-center gap-1 mt-7 text-xs transition-colors" style={{ color: '#374151' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
            onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>{isAr ? 'لوحة التحكم' : 'Admin Dashboard'} →</Link>
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

/* ════════════════ ABOUT PAGE ════════════════ */
const About = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cms = useCMS();
  const { t, isAr, dir, fontFamily } = useLocalLanguage();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.services'), to: '/services' },
    { label: t('nav.portfolio'), to: '/portfolio' },
    { label: t('nav.contact'), to: '/contact' },
  ];

  const values = [
    { icon: Lightbulb, title: isAr ? 'الابتكار' : 'Innovation', desc: isAr ? 'نكسر حدود التصميم والتكنولوجيا لنصنع تجارب معارض استثنائية.' : 'We push boundaries of design and technology to create cutting-edge exhibition experiences.' },
    { icon: Shield, title: isAr ? 'الجودة' : 'Quality', desc: isAr ? 'كل مشروع يخضع لمعاييرنا الصارمة — نتائج استثنائية تفوق التوقعات.' : 'Every project meets our rigorous standards — exceptional results that exceed expectations.' },
    { icon: Users, title: isAr ? 'الشراكة' : 'Collaboration', desc: isAr ? 'نعمل مع عملائنا كشركاء حقيقيين لتحويل رؤيتهم إلى واقع.' : 'We work closely with clients as partners, bringing their vision to life seamlessly.' },
    { icon: Globe, title: isAr ? 'الانتشار الإقليمي' : 'Regional Reach', desc: isAr ? 'مشاريع في مصر ومنطقة الشرق الأوسط بمعايير دولية عالية.' : 'With projects across Egypt and the MENA region, we deliver world-class expertise.' },
  ];

  const milestones = [
    { year: '2016', event: isAr ? 'تأسيس موبي برودكشن في القاهرة' : 'MOPi Production Founded in Cairo' },
    { year: '2018', event: isAr ? 'أول مشروع معرض دولي' : 'First International Exhibition Project' },
    { year: '2020', event: isAr ? 'تجاوز حاجز 100 مشروع منجز' : '100+ Projects Milestone Reached' },
    { year: '2022', event: isAr ? 'التوسع إلى السوق السعودي والإماراتي' : 'Expanded to Saudi Arabia & UAE Markets' },
    { year: '2024', event: isAr ? 'إتمام 400+ مشروع' : '400+ Projects Completed' },
    { year: '2026', event: isAr ? '+500 مشروع ونحو المزيد' : '500+ Projects & Growing' },
  ];

  const achievements = [
    { year: '2025', title: isAr ? 'أفضل تصميم معرض' : 'Best Exhibition Design', org: 'MENA Trade Show Association', desc: isAr ? 'تكريم على تصميم الجناح المبتكر في Cairo Tech Expo 2025.' : 'Recognized for innovative booth design at Cairo Tech Expo 2025.' },
    { year: '2024', title: isAr ? 'جائزة اختيار العملاء' : 'Client Choice Award', org: 'Exhibition Industry Alliance', desc: isAr ? 'أعلى تقييم رضا عملاء لعامين متتاليين.' : 'Highest client satisfaction rating for two consecutive years.' },
    { year: '2023', title: isAr ? 'الابتكار في التصميم' : 'Innovation in Design', org: 'Gulf Exhibition Awards', desc: isAr ? 'تصميم نظام بوث معياري مخصص ثوري.' : 'Revolutionary custom modular booth system design.' },
    { year: '2022', title: isAr ? 'أفضل شركة إنتاج' : 'Top Production Company', org: 'Egypt Events Council', desc: isAr ? 'شركة إنتاج الفعاليات الرائدة في السوق المصري.' : 'Leading event production company in the Egyptian market.' },
  ];

  // CMS-driven data with fallbacks
  const companyName = cms.settings.company_name || 'MOPi Production';
  const _email = cms.settings.email || 'info@mopiproduction.com';
const _phone = cms.settings.phone_1 || '+20 100 000 0000';
  const _address = cms.settings.address || 'Cairo, Egypt';
  const logoUrl = getLogoUrl(cms.headerLogo);
  const _footerLogoUrl = getLogoUrl(cms.footerLogo);
const whatsappUrl = cms.settings.whatsapp_number ? `https://wa.me/${cms.settings.whatsapp_number.replace(/[^0-9]/g, '')}` : 'https://wa.me/201000000000';
  const hero = cms.heroes['about'];

  // About CMS content
  const missionContent = cms.about['mission'];
  const visionContent = cms.about['vision'];

  return (
    <div className="overflow-x-hidden" dir={dir} style={{ fontFamily }}>
      <style>{`
        @keyframes slowZoom { from{transform:scale(1.05)} to{transform:scale(1.13)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        .nav-link::after { content:''; display:block; height:2px; width:0; background:#ED8214; transition:width 0.3s ease; margin-top:2px; }
        .nav-link:hover::after { width:100%; }
      `}</style>

      {/* ── NAV (same as homepage) ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: scrolled ? '14px 0' : '19px 0', boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          <Link to="/">
            <img src={logoUrl} alt={companyName} className="h-16 w-auto object-contain transition-opacity hover:opacity-75" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="nav-link text-sm font-medium tracking-wide transition-colors duration-200"
                style={{ color: l.to === '/about' ? '#ffffff' : '#d1d5db' }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#16a34a' }}>
              <MessageCircle className="h-4 w-4" /> {t('nav.whatsapp')}
            </a>
            <Link to="/contact"
              className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#ED8214' }}>
              {t('nav.quote')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <button onClick={() => setMenuOpen(p => !p)} className="md:hidden p-2 text-white">{menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
        </div>
        <div className="md:hidden overflow-hidden transition-all duration-300" style={{ maxHeight: menuOpen ? '400px' : '0', opacity: menuOpen ? 1 : 0 }}>
          <div style={{ background: 'rgba(0,0,0,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)' }} className="px-6 py-5 space-y-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-3 text-sm font-medium"
                style={{ color: '#9ca3af', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {l.label} <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            ))}
            <div className="flex gap-3 pt-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center text-white text-sm font-semibold px-4 py-3 rounded-full" style={{ background: '#16a34a' }}>{t('nav.whatsapp')}</a>
              <Link to="/contact" className="flex-1 text-center text-white text-sm font-semibold px-4 py-3 rounded-full" style={{ background: '#ED8214' }}>{t('nav.quote')}</Link>
            </div>
          </div>
        </div>
      </header>

      {/* ══ § 1 · HERO — BLACK ══ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20" style={{ background: '#000000' }}>
        <div className="absolute inset-0">
          <img src={hero?.bg_image_url || IMAGES.CORPORATE_4} alt="" className="w-full h-full object-cover" style={{ opacity: 0.28, animation: 'slowZoom 20s ease-in-out infinite alternate' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 100%)' }} />
        </div>
        <div className="absolute left-0 inset-y-0 w-[3px]" style={{ background: 'linear-gradient(to bottom, transparent, #ED8214, transparent)', opacity: 0.6 }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)', opacity: 0.4 }} />

        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto py-24">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(244,163,0,0.12)', border: '1px solid rgba(244,163,0,0.3)', color: '#ED8214', animation: 'fadeDown 0.8s ease 0.2s both' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ED8214' }} />
            {hero?.badge_text || (isAr ? 'قصتنا' : 'Our Story')}
          </div>
          <h1 className="font-black leading-tight text-white mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', animation: 'fadeDown 0.9s ease 0.35s both' }}>
            {hero?.heading ? <span dangerouslySetInnerHTML={{ __html: hero.heading }} /> : isAr ? <>{' '}نصنع التميز<br /><span style={{ color: '#ED8214' }}>منذ 2016</span></> : <>Crafting Excellence<br /><span style={{ color: '#ED8214' }}>Since 2016</span></>}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#d1d5db', animation: 'fadeDown 0.9s ease 0.5s both', lineHeight: isAr ? '2' : '1.7' }}>
            {hero?.subheading || (isAr ? 'مبدعون شغوفون ومصممون مبتكرون وبنّاؤون دقيقون نحوّل رؤية براندك إلى تجارب استثنائية.' : 'Passionate creators, innovative designers, and meticulous builders dedicated to transforming your brand vision into extraordinary experiences.')}
          </p>
        </div>
      </section>

      {/* ══ § 2 · MISSION & VISION — WHITE ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />
        <div className="absolute top-16 right-16 pointer-events-none" style={{ width: 160, height: 160, border: '1.5px solid #ED8214', opacity: 0.07, transform: 'rotate(45deg)' }} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(244,163,0,0.1)', border: '1.5px solid rgba(244,163,0,0.25)' }}>
                <Target className="h-5 w-5" style={{ color: '#ED8214' }} />
              </div>
              <h2 className="text-3xl font-black" style={{ color: '#000' }}>{isAr ? 'رسالتنا' : 'Our Mission'}</h2>
            </div>
            <p className="text-lg leading-relaxed mb-6" style={{ color: '#555', lineHeight: isAr ? '2' : '1.8' }}>
              {missionContent?.content || (isAr ? 'نسعى لإحداث نقلة نوعية في صناعة المعارض والفعاليات بمصر والمنطقة، من خلال تجارب مبتكرة تربط الشركات بجمهورها بطرق حقيقية وقابلة للقياس.' : "To revolutionize Egypt's exhibition and event industry by creating immersive, innovative experiences that connect brands with their audiences in meaningful, measurable ways.")}
            </p>
            <div className="space-y-3">
              {(isAr ? ['تقديم حلول معارض عالمية المستوى', 'بناء شراكات طويلة المدى مع العملاء', 'قيادة الابتكار في التصميم والتنفيذ', 'الالتزام بأعلى معايير الجودة'] : ['Deliver world-class exhibition solutions', 'Foster long-term client partnerships', 'Drive innovation in design and production', 'Maintain the highest quality standards']).map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 shrink-0" style={{ color: '#ED8214' }} />
                  <span className="text-sm" style={{ color: '#2B2B2B' }}>{item}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(244,163,0,0.1)', border: '1.5px solid rgba(244,163,0,0.25)' }}>
                <Star className="h-5 w-5" style={{ color: '#ED8214' }} />
              </div>
              <h2 className="text-3xl font-black" style={{ color: '#000' }}>{isAr ? 'رؤيتنا' : 'Our Vision'}</h2>
            </div>
            <p className="text-lg leading-relaxed mb-7" style={{ color: '#555', lineHeight: isAr ? '2' : '1.8' }}>
              {visionContent?.content || (isAr ? 'أن نكون الشريك الأول في المنطقة لتصميم المعارض وإنتاج الفعاليات، معروفين بالإبداع والموثوقية وتحويل الفضاءات إلى تجارب براند استثنائية.' : "To be the MENA region's premier exhibition design and event production company, recognized for creativity, reliability, and the ability to transform spaces into powerful brand experiences.")}
            </p>
            <div className="p-6 rounded-2xl" style={{ background: '#000', border: '1.5px solid #1A1A1A' }}>
              <h3 className="font-bold text-base mb-3 text-white">{isAr ? 'نظرتنا حتى 2030' : 'Looking Ahead to 2030'}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#9ca3af', lineHeight: isAr ? '2' : '1.7' }}>
                {isAr ? 'هدفنا أن نكون الشريك المفضل لكبرى الشركات في المنطقة الباحثة عن حلول معارض متميزة — مع قيادة الابتكار في الصناعة.' : 'We aim to be the preferred partner for Fortune 500 companies and major MENA corporations seeking premium exhibition solutions — while leading the industry in innovation.'}
              </p>
              <div className="mt-4 h-px" style={{ background: 'linear-gradient(to right, #ED8214, transparent)' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ § 3 · CORE VALUES — LIGHT GRAY ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#F2F2F2' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text={isAr ? 'مبادئنا' : 'What We Stand For'} />
            <h2 className="font-black mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#000' }}>{isAr ? 'قيمنا الأساسية' : 'Our Core Values'}</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#555' }}>{isAr ? 'المبادئ التي توجه كل قرار نتخذه وكل مشروع ننجزه' : 'The principles that guide every decision we make and every project we undertake'}</p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="group p-7 rounded-2xl cursor-default transition-all duration-400 hover:-translate-y-2 text-center"
                  style={{ background: '#FFFFFF', border: '1.5px solid #e5e7eb', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = '#ED8214'); (e.currentTarget.style.boxShadow = '0 16px 36px rgba(244,163,0,0.1)'); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'); }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(244,163,0,0.1)', border: '1.5px solid rgba(244,163,0,0.25)' }}>
                    <v.icon className="h-6 w-6" style={{ color: '#ED8214' }} />
                  </div>
                  <h3 className="font-bold text-base mb-3 transition-colors group-hover:text-[#ED8214]" style={{ color: '#000' }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#555', lineHeight: isAr ? '2' : '1.7' }}>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 4 · JOURNEY TIMELINE — BLACK ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#000000' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />
        <div className="absolute top-20 right-16 pointer-events-none" style={{ width: 120, height: 120, border: '1px solid #ED8214', opacity: 0.06, transform: 'rotate(45deg)' }} />

        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text={isAr ? 'رحلتنا' : 'Our Journey'} />
            <h2 className="font-black mb-4 text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              {isAr ? <>{' '}المحطات التي <span style={{ color: '#ED8214' }}>شكّلتنا</span></> : <>Milestones That <span style={{ color: '#ED8214' }}>Shaped Us</span></>}
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#9ca3af' }}>{isAr ? 'من بداية متواضعة إلى ريادة إقليمية' : 'From humble beginnings to regional leadership'}</p>
          </Reveal>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(244,163,0,0.4), transparent)' }} />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className={`flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-[calc(50%-2rem)] ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="inline-block p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(244,163,0,0.4)'); (e.currentTarget.style.background = 'rgba(244,163,0,0.05)'); }}
                        onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'); (e.currentTarget.style.background = 'rgba(255,255,255,0.04)'); }}>
                        <div className="text-xl font-black mb-1" style={{ color: '#ED8214', fontFamily: "'Poppins', sans-serif" }}>{m.year}</div>
                        <div className="text-sm font-semibold text-white" style={{ direction: isAr ? 'rtl' : 'ltr' }}>{m.event}</div>
                      </div>
                    </div>
                    {/* Dot */}
                    <div className="relative z-10 shrink-0">
                      <div className="w-4 h-4 rounded-full border-4" style={{ background: '#ED8214', borderColor: '#000' }} />
                    </div>
                    <div className="w-[calc(50%-2rem)]" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ § 5 · AWARDS — WHITE ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />
        <div className="absolute bottom-20 right-20 pointer-events-none" style={{ width: 140, height: 140, border: '1.5px solid #ED8214', opacity: 0.07, transform: 'rotate(45deg)' }} />

        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <SectionLabel text={isAr ? 'التقدير' : 'Recognition'} />
            <h2 className="font-black mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#000' }}>
              {isAr ? <>{' '}الجوائز و<span style={{ color: '#ED8214' }}>الإنجازات</span></> : <>Awards & <span style={{ color: '#ED8214' }}>Achievements</span></>}
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#555' }}>{isAr ? 'التزامنا بالتميز معترف به من قادة الصناعة' : 'Our commitment to excellence recognized by industry leaders'}</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-5">
            {achievements.map((a, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="group flex items-start gap-5 p-7 rounded-2xl transition-all duration-400 hover:-translate-y-1"
                  style={{ background: '#FFFFFF', border: '1.5px solid #e5e7eb', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = '#ED8214'); (e.currentTarget.style.boxShadow = '0 16px 36px rgba(244,163,0,0.1)'); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'); }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(244,163,0,0.1)', border: '1.5px solid rgba(244,163,0,0.25)' }}>
                    <Award className="h-5 w-5" style={{ color: '#ED8214' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-black" style={{ color: '#ED8214', fontFamily: "'Poppins', sans-serif" }}>{a.year}</span>
                      <h3 className="font-bold text-base transition-colors group-hover:text-[#ED8214]" style={{ color: '#000' }}>{a.title}</h3>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>{a.org}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#555', lineHeight: isAr ? '2' : '1.7' }}>{a.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 6 · CTA BAND — DARK ══ */}
      <section className="relative py-24 px-5 overflow-hidden" style={{ background: '#1A1A1A' }}>
        <div className="absolute inset-0">
          <img src={IMAGES.BOOTH_8} alt="" className="w-full h-full object-cover" style={{ opacity: 0.08 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,26,26,0.95), rgba(26,26,26,0.85), rgba(26,26,26,0.95))' }} />
        </div>
        <div className="absolute left-0 inset-y-0 w-[4px]" style={{ background: '#ED8214' }} />

        <Reveal className="relative max-w-4xl mx-auto text-center">
          <SectionLabel text={isAr ? 'لنعمل معاً' : "Let's Work Together"} />
          <h2 className="font-black text-white leading-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            {isAr ? <>مستعد لبناء شيء<br /><span style={{ color: '#ED8214' }}>استثنائي؟</span></> : <>Ready to Build Something<br /><span style={{ color: '#ED8214' }}>Extraordinary?</span></>}
          </h2>
          <p className="text-lg mb-11" style={{ color: '#9ca3af' }}>{isAr ? 'انضم لمئات العملاء الراضين الذين وثقوا بموبي برودكشن.' : 'Join hundreds of satisfied clients who trusted MOPi Production.'}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"
              className="group inline-flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-5 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#ED8214', boxShadow: '0 12px 30px rgba(244,163,0,0.3)' }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#e09200'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = '#ED8214'); }}>
              {isAr ? 'اطلب عرض سعر' : 'Request a Quote'} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 text-white font-bold text-lg px-10 py-5 rounded-full transition-all duration-300 hover:scale-105"
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

export default About;
