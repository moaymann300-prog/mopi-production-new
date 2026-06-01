import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '@/assets/images';
import { supabase } from '@/integrations/supabase/client';
import { useCMS, getLogoUrl, getSocialUrl, getCMSText, getCMSImage } from '@/hooks/useCMS';
import { useLocalLanguage } from '@/hooks/useLanguage';
import {
  ArrowRight, Phone, Mail, MapPin, MessageCircle,
  Menu, X, ChevronRight, CheckCircle, Clock, Send,
  Instagram, Facebook, Linkedin,
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
            {(isAr ? ['تصميم أجنحة المعارض', 'تنفيذ الفعاليات', 'براند أكتيفيشن', 'تصنيع مخصص', 'هوية بصرية وجرافيك'] : ['Exhibition Booth Design', 'Event Production', 'Brand Activations', 'Custom Fabrication', 'Branding & Graphics']).map(s => (
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
            onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')} onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>{isAr ? 'لوحة التحكم' : 'Admin Dashboard'} →</Link>
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

/* ════════════════ CONTACT PAGE ════════════════ */
const Contact = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' });
  const cms = useCMS();
  const { t: _t, isAr, dir, fontFamily, lang } = useLocalLanguage();
  const ct = (page: string, section: string, field: string, fallback: string) =>
    getCMSText(cms.pageContent, page, section, field, lang as 'en' | 'ar', fallback);
  const ci = (page: string, section: string, key: string, fallback: string) =>
    getCMSImage(cms.pageImages, page, section, key, fallback);
  const t = _t;

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

// CMS data
  const companyNameContact = cms.settings.company_name || 'MOPi Production';
  const logoUrlContact = getLogoUrl(cms.headerLogo);
const whatsappUrlContact = cms.settings.whatsapp_number ? `https://wa.me/${cms.settings.whatsapp_number.replace(/[^0-9]/g, '')}` : 'https://wa.me/201000000000';
  const phoneContact = cms.settings.phone_1 || '+20 100 000 0000';
  const phone2Contact = cms.settings.phone_2 || '';
  const emailContact = cms.settings.email || 'info@mopiproduction.com';
  const cmsAddress = cms.settings.address || 'Cairo, Egypt';
  const heroContact = cms.heroes['contact'];
  const instagramUrl = getSocialUrl(cms.socials, 'instagram');
  const facebookUrl = getSocialUrl(cms.socials, 'facebook');
  const _youtubeUrl = getSocialUrl(cms.socials, 'youtube');
  const linkedinUrl = getSocialUrl(cms.socials, 'linkedin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    try {
      await supabase.from('contact_submissions_2026_04_20').insert([{
        name: form.name, email: form.email, phone: form.phone,
        company: form.company, service: form.service, message: form.message,
        status: 'new', created_at: new Date().toISOString(),
      }]);
    } catch (_) { /* silently continue */ }
    setSubmitting(false);
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="overflow-x-hidden" dir={dir} style={{ fontFamily }}>
      <style>{`
        @keyframes slowZoom { from{transform:scale(1.05)} to{transform:scale(1.13)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        .nav-link::after { content:''; display:block; height:2px; width:0; background:#ED8214; transition:width 0.3s ease; margin-top:2px; }
        .nav-link:hover::after { width:100%; }
        input:focus, textarea:focus, select:focus { outline:none; border-color:#ED8214 !important; box-shadow: 0 0 0 3px rgba(244,163,0,0.12); }
      `}</style>

      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: scrolled ? '14px 0' : '19px 0', boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          <Link to="/"><img src={logoUrlContact} alt={companyNameContact} className="h-16 w-auto object-contain transition-opacity hover:opacity-75" /></Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => <Link key={l.to} to={l.to} className="nav-link text-sm font-medium tracking-wide" style={{ color: l.to === '/contact' ? '#ffffff' : '#d1d5db' }}>{l.label}</Link>)}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href={whatsappUrlContact} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all hover:scale-105" style={{ background: '#16a34a' }}>
              <MessageCircle className="h-4 w-4" /> {t('nav.whatsapp')}
            </a>
            <Link to="/contact" className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105" style={{ background: '#ED8214' }}>
              {t('nav.quote')} <ArrowRight className="h-3.5 w-3.5" />
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
              <a href={whatsappUrlContact} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center text-white text-sm font-semibold px-4 py-3 rounded-full" style={{ background: '#16a34a' }}>{t('nav.whatsapp')}</a>
              <Link to="/contact" className="flex-1 text-center text-white text-sm font-semibold px-4 py-3 rounded-full" style={{ background: '#ED8214' }}>{t('nav.quote')}</Link>
            </div>
          </div>
        </div>
      </header>

      {/* ══ § 1 · HERO — BLACK ══ */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden pt-20" style={{ background: '#000000' }}>
        <div className="absolute inset-0">
          <img src={ci('contact','hero','background', heroContact?.bg_image_url || IMAGES.BOOTH_5)} alt="" className="w-full h-full object-cover" style={{ opacity: 0.22, animation: 'slowZoom 22s ease-in-out infinite alternate' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,1) 100%)' }} />
        </div>
        <div className="absolute left-0 inset-y-0 w-[3px]" style={{ background: 'linear-gradient(to bottom, transparent, #ED8214, transparent)', opacity: 0.6 }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)', opacity: 0.4 }} />

        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto py-20">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(244,163,0,0.12)', border: '1px solid rgba(244,163,0,0.3)', color: '#ED8214', animation: 'fadeDown 0.8s ease 0.2s both' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ED8214' }} />{heroContact?.badge_text || (isAr ? 'دائماً في خدمتك' : 'Always Ready to Help')}
          </div>
          <h1 className="font-black leading-tight text-white mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', animation: 'fadeDown 0.9s ease 0.35s both' }}>
            {heroContact?.heading ? <span dangerouslySetInnerHTML={{ __html: heroContact.heading }} /> : isAr ? <>دعنا نبني<br /><span style={{ color: '#ED8214' }}>شيئاً استثنائياً</span></> : <>Let's Build<br /><span style={{ color: '#ED8214' }}>Something Amazing</span></>}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#d1d5db', animation: 'fadeDown 0.9s ease 0.5s both', lineHeight: isAr ? '2' : '1.7' }}>
            {heroContact?.subheading || (isAr ? 'تواصل مع فريقنا للحصول على استشارة مجانية. سنناقش مشروعك ونقدم لك عرضاً مخصصاً خلال 24 ساعة.' : "Get in touch with our team for a free consultation. We'll discuss your project and create a custom proposal within 24 hours.")}
          </p>
        </div>
      </section>

      {/* ══ § 2 · QUICK CONTACT STRIP — LIGHT GRAY ══ */}
      <section style={{ background: '#F2F2F2', borderTop: '3px solid #ED8214' }}>
        <div className="max-w-6xl mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Phone, label: isAr ? 'اتصل بنا' : 'Call Us', value: phone2Contact ? `${phoneContact} / ${phone2Contact}` : phoneContact, href: `tel:${phoneContact.replace(/\s/g, '')}`, sub: isAr ? 'الأحد – الجمعة 9 ص – 6 م' : 'Mon–Sat 9AM–6PM EET' },
            { icon: Mail, label: isAr ? 'راسلنا' : 'Email Us', value: emailContact, href: `mailto:${emailContact}`, sub: isAr ? 'رد خلال 24 ساعة' : 'Reply within 24 hours' },
            { icon: MessageCircle, label: 'WhatsApp', value: phoneContact, href: whatsappUrlContact, sub: isAr ? 'أسرع طريقة للتواصل' : 'Fastest response method' },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 80}>
              <a href={c.href} target={c.icon === MessageCircle ? '_blank' : undefined} rel="noopener noreferrer"
                className="group flex items-center gap-5 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{ background: '#FFFFFF', border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                onMouseEnter={e => { (e.currentTarget.style.borderColor = '#ED8214'); (e.currentTarget.style.boxShadow = '0 10px 28px rgba(244,163,0,0.1)'); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'); }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                  style={{ background: 'rgba(244,163,0,0.1)', border: '1.5px solid rgba(244,163,0,0.25)' }}>
                  <c.icon className="h-5 w-5" style={{ color: '#ED8214' }} />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: '#9ca3af' }}>{c.label}</div>
                  <div className="font-bold text-sm transition-colors group-hover:text-[#ED8214]" style={{ color: '#000' }}>{c.value}</div>
                  <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#9ca3af' }}><Clock className="h-3 w-3" />{c.sub}</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ § 3 · FORM + DETAILS — WHITE ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />
        <div className="absolute top-12 right-12 pointer-events-none" style={{ width: 150, height: 150, border: '1.5px solid #ED8214', opacity: 0.06, transform: 'rotate(45deg)' }} />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-14">
          {/* Form */}
          <div className="lg:col-span-3">
            <Reveal>
              <SectionLabel text={isAr ? 'احصل على عرض مجاني' : 'Get a Free Quote'} />
              <h2 className="font-black mb-3" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#000' }}>{isAr ? 'أرسل لنا رسالة' : 'Send Us a Message'}</h2>
              <p className="text-base mb-8" style={{ color: '#555', lineHeight: isAr ? '2' : '1.7' }}>{isAr ? 'املأ النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة.' : 'Fill out the form below and our team will get back to you within 24 hours.'}</p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center" style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: 16 }}>
                  <CheckCircle className="h-14 w-14 mb-5" style={{ color: '#16a34a' }} />
                  <h3 className="font-black text-2xl mb-3" style={{ color: '#15803d' }}>{isAr ? 'تم الإرسال!' : 'Message Sent!'}</h3>
                  <p style={{ color: '#166534' }}>{isAr ? 'شكراً! سيتواصل معك فريقنا خلال 24 ساعة.' : 'Thank you! Our team will contact you within 24 hours.'}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { id: 'name', label: isAr ? 'الاسم الكامل *' : 'Full Name *', type: 'text', placeholder: isAr ? 'اسمك الكامل' : 'Your full name', required: true },
                      { id: 'email', label: isAr ? 'البريد الإلكتروني *' : 'Email Address *', type: 'email', placeholder: 'your@email.com', required: true },
                      { id: 'phone', label: isAr ? 'رقم الهاتف' : 'Phone Number', type: 'tel', placeholder: '+20 100 000 0000', required: false },
                      { id: 'company', label: isAr ? 'اسم الشركة' : 'Company Name', type: 'text', placeholder: isAr ? 'شركتك' : 'Your company', required: false },
                    ].map(f => (
                      <div key={f.id}>
                        <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A1A1A' }}>{f.label}</label>
                        <input type={f.type} required={f.required} placeholder={f.placeholder}
                          value={form[f.id as keyof typeof form]}
                          onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                          style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: '#1A1A1A' }} />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A1A1A' }}>{isAr ? 'الخدمة المطلوبة' : 'Service Interested In'}</label>
                    <select value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                      style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: form.service ? '#1A1A1A' : '#9ca3af' }}>
                      <option value="">{isAr ? 'اختر خدمة...' : 'Select a service...'}</option>
                      {(isAr
                        ? ['تصميم جناح معرض', 'تنفيذ فعاليات', 'براند أكتيفيشن', 'تصنيع مخصص', 'هوية بصرية وجرافيك', 'دعم تقني', 'إدارة مشروع متكاملة']
                        : ['Exhibition Booth Design', 'Event Production', 'Brand Activations', 'Custom Fabrication', 'Branding & Graphics', 'Technical Support', 'Full Project Management']
                      ).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: '#1A1A1A' }}>{isAr ? 'رسالتك *' : 'Your Message *'}</label>
                    <textarea required rows={5} placeholder={isAr ? 'أخبرنا عن مشروعك — الحجم والموقع والجدول الزمني وأي متطلبات خاصة...' : 'Tell us about your project — size, location, timeline, and any specific requirements...'}
                      value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm transition-all resize-none"
                      style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', color: '#1A1A1A' }} />
                  </div>

                  <button type="submit" disabled={submitting}
                    className="group w-full flex items-center justify-center gap-3 text-white font-bold text-base py-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{ background: submitting ? '#aaa' : '#ED8214', boxShadow: submitting ? 'none' : '0 8px 24px rgba(244,163,0,0.3)' }}>
                    {submitting ? (
                      <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{isAr ? 'جاري الإرسال...' : 'Sending...'}</>
                    ) : (
                      <><Send className="h-5 w-5" />{isAr ? 'إرسال الرسالة' : 'Send Message'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                    )}
                  </button>
                </form>
              )}
            </Reveal>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <Reveal delay={120}>
              <SectionLabel text={isAr ? 'بيانات التواصل' : 'Contact Details'} />
              <h2 className="font-black mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#000' }}>{isAr ? 'تواصل معنا من أي مكان' : 'Find Us Anywhere'}</h2>

              {[
                { icon: MapPin, label: isAr ? 'عنوان المكتب' : 'Office Address', lines: [cmsAddress, isAr ? 'عمليات منطقة الشرق الأوسط' : 'MENA Region Operations'] },
                { icon: Phone, label: isAr ? 'أرقام الهاتف' : 'Phone Numbers', lines: phone2Contact ? [phoneContact, phone2Contact] : [phoneContact] },
                { icon: Mail, label: isAr ? 'البريد الإلكتروني' : 'Email Addresses', lines: [emailContact] },
                { icon: Clock, label: isAr ? 'ساعات العمل' : 'Business Hours', lines: isAr ? ['الأحد – الجمعة: 9 ص – 6 م', 'توقيت القاهرة (EET)'] : ['Mon–Sat: 9:00 AM – 6:00 PM', 'EET (Egypt Standard Time)'] },
              ].map((c, i) => (
                <div key={i} className="group flex items-start gap-4 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb' }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = '#ED8214'); (e.currentTarget.style.background = '#fffef9'); }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = '#e5e7eb'); (e.currentTarget.style.background = '#f9fafb'); }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                    style={{ background: 'rgba(244,163,0,0.1)', border: '1.5px solid rgba(244,163,0,0.25)' }}>
                    <c.icon className="h-4.5 w-4.5" style={{ color: '#ED8214' }} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: '#9ca3af' }}>{c.label}</div>
                    {c.lines.map((l, li) => <p key={li} className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{l}</p>)}
                  </div>
                </div>
              ))}
            </Reveal>

            {/* Social */}
            <Reveal delay={180}>
              <div className="p-6 rounded-xl" style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb' }}>
                <div className="text-[11px] font-bold tracking-widest uppercase mb-4" style={{ color: '#9ca3af' }}>{isAr ? 'تابعنا' : 'Follow Us'}</div>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: instagramUrl || '#', label: 'Instagram' },
                    { icon: Facebook, href: facebookUrl || '#', label: 'Facebook' },
                    { icon: Linkedin, href: linkedinUrl || '#', label: 'LinkedIn' },
                    { icon: MessageCircle, href: whatsappUrlContact, label: 'WhatsApp' },
                  ].map(s => (
                    <a key={s.label} href={s.href} aria-label={s.label}
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(244,163,0,0.1)', border: '1.5px solid rgba(244,163,0,0.2)' }}
                      onMouseEnter={e => { (e.currentTarget.style.background = '#ED8214'); }}
                      onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(244,163,0,0.1)'); }}>
                      <s.icon className="h-4 w-4" style={{ color: '#ED8214' }}
                        onMouseEnter={e => ((e.currentTarget as SVGSVGElement).style.color = '#fff')}
                        onMouseLeave={e => ((e.currentTarget as SVGSVGElement).style.color = '#ED8214')} />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ § 4 · FAQ — LIGHT GRAY ══ */}
      <section className="py-28 px-5 relative overflow-hidden" style={{ background: '#F2F2F2' }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #ED8214, transparent)' }} />

        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-12">
            <SectionLabel text={isAr ? 'إجابات سريعة' : 'Quick Answers'} />
            <h2 className="font-black" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#000' }}>{isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h2>
          </Reveal>

          <div className="space-y-4">
            {(isAr ? [
              { q: 'كم يستغرق تسليم جناح المعرض؟', a: 'يعتمد وقت التسليم على التعقيد. الأجنحة العادية تستغرق 3–4 أسابيع؛ الأجنحة المخصصة قد تستغرق 6–8 أسابيع. المشاريع العاجلة (1–2 أسابيع) ممكنة مع الإشعار المسبق.' },
              { q: 'هل تنفذون فعاليات خارج مصر؟', a: 'نعم! ننفذ مشاريع بانتظام في منطقة الشرق الأوسط بما يشمل الإمارات، السعودية، قطر، والكويت. نتولى كل الخدمات اللوجستية والشحن والتركيب في الموقع.' },
              { q: 'ما هو نطاق التكلفة المعتادة للأجنحة؟', a: 'التكاليف تختلف حسب الحجم والتعقيد والمواد. الأجنحة الأساسية تبدأ من $2,000؛ والأجنحة المخصصة الممتازة قد تتراوح من $10,000 إلى $50,000+. نقدم عروض أسعار تفصيلية بناءً على احتياجاتك.' },
              { q: 'هل يمكن إعادة استخدام الجناح في أكثر من فعالية؟', a: 'بالتأكيد! كل أجنحتنا مصممة للاستخدام المتكرر. نستخدم أنظمة معيارية يمكن إعادة تكوينها وإعادة تصميمها لفعاليات مختلفة.' },
              { q: 'هل توفرون خدمة تخزين وصيانة بعد الفعالية؟', a: 'نعم، نقدم باقات تخزين وصيانة للحفاظ على جناحك في أفضل حال بين الفعاليات، بما في ذلك التنظيف والإصلاحات والتحديثات.' },
            ] : [
              { q: 'How quickly can you deliver an exhibition booth?', a: 'Turnaround time depends on complexity. Standard booths take 3–4 weeks; custom builds may take 6–8 weeks. Rush projects (1–2 weeks) are possible with advance notice.' },
              { q: 'Do you handle international events outside Egypt?', a: 'Yes! We regularly deliver projects across the MENA region including UAE, Saudi Arabia, Qatar, and Kuwait. We manage all logistics, shipping, and on-site installation.' },
              { q: 'What is the typical cost range for exhibition booths?', a: 'Costs vary by size, complexity, and materials. Entry-level booths start from $2,000; premium custom builds can range from $10,000 to $50,000+. We provide detailed quotes based on your brief.' },
              { q: 'Can we reuse the booth for multiple events?', a: 'Absolutely! All our booths are designed for multi-use. We use modular systems that can be reconfigured and rebranded for different events, maximizing your investment.' },
              { q: 'Do you provide after-event storage and maintenance?', a: 'Yes, we offer storage and maintenance packages to keep your booth in perfect condition between events, including cleaning, repairs, and updates.' },
            ]).map((faq, i) => (
              <Reveal key={i} delay={i * 60}>
                <details className="group rounded-xl overflow-hidden" style={{ background: '#FFFFFF', border: '1.5px solid #e5e7eb' }}>
                  <summary className="flex items-center justify-between p-6 font-bold text-base cursor-pointer transition-colors group-open:text-[#ED8214]"
                    style={{ color: '#000', listStyle: 'none' }}>
                    {faq.q}
                    <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-open:rotate-90" style={{ color: '#ED8214' }} />
                  </summary>
                  <div className="px-6 pb-6 text-sm leading-relaxed" style={{ color: '#555', borderTop: '1px solid #f3f4f6', lineHeight: isAr ? '2' : '1.7' }}>
                    <div className="pt-4">{faq.a}</div>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 5 · CTA — DARK ══ */}
      <section className="relative py-24 px-5 overflow-hidden" style={{ background: '#1A1A1A' }}>
        <div className="absolute left-0 inset-y-0 w-[4px]" style={{ background: '#ED8214' }} />
        <Reveal className="relative max-w-3xl mx-auto text-center">
          <SectionLabel text={isAr ? 'ابدأ اليوم' : 'Start Today'} />
          <h2 className="font-black text-white leading-tight mb-5" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
            {isAr ? <>معرضك<br /><span style={{ color: '#ED8214' }}>في انتظارك</span></> : <>Your Exhibition<br /><span style={{ color: '#ED8214' }}>Awaits</span></>}
          </h2>
          <p className="text-base mb-9" style={{ color: '#9ca3af', lineHeight: isAr ? '2' : '1.7' }}>{isAr ? 'لا تفوّت فرصة فعالتك القادمة. تواصل معنا اليوم للحصول على استشارة مجانية.' : "Don't miss your next event opportunity. Contact us today for a free consultation."}</p>
          <a href={whatsappUrlContact} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-white font-bold text-lg px-10 py-5 rounded-full transition-all hover:scale-105"
            style={{ background: '#16a34a', boxShadow: '0 10px 30px rgba(22,163,74,0.3)' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
            onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}>
            <MessageCircle className="h-5 w-5" /> {isAr ? 'تواصل عبر WhatsApp' : 'Chat on WhatsApp'}
          </a>
        </Reveal>
      </section>

      <SharedFooter />
    </div>
  );
};

export default Contact;
