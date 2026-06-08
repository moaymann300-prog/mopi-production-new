import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard, Settings, Image, Globe, FileText, Briefcase,
  Users, MessageSquare, Star, BarChart2, LogIn, LogOut, Eye,
  EyeOff, Save, Plus, Trash2, Upload, X, Check,
  ChevronDown, ChevronRight, Menu, AlertCircle, Loader2,
  Instagram, Facebook, Youtube, Linkedin, Phone, Mail, MapPin,
  Hash, Link2, Layers, Zap, Award, Wrench, Palette, Package,
  Home, Info, Server, RefreshCw, ExternalLink, Type, PenLine,
  BookOpen, Megaphone, MessageCircle, ImageIcon, ToggleLeft, ToggleRight,
  MousePointerClick, AlignLeft, Heading, Layout, Camera,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface SiteSetting { id: number; key: string; value: string; label: string; group_name: string; }
interface SocialLink { id: number; platform: string; url: string; icon: string; is_active: boolean; sort_order: number; }
interface Logo { id: number; name: string; placement: string; url: string; alt_text: string; is_active: boolean; }
interface HeroSection { id: number; page: string; badge_text: string; heading: string; subheading: string; cta_primary_label: string; cta_primary_url: string; cta_secondary_label: string; cta_secondary_url: string; bg_image_url: string; }
interface Stat { id: number; label: string; value: number; suffix: string; sort_order: number; is_active: boolean; }
interface Service { id: number; title: string; subtitle: string; description: string; icon: string; image_url: string; sort_order: number; is_active: boolean; is_featured: boolean; }
interface Portfolio { id: number; title: string; category: string; client: string; location: string; project_date: string; visitors: string; description: string; image_url: string; award: string; is_featured: boolean; is_active: boolean; sort_order: number; }
interface TeamMember { id: number; name: string; role: string; bio: string; image_url: string; email: string; linkedin_url: string; sort_order: number; is_active: boolean; }
interface Testimonial { id: number; author_name: string; author_role: string; company: string; quote: string; rating: number; image_url: string; is_active: boolean; sort_order: number; }
interface MediaItem { id: number; filename: string; url: string; alt_text: string; category: string; uploaded_at: string; }
interface AboutContent { id: number; section: string; title: string; content: string; image_url: string; }
interface ContactSubmission { id: number; name: string; email: string; phone: string; company: string; service: string; message: string; status: string; created_at: string; }
interface QuoteRequest { id: number; company_name: string; email: string; phone: string; exhibition_name: string; exhibition_date: string; exhibition_venue: string; stand_dimension: string; layout: string; flooring: string; platform: string; meeting_room: string; double_deck: string; storage_room: string; required_items: string[]; floor_plan_url: string; brand_guidelines_url: string; message: string; status: string; internal_notes: string; created_at: string; }
interface PageContent { id: number; page: string; section: string; field: string; value_en: string; value_ar: string; }
interface PageImage { id: number; page: string; section: string; image_key: string; image_url: string; alt_en: string; alt_ar: string; sort_order: number; }

interface ClientLogoItem {
  id: number;
  name: string;
  logo_url: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

type Section =
  | 'dashboard'
  | 'page-home' | 'page-about' | 'page-services' | 'page-portfolio' | 'page-contact'
  | 'site-settings' | 'social-links' | 'logos' | 'hero-sections'
  | 'stats' | 'services' | 'portfolio' | 'team' | 'testimonials' | 'media' | 'about' | 'inbox'
  | 'clients-management';

// ─── Micro Components ─────────────────────────────────────────────────────────

const Toast = ({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all"
    style={{ background: type === 'success' ? '#064e3b' : '#7f1d1d', border: `1px solid ${type === 'success' ? '#10b981' : '#ef4444'}`, color: type === 'success' ? '#a7f3d0' : '#fca5a5', animation: 'fadeUp 0.3s ease' }}>
    {type === 'success' ? <Check className="h-4 w-4 shrink-0" style={{ color: '#10b981' }} /> : <AlertCircle className="h-4 w-4 shrink-0" style={{ color: '#ef4444' }} />}
    {msg}
    <button onClick={onClose} className="ml-2" style={{ color: '#6b7280' }}><X className="h-3.5 w-3.5" /></button>
  </div>
);

const ImageUploader = ({
  currentUrl, onUploaded, label = 'Click or drag to upload photo', folder = 'general', compact = false, size = 'md'
}: {
  currentUrl?: string; onUploaded: (url: string) => void;
  label?: string; folder?: string; compact?: boolean; size?: 'sm' | 'md' | 'lg';
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPreview(currentUrl || ''); }, [currentUrl]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const filename = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('cms-media').upload(filename, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('cms-media').getPublicUrl(filename);
      setPreview(data.publicUrl);
      onUploaded(data.publicUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => { const url = e.target?.result as string; setPreview(url); onUploaded(url); };
      reader.readAsDataURL(file);
    }
    setUploading(false);
  };

  const heights = { sm: 'h-20', md: 'h-32', lg: 'h-48' };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl overflow-hidden border-2 border-dashed transition-all hover:border-[#ED8214] group ${heights[size]}`}
        style={{ borderColor: preview ? '#ED8214' : '#374151', background: '#0a0e1a' }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 h-full">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(237,130,20,0.1)' }}>
              <Camera className="h-5 w-5" style={{ color: '#ED8214' }} />
            </div>
            <span className="text-xs text-center px-4 font-medium" style={{ color: '#6b7280' }}>{label}</span>
            <span className="text-[10px]" style={{ color: '#374151' }}>JPG, PNG, WEBP up to 10MB</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: 'rgba(0,0,0,0.8)' }}>
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#ED8214' }} />
            <span className="text-xs text-white">Uploading...</span>
          </div>
        )}
        {preview && !uploading && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold" style={{ background: '#ED8214', color: '#000' }}>
              <Upload className="h-3 w-3" />Change Photo
            </span>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      {preview && (
        <div className="mt-2 flex gap-2 items-center">
          <div className="flex-1 flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <Check className="h-3.5 w-3.5 shrink-0" style={{ color: '#10b981' }} />
            <span style={{ color: '#9ca3af' }} className="truncate">Photo uploaded successfully</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setPreview(''); onUploaded(''); }}
            className="p-1.5 rounded-lg hover:bg-red-900/20 shrink-0 transition-colors" style={{ color: '#ef4444', border: '1px solid #374151' }}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, color = '#ED8214', children, defaultOpen = false, badge }: {
  title: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color?: string; children: React.ReactNode; defaultOpen?: boolean; badge?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl overflow-hidden mb-4" style={{ background: '#111827', border: `1px solid ${open ? color + '33' : '#1f2937'}`, transition: 'border-color 0.2s' }}>
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center justify-between px-5 py-4 text-left group">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
          <div>
            <span className="font-bold text-sm text-white group-hover:text-[#ED8214] transition-colors">{title}</span>
            {badge && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${color}20`, color }}>{badge}</span>}
          </div>
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform" style={{ color: '#4b5563', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div className="px-5 pb-5" style={{ borderTop: `1px solid #1f2937` }}>
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children, hint, required }: { label: string; children: React.ReactNode; hint?: string; required?: boolean }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: '#9ca3af' }}>
      {label}{required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] mt-1.5" style={{ color: '#4b5563' }}>{hint}</p>}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full px-3 py-2.5 rounded-lg text-sm transition-all outline-none ${props.className || ''}`}
    style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6', ...props.style }}
    onFocus={e => { e.currentTarget.style.borderColor = '#ED8214'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(237,130,20,0.08)'; }}
    onBlur={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.boxShadow = 'none'; }} />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`w-full px-3 py-2.5 rounded-lg text-sm resize-none transition-all outline-none ${props.className || ''}`}
    style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6', ...props.style }}
    onFocus={e => { e.currentTarget.style.borderColor = '#ED8214'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(237,130,20,0.08)'; }}
    onBlur={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.boxShadow = 'none'; }} />
);

const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) => (
  <div className="flex items-center gap-2">
    <button onClick={() => onChange(!checked)} className="flex items-center gap-2 transition-all">
      <div className="w-10 h-5 rounded-full relative transition-colors" style={{ background: checked ? '#ED8214' : '#374151' }}>
        <div className="absolute top-0.5 transition-all w-4 h-4 rounded-full bg-white shadow" style={{ left: checked ? '22px' : '2px' }} />
      </div>
    </button>
    {label && <span className="text-xs font-medium" style={{ color: checked ? '#ED8214' : '#6b7280' }}>{label}</span>}
  </div>
);

const BilingualField = ({
  label, valueEn, valueAr, onChangeEn, onChangeAr, multiline = false, rows = 2, hint
}: {
  label: string; valueEn: string; valueAr: string;
  onChangeEn: (v: string) => void; onChangeAr: (v: string) => void;
  multiline?: boolean; rows?: number; hint?: string;
}) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-bold mb-2.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>
      {label}
    </label>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>🇬🇧 English</span>
        </div>
        {multiline
          ? <Textarea value={valueEn} onChange={e => onChangeEn(e.target.value)} rows={rows} placeholder="English text..." />
          : <Input value={valueEn} onChange={e => onChangeEn(e.target.value)} placeholder="English text..." />}
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(237,130,20,0.15)', color: '#ED8214' }}>🇸🇦 Arabic</span>
        </div>
        {multiline
          ? <Textarea value={valueAr} onChange={e => onChangeAr(e.target.value)} rows={rows} dir="rtl" placeholder="النص العربي..." style={{ fontFamily: "'Cairo', sans-serif" }} />
          : <Input value={valueAr} onChange={e => onChangeAr(e.target.value)} dir="rtl" placeholder="النص العربي..." style={{ fontFamily: "'Cairo', sans-serif" }} />}
      </div>
    </div>
    {hint && <p className="text-[11px] mt-1.5" style={{ color: '#4b5563' }}>{hint}</p>}
  </div>
);

const SaveBtn = ({ onClick, saving, label = 'Save Changes' }: { onClick: () => void; saving: boolean; label?: string }) => (
  <button onClick={onClick} disabled={saving}
    className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-black transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
    style={{ background: '#ED8214', boxShadow: '0 4px 14px rgba(237,130,20,0.25)' }}>
    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
    {saving ? 'Saving...' : label}
  </button>
);

const Divider = ({ label }: { label?: string }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px" style={{ background: '#1f2937' }} />
    {label && <span className="text-[10px] font-bold uppercase tracking-widest shrink-0" style={{ color: '#374151' }}>{label}</span>}
    <div className="flex-1 h-px" style={{ background: '#1f2937' }} />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [section, setSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [inboxNote, setInboxNote] = useState<Record<number, string>>({});
  const [inboxTabState, setInboxTabState] = useState<'quotes'|'contacts'>('quotes');
  const [clientLogosDB, setClientLogosDB] = useState<ClientLogoItem[]>([]);
  const [newClientName, setNewClientName] = useState('');
  const [newClientUrl, setNewClientUrl] = useState('');
  const [clientLogoPreview, setClientLogoPreview] = useState('');

  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [logos, setLogos] = useState<Logo[]>([]);
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent[]>([]);
  const [inbox, setInbox] = useState<ContactSubmission[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [pageImages, setPageImages] = useState<PageImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true); setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPwd });
    if (error) { setLoginError(error.message); } else { setAuthed(true); }
    setLoginLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) setAuthed(true); });
    supabase.auth.onAuthStateChange((_, session) => { setAuthed(!!session); });
  }, []);

  const fetchAll = useCallback(async () => {
    const [s, sl, lg, h, st, sv, pf, tm, ts, md, ab, ib, pc, pi, qr, cl] = await Promise.all([
      supabase.from('cms_site_settings_2026_04_21').select('*').order('group_name').order('id'),
      supabase.from('cms_social_links_2026_04_21').select('*').order('sort_order'),
      supabase.from('cms_logos_2026_04_21').select('*').order('id'),
      supabase.from('cms_hero_sections_2026_04_21').select('*').order('id'),
      supabase.from('cms_stats_2026_04_21').select('*').order('sort_order'),
      supabase.from('cms_services_2026_04_21').select('*').order('sort_order'),
      supabase.from('cms_portfolio_2026_04_21').select('*').order('sort_order'),
      supabase.from('cms_team_2026_04_21').select('*').order('sort_order'),
      supabase.from('cms_testimonials_2026_04_21').select('*').order('sort_order'),
      supabase.from('cms_media_2026_04_21').select('*').order('uploaded_at', { ascending: false }),
      supabase.from('cms_about_content_2026_04_21').select('*').order('id'),
      supabase.from('cms_contact_submissions_2026_04_21').select('*').order('created_at', { ascending: false }),
      supabase.from('cms_page_content_2026_06_01').select('*').order('page').order('section').order('field'),
      supabase.from('cms_page_images_2026_06_01').select('*').order('page').order('sort_order'),
      supabase.from('quote_requests_2026_06_04').select('*').order('created_at', { ascending: false }),
      supabase.from('cms_client_logos_2026_06_08').select('*').order('sort_order'),
    ]);
    if (s.data) setSettings(s.data);
    if (sl.data) setSocials(sl.data);
    if (lg.data) setLogos(lg.data);
    if (h.data) setHeroes(h.data);
    if (st.data) setStats(st.data);
    if (sv.data) setServices(sv.data);
    if (pf.data) setPortfolio(pf.data);
    if (tm.data) setTeam(tm.data);
    if (ts.data) setTestimonials(ts.data);
    if (md.data) setMedia(md.data);
    if (ab.data) setAboutContent(ab.data);
    if (ib.data) setInbox(ib.data);
    if (pc.data) setPageContent(pc.data);
    if (pi.data) setPageImages(pi.data);
    if (qr.data) setQuoteRequests(qr.data);
    if (cl.data) setClientLogosDB(cl.data);
    setLoaded(true);
  }, []);

  useEffect(() => { if (authed) fetchAll(); }, [authed, fetchAll]);

  const logout = async () => { await supabase.auth.signOut(); setAuthed(false); };

  // ── Save Handlers ──
  const saveSetting = async (item: SiteSetting) => {
    setSaving(true);
    const { error } = await supabase.from('cms_site_settings_2026_04_21').update({ value: item.value, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error'); else notify('Saved!');
    setSaving(false);
  };

  const saveSocial = async (item: SocialLink) => {
    const { error } = item.id
      ? await supabase.from('cms_social_links_2026_04_21').update({ url: item.url, is_active: item.is_active, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_social_links_2026_04_21').insert([{ platform: item.platform, url: item.url, icon: item.icon, is_active: item.is_active, sort_order: item.sort_order }]);
    if (error) notify('Save failed: ' + error.message, 'error'); else { notify('Saved!'); fetchAll(); }
  };

  const saveLogo = async (item: Logo) => {
    const { error } = await supabase.from('cms_logos_2026_04_21').update({ url: item.url, alt_text: item.alt_text, is_active: item.is_active, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error'); else notify('Logo updated!');
  };

  const saveHero = async (item: HeroSection) => {
    setSaving(true);
    const { error } = await supabase.from('cms_hero_sections_2026_04_21').update({ badge_text: item.badge_text, heading: item.heading, subheading: item.subheading, cta_primary_label: item.cta_primary_label, cta_primary_url: item.cta_primary_url, cta_secondary_label: item.cta_secondary_label, cta_secondary_url: item.cta_secondary_url, bg_image_url: item.bg_image_url, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error'); else notify('Hero saved!');
    setSaving(false);
  };

  const saveStat = async (item: Stat) => {
    const payload = { label: item.label, value: item.value, suffix: item.suffix, is_active: item.is_active, sort_order: item.sort_order };
    const { error } = item.id
      ? await supabase.from('cms_stats_2026_04_21').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_stats_2026_04_21').insert([payload]);
    if (error) notify('Save failed: ' + error.message, 'error'); else { notify('Stat saved!'); fetchAll(); }
  };
  const deleteStat = async (id: number) => {
    if (!confirm('Delete this stat?')) return;
    await supabase.from('cms_stats_2026_04_21').delete().eq('id', id);
    notify('Deleted!'); fetchAll();
  };

  const saveService = async (item: Service) => {
    const payload = { title: item.title, subtitle: item.subtitle, description: item.description, icon: item.icon, image_url: item.image_url, sort_order: item.sort_order, is_active: item.is_active, is_featured: item.is_featured };
    const { error } = item.id
      ? await supabase.from('cms_services_2026_04_21').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_services_2026_04_21').insert([payload]);
    if (error) notify('Save failed: ' + error.message, 'error'); else { notify('Service saved!'); fetchAll(); }
  };
  const deleteService = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('cms_services_2026_04_21').delete().eq('id', id);
    notify('Deleted!'); fetchAll();
  };

  const savePortfolio = async (item: Portfolio) => {
    const payload = { title: item.title, category: item.category, client: item.client, location: item.location, project_date: item.project_date, visitors: item.visitors, description: item.description, image_url: item.image_url, award: item.award, is_featured: item.is_featured, is_active: item.is_active, sort_order: item.sort_order };
    const { error } = item.id
      ? await supabase.from('cms_portfolio_2026_04_21').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_portfolio_2026_04_21').insert([payload]);
    if (error) notify('Save failed: ' + error.message, 'error'); else { notify('Project saved!'); fetchAll(); }
  };
  const deletePortfolio = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('cms_portfolio_2026_04_21').delete().eq('id', id);
    notify('Deleted!'); fetchAll();
  };

  const saveTeam = async (item: TeamMember) => {
    const payload = { name: item.name, role: item.role, bio: item.bio, image_url: item.image_url, email: item.email, linkedin_url: item.linkedin_url, sort_order: item.sort_order, is_active: item.is_active };
    const { error } = item.id
      ? await supabase.from('cms_team_2026_04_21').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_team_2026_04_21').insert([payload]);
    if (error) notify('Save failed: ' + error.message, 'error'); else { notify('Saved!'); fetchAll(); }
  };
  const deleteTeam = async (id: number) => {
    if (!confirm('Delete this team member?')) return;
    await supabase.from('cms_team_2026_04_21').delete().eq('id', id);
    notify('Deleted!'); fetchAll();
  };

  const saveTestimonial = async (item: Testimonial) => {
    const payload = { author_name: item.author_name, author_role: item.author_role, company: item.company, quote: item.quote, rating: item.rating, image_url: item.image_url, is_active: item.is_active, sort_order: item.sort_order };
    const { error } = item.id
      ? await supabase.from('cms_testimonials_2026_04_21').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_testimonials_2026_04_21').insert([payload]);
    if (error) notify('Save failed: ' + error.message, 'error'); else { notify('Saved!'); fetchAll(); }
  };
  const deleteTestimonial = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('cms_testimonials_2026_04_21').delete().eq('id', id);
    notify('Deleted!'); fetchAll();
  };

  const saveAbout = async (item: AboutContent) => {
    const { error } = await supabase.from('cms_about_content_2026_04_21').update({ title: item.title, content: item.content, image_url: item.image_url, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error'); else notify('Saved!');
  };

  const updateInboxStatus = async (id: number, status: string) => {
    // Update in DB
    await supabase.from('cms_contact_submissions_2026_04_21').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    // Update locally only — NO fetchAll() so the open message stays open
    setInbox(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    notify('Status updated!');
  };
  const deleteInbox = async (id: number) => {
    await supabase.from('cms_contact_submissions_2026_04_21').delete().eq('id', id);
    // Update locally only — NO fetchAll()
    setInbox(prev => prev.filter(m => m.id !== id));
    if (selectedMessageId === id) setSelectedMessageId(null);
    notify('Message deleted!');
  };

  const updateQuoteStatus = async (id: number, status: string) => {
    await supabase.from('quote_requests_2026_06_04').update({ status }).eq('id', id);
    setQuoteRequests(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    notify('Status updated!');
  };
  const deleteQuoteRequest = async (id: number) => {
    await supabase.from('quote_requests_2026_06_04').delete().eq('id', id);
    setQuoteRequests(prev => prev.filter(q => q.id !== id));
    if (selectedMessageId === id) setSelectedMessageId(null);
    notify('Quote request deleted!');
  };

  // ─── Client Logos CRUD ───────────────────────────────────────────────────
  const addClientLogo = async () => {
    if (!newClientName.trim()) { notify('Please enter a client name', 'error'); return; }
    setSaving(true);
    const nextOrder = clientLogosDB.length > 0 ? Math.max(...clientLogosDB.map(c => c.sort_order)) + 1 : 1;
    const { data, error } = await supabase
      .from('cms_client_logos_2026_06_08')
      .insert([{ name: newClientName.trim(), logo_url: newClientUrl, sort_order: nextOrder, is_active: true }])
      .select()
      .single();
    if (error) { notify('Failed to add client: ' + error.message, 'error'); }
    else {
      setClientLogosDB(prev => [...prev, data]);
      setNewClientName('');
      setNewClientUrl('');
      setClientLogoPreview('');
      notify('✅ Client logo added!');
    }
    setSaving(false);
  };

  const updateClientLogo = async (item: ClientLogoItem) => {
    const { error } = await supabase
      .from('cms_client_logos_2026_06_08')
      .update({ name: item.name, logo_url: item.logo_url, sort_order: item.sort_order, is_active: item.is_active, updated_at: new Date().toISOString() })
      .eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error');
    else notify('✅ Logo saved!');
  };

  const deleteClientLogo = async (id: number) => {
    if (!confirm('Delete this client logo?')) return;
    const { error } = await supabase.from('cms_client_logos_2026_06_08').delete().eq('id', id);
    if (error) { notify('Delete failed: ' + error.message, 'error'); return; }
    setClientLogosDB(prev => prev.filter(c => c.id !== id));
    notify('✔ Logo deleted!');
  };

  const moveClientLogo = async (id: number, dir: 'up' | 'down') => {
    const sorted = [...clientLogosDB].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex(c => c.id === id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const current = sorted[idx];
    const swapWith = sorted[swapIdx];
    const newOrder1 = swapWith.sort_order;
    const newOrder2 = current.sort_order;
    await Promise.all([
      supabase.from('cms_client_logos_2026_06_08').update({ sort_order: newOrder1 }).eq('id', current.id),
      supabase.from('cms_client_logos_2026_06_08').update({ sort_order: newOrder2 }).eq('id', swapWith.id),
    ]);
    setClientLogosDB(prev => prev.map(c => {
      if (c.id === current.id) return { ...c, sort_order: newOrder1 };
      if (c.id === swapWith.id) return { ...c, sort_order: newOrder2 };
      return c;
    }));
  };
  // ────────────────────────────────────────────────────────────────────

  const handleMediaUpload = async (file: File) => {
    try {
      const ext = file.name.split('.').pop();
      const filename = `media/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage.from('cms-media').upload(filename, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('cms-media').getPublicUrl(filename);
      await supabase.from('cms_media_2026_04_21').insert([{ filename: file.name, url: data.publicUrl, alt_text: file.name.replace(`.${ext}`, ''), category: 'general', file_type: 'image', file_size: file.size }]);
      notify('Image uploaded!'); fetchAll();
    } catch { notify('Upload failed', 'error'); }
  };
  const deleteMedia = async (item: MediaItem) => {
    if (!confirm('Delete this image?')) return;
    await supabase.from('cms_media_2026_04_21').delete().eq('id', item.id);
    notify('Deleted!'); fetchAll();
  };

  const savePageContentBulk = async (items: PageContent[]) => {
    setSaving(true);
    let hasError = false;
    for (const item of items) {
      const { error } = await supabase.from('cms_page_content_2026_06_01')
        .update({ value_en: item.value_en, value_ar: item.value_ar, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      if (error) hasError = true;
    }
    if (hasError) notify('Some items failed to save', 'error'); else notify('All content saved! ✓');
    setSaving(false);
  };

  const savePageImage = async (item: PageImage) => {
    setSaving(true);
    if (item.id) {
      // Record exists — update
      const { error } = await supabase.from('cms_page_images_2026_06_01')
        .update({ image_url: item.image_url, alt_en: item.alt_en, alt_ar: item.alt_ar })
        .eq('id', item.id);
      if (error) notify('Save failed: ' + error.message, 'error'); else notify('Image saved! ✓');
    } else {
      // Record does not exist — insert
      const { data, error } = await supabase.from('cms_page_images_2026_06_01')
        .insert({ page: item.page, section: item.section, image_key: item.image_key, image_url: item.image_url, alt_en: item.alt_en || '', alt_ar: item.alt_ar || '', sort_order: item.sort_order ?? 0 })
        .select().single();
      if (error) { notify('Save failed: ' + error.message, 'error'); }
      else if (data) {
        // Update local state with the new id
        setPageImages(prev => [...prev.filter(p => !(p.page === item.page && p.section === item.section && p.image_key === item.image_key)), data as PageImage]);
        notify('Image saved! ✓');
      }
    }
    setSaving(false);
  };

  const getPC = (page: string, sec: string, field: string) =>
    pageContent.find(p => p.page === page && p.section === sec && p.field === field);

  const updatePC = (id: number, en: string, ar: string) => {
    setPageContent(prev => prev.map(p => p.id === id ? { ...p, value_en: en, value_ar: ar } : p));
  };

  const getPI = (page: string, sec: string, key: string) =>
    pageImages.find(p => p.page === page && p.section === sec && p.image_key === key);

  const updatePI = (id: number, url: string) => {
    setPageImages(prev => prev.map(p => p.id === id ? { ...p, image_url: url } : p));
  };

  // Helper: render a full page section with fields + images
  const PageSection = ({
    pageName, sectionName, sectionLabel, icon: Icon, color = '#ED8214', defaultOpen = false,
    fields, imageKeys, badge
  }: {
    pageName: string; sectionName: string; sectionLabel: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    color?: string; defaultOpen?: boolean;
    fields: { field: string; label: string; multiline?: boolean; rows?: number; hint?: string }[];
    imageKeys?: { key: string; label: string; size?: 'sm' | 'md' | 'lg' }[];
    badge?: string;
  }) => {
    const sectionItems = fields.map(f => getPC(pageName, sectionName, f.field)).filter(Boolean) as PageContent[];
    return (
      <SectionCard title={sectionLabel} icon={Icon} color={color} defaultOpen={defaultOpen} badge={badge}>
        <div className="space-y-5">
          {/* Text Fields */}
          {fields.map(f => {
            const item = getPC(pageName, sectionName, f.field);
            if (!item) return null;
            return (
              <BilingualField
                key={f.field}
                label={f.label}
                valueEn={item.value_en}
                valueAr={item.value_ar}
                onChangeEn={v => updatePC(item.id, v, item.value_ar)}
                onChangeAr={v => updatePC(item.id, item.value_en, v)}
                multiline={f.multiline}
                rows={f.rows}
                hint={f.hint}
              />
            );
          })}

          {/* Image Uploads */}
          {imageKeys && imageKeys.length > 0 && (
            <>
              <Divider label="Photos" />
              <div className={`grid gap-4 ${imageKeys.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {imageKeys.map(ik => {
                  // Use existing DB record OR create a phantom object so the uploader always shows
                  const imgItem: PageImage = getPI(pageName, sectionName, ik.key) ?? {
                    id: 0,
                    page: pageName,
                    section: sectionName,
                    image_key: ik.key,
                    image_url: '',
                    alt_en: ik.label,
                    alt_ar: ik.label,
                    sort_order: 0,
                  };
                  return (
                    <div key={ik.key}>
                      <Field label={ik.label}>
                        <ImageUploader
                          currentUrl={imgItem.image_url}
                          onUploaded={url => {
                            if (imgItem.id) updatePI(imgItem.id, url);
                            savePageImage({ ...imgItem, image_url: url });
                          }}
                          folder={`pages/${pageName}`}
                          label={`Upload ${ik.label}`}
                          size={ik.size || 'md'}
                        />
                      </Field>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <SaveBtn onClick={() => savePageContentBulk(sectionItems)} saving={saving} label="Save Section" />
          </div>
        </div>
      </SectionCard>
    );
  };

  // ── LOGIN ──
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #000 0%, #0a0a0a 50%, #111 100%)', fontFamily: "'Inter', sans-serif" }}>
        <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
        <div className="w-full max-w-sm" style={{ animation: 'fadeUp 0.5s ease' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden" style={{ background: 'rgba(237,130,20,0.1)', border: '1px solid rgba(237,130,20,0.2)' }}>
              <img src="/images/mopi_logo_20260101_112924.png" alt="MOPi" className="h-10 w-auto object-contain" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Admin Dashboard</h1>
            <p className="text-sm" style={{ color: '#6b7280' }}>Sign in to manage your website content</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 p-7 rounded-2xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <Field label="Email">
              <Input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="admin@mopiproduction.com" required />
            </Field>
            <Field label="Password">
              <div className="relative">
                <Input type={showPwd ? 'text' : 'password'} value={loginPwd} onChange={e => setLoginPwd(e.target.value)} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }}>
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            {loginError && <p className="text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-2" style={{ background: 'rgba(220,38,38,0.08)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.15)' }}><AlertCircle className="h-3.5 w-3.5" />{loginError}</p>}
            <button type="submit" disabled={loginLoading}
              className="w-full py-3 rounded-xl text-black font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{ background: '#ED8214', boxShadow: '0 8px 24px rgba(237,130,20,0.3)' }}>
              {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-xs mt-3">
              <Link to="/" className="hover:text-white transition-colors" style={{ color: '#6b7280' }}>← Back to Website</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }

  const unreadCount = inbox.filter(m => m.status === 'new').length + quoteRequests.filter(q => q.status === 'new').length;

  // ── SIDEBAR ──
  const navGroups = [
    {
      label: 'Overview',
      items: [{ id: 'dashboard' as Section, icon: LayoutDashboard, label: 'Dashboard' }]
    },
    {
      label: 'Pages',
      items: [
        { id: 'page-home' as Section, icon: Home, label: 'Home Page' },
        { id: 'page-about' as Section, icon: Info, label: 'About Page' },
        { id: 'page-services' as Section, icon: Briefcase, label: 'Services Page' },
        { id: 'page-portfolio' as Section, icon: Layers, label: 'Portfolio Page' },
        { id: 'page-contact' as Section, icon: MessageCircle, label: 'Contact Page' },
      ]
    },
    {
      label: 'Content',
      items: [
        { id: 'clients-management' as Section, icon: Users, label: 'Client Logos ✨', color: '#ED8214' },
        { id: 'services' as Section, icon: Wrench, label: 'Services Cards' },
        { id: 'portfolio' as Section, icon: Palette, label: 'Portfolio Projects' },
        { id: 'team' as Section, icon: Users, label: 'Team Members' },
        { id: 'testimonials' as Section, icon: Star, label: 'Testimonials' },
        { id: 'stats' as Section, icon: BarChart2, label: 'Stats & Numbers' },
      ]
    },
    {
      label: 'Global',
      items: [
        { id: 'site-settings' as Section, icon: Settings, label: 'Site Settings' },
        { id: 'logos' as Section, icon: ImageIcon, label: 'Logos & Favicon' },
        { id: 'social-links' as Section, icon: Globe, label: 'Social Media' },
        { id: 'media' as Section, icon: Image, label: 'Media Library' },
        { id: 'inbox' as Section, icon: MessageSquare, label: `Inbox${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
      ]
    },
  ];

  // ── DASHBOARD ──
  const renderDashboard = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Welcome back 👋</h1>
        <p className="text-sm" style={{ color: '#6b7280' }}>Manage every aspect of your MOPI Production website from here.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Services', count: services.length, icon: Wrench, color: '#3b82f6', id: 'services' as Section },
          { label: 'Projects', count: portfolio.length, icon: Layers, color: '#8b5cf6', id: 'portfolio' as Section },
          { label: 'Team', count: team.length, icon: Users, color: '#10b981', id: 'team' as Section },
          { label: 'New Messages', count: unreadCount, icon: MessageSquare, color: '#ED8214', id: 'inbox' as Section },
        ].map(c => (
          <button key={c.label} onClick={() => setSection(c.id)}
            className="p-5 rounded-2xl text-left transition-all hover:scale-[1.02] group"
            style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${c.color}15` }}>
                <c.icon className="h-5 w-5" style={{ color: c.color }} />
              </div>
              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: c.color }} />
            </div>
            <div className="text-3xl font-black mb-1" style={{ color: c.color, fontFamily: "'Poppins', sans-serif" }}>{c.count}</div>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6b7280' }}>{c.label}</div>
          </button>
        ))}
      </div>

      {/* Page Editors */}
      <div className="mb-6">
        <h2 className="text-xs font-black uppercase tracking-[0.25em] mb-4" style={{ color: '#374151' }}>Edit Pages</h2>
        <div className="grid md:grid-cols-5 gap-3">
          {[
            { id: 'page-home' as Section, label: 'Home', icon: Home, color: '#ED8214', desc: 'Hero, About, Services, CTA, Footer' },
            { id: 'page-about' as Section, label: 'About', icon: Info, color: '#3b82f6', desc: 'Story, Mission, Values, Team' },
            { id: 'page-services' as Section, label: 'Services', icon: Briefcase, color: '#8b5cf6', desc: 'Hero, Service cards, CTA' },
            { id: 'page-portfolio' as Section, label: 'Portfolio', icon: Layers, color: '#10b981', desc: 'Hero, Projects, Stats' },
            { id: 'page-contact' as Section, label: 'Contact', icon: MessageCircle, color: '#f43f5e', desc: 'Hero, Form, Info labels' },
          ].map(p => (
            <button key={p.id} onClick={() => setSection(p.id)}
              className="p-4 rounded-2xl text-left transition-all hover:scale-[1.02] group"
              style={{ background: '#111827', border: '1px solid #1f2937' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${p.color}15` }}>
                <p.icon className="h-5 w-5" style={{ color: p.color }} />
              </div>
              <p className="font-black text-sm text-white group-hover:text-[#ED8214] transition-colors">{p.label}</p>
              <p className="text-[10px] mt-1 leading-relaxed" style={{ color: '#4b5563' }}>{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Client Logos Quick Access */}
      <div className="mb-6">
        <button onClick={() => setSection('clients-management')}
          className="w-full p-5 rounded-2xl text-left transition-all hover:scale-[1.01] group flex items-center justify-between"
          style={{ background: 'rgba(237,130,20,0.05)', border: '1px solid rgba(237,130,20,0.2)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(237,130,20,0.1)' }}>
              <Users className="h-6 w-6" style={{ color: '#ED8214' }} />
            </div>
            <div>
              <p className="font-black text-white group-hover:text-[#ED8214] transition-colors">✨ Client Logos Management</p>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{clientLogosDB.filter(c => c.is_active).length} active • {clientLogosDB.length} total — Upload, reorder, enable/disable logos in the homepage marquee</p>
            </div>
          </div>
          <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" style={{ color: '#ED8214' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Recent Messages + Quick Links */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2"><MessageSquare className="h-4 w-4" style={{ color: '#ED8214' }} />Recent Messages</h3>
            <button onClick={() => setSection('inbox')} className="text-xs font-bold hover:text-white transition-colors" style={{ color: '#ED8214' }}>View all →</button>
          </div>
          {inbox.slice(0, 5).map(m => (
            <div key={m.id} className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid #1f2937' }}>
              <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: m.status === 'new' ? '#ED8214' : '#374151' }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">{m.name}</p>
                  {m.status === 'new' && <span className="text-[9px] font-black px-1.5 py-0.5 rounded shrink-0" style={{ background: 'rgba(237,130,20,0.15)', color: '#ED8214' }}>NEW</span>}
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color: '#6b7280' }}>{m.email}</p>
                <p className="text-xs truncate" style={{ color: '#4b5563' }}>{m.message?.slice(0, 60)}...</p>
              </div>
              <span className="text-[10px] shrink-0" style={{ color: '#374151' }}>{new Date(m.created_at).toLocaleDateString()}</span>
            </div>
          ))}
          {inbox.length === 0 && <p className="text-sm py-4 text-center" style={{ color: '#4b5563' }}>No messages yet.</p>}
        </div>
        <div className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
          <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-4"><ExternalLink className="h-4 w-4" style={{ color: '#ED8214' }} />Preview Pages</h3>
          <div className="space-y-2">
            {[
              { label: '🏠 Homepage', url: '/' },
              { label: '👥 About Page', url: '/about' },
              { label: '⚙️ Services Page', url: '/services' },
              { label: '🖼️ Portfolio Page', url: '/portfolio' },
              { label: '📞 Contact Page', url: '/contact' },
            ].map(l => (
              <Link key={l.url} to={l.url} target="_blank"
                className="flex items-center justify-between text-sm px-3 py-2.5 rounded-xl transition-all hover:text-[#ED8214] group"
                style={{ color: '#9ca3af', background: '#0f172a' }}>
                <span>{l.label}</span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── HOME PAGE ──
  const renderPageHome = () => (
    <div>
      <PageHeader
        title="Home Page"
        subtitle="Edit every section of the homepage — texts, images, buttons, all in English & Arabic"
        icon={Home} color="#ED8214"
        page="home" liveUrl="/"
      />

      {/* Hero Section */}
      <PageSection
        pageName="home" sectionName="hero" sectionLabel="🚀 Hero Section — Top Banner"
        icon={Megaphone} color="#ED8214" defaultOpen={true}
        badge="Background Image + Text"
        fields={[
          { field: 'badge', label: 'Badge Text (top label)', hint: 'Short label shown above the main headline' },
          { field: 'line1', label: 'Headline — Line 1', hint: 'First line of the big hero headline' },
          { field: 'line2', label: 'Headline — Line 2', hint: 'Second line of the big hero headline' },
          { field: 'subtitle', label: 'Subtitle / Tagline', hint: 'Short description below the headline' },
          { field: 'cta_primary', label: 'Primary Button Text', hint: 'Main CTA button (e.g. "Get a Quote")' },
          { field: 'cta_secondary', label: 'Secondary Button Text', hint: 'Second button (e.g. "View Our Work")' },
        ]}
        imageKeys={[{ key: 'background', label: 'Hero Background Photo', size: 'lg' }]}
      />

      {/* About Section */}
      <PageSection
        pageName="home" sectionName="about" sectionLabel="👥 About Us Section (Homepage)"
        icon={Info} color="#3b82f6" defaultOpen={false}
        fields={[
          { field: 'label',      label: 'Section Label (small badge above heading)' },
          { field: 'heading1',   label: 'Heading — Line 1 (e.g. Where Vision)' },
          { field: 'heading2',   label: 'Heading — Line 2 in Orange (e.g. Meets Execution)' },
          { field: 'heading3',   label: 'Heading — Line 3 (e.g. Excellence)' },
          { field: 'paragraph1', label: 'Main Paragraph', multiline: true, rows: 4 },
          { field: 'paragraph2', label: 'Supporting Paragraph', multiline: true, rows: 3 },
          { field: 'point1', label: '✓ Feature Point 1 (e.g. 400+ Projects Delivered)' },
          { field: 'point2', label: '✓ Feature Point 2 (e.g. 10+ Years of Excellence)' },
          { field: 'point3', label: '✓ Feature Point 3 (e.g. Egypt & MENA Coverage)' },
          { field: 'point4', label: '✓ Feature Point 4 (e.g. International Standards)' },
          { field: 'cta',    label: 'Button Text (e.g. Work With Us)' },
        ]}
        imageKeys={[
          { key: 'image1', label: 'Photo 1 — Top Left', size: 'sm' },
          { key: 'image2', label: 'Photo 2 — Top Right', size: 'sm' },
          { key: 'image3', label: 'Photo 3 — Bottom Left', size: 'sm' },
          { key: 'image4', label: 'Photo 4 — Bottom Right', size: 'sm' },
        ]}
      />

      {/* Services Section Header */}
      <PageSection
        pageName="home" sectionName="services" sectionLabel="⚙️ Services Section — Header Text"
        icon={Wrench} color="#8b5cf6"
        fields={[
          { field: 'label', label: 'Section Label' },
          { field: 'heading', label: 'Section Heading' },
          { field: 'subtitle', label: 'Section Subtitle' },
        ]}
      />

      {/* Info tip for service cards */}
      <div className="mb-4 px-4 py-3.5 rounded-xl flex items-center gap-3" style={{ background: '#0f172a', border: '1px dashed #374151' }}>
        <Wrench className="h-4 w-4 shrink-0" style={{ color: '#8b5cf6' }} />
        <div>
          <p className="text-sm font-semibold text-white">Service Cards (individual services with photos)</p>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
            Edit individual service titles, descriptions and photos in{' '}
            <button onClick={() => setSection('services')} className="underline" style={{ color: '#ED8214' }}>Services Cards →</button>
          </p>
        </div>
      </div>

      {/* Portfolio Section Header */}
      <PageSection
        pageName="home" sectionName="portfolio" sectionLabel="🖼️ Portfolio Section — Header Text"
        icon={Layers} color="#10b981"
        fields={[
          { field: 'label', label: 'Section Label' },
          { field: 'heading', label: 'Section Heading' },
          { field: 'subtitle', label: 'Section Subtitle' },
          { field: 'cta', label: '"View All" Button Text' },
        ]}
      />

      {/* Why Us */}
      <PageSection
        pageName="home" sectionName="why" sectionLabel="✅ Why Choose Us Section"
        icon={Award} color="#f59e0b"
        fields={[
          { field: 'label', label: 'Section Label' },
          { field: 'heading1', label: 'Heading Line 1' },
          { field: 'heading2', label: 'Heading Line 2' },
          { field: 'subtitle', label: 'Subtitle' },
          { field: 'item1_title', label: 'Point 1 — Title' },
          { field: 'item1_desc', label: 'Point 1 — Description', multiline: true, rows: 2 },
          { field: 'item2_title', label: 'Point 2 — Title' },
          { field: 'item2_desc', label: 'Point 2 — Description', multiline: true, rows: 2 },
          { field: 'item3_title', label: 'Point 3 — Title' },
          { field: 'item3_desc', label: 'Point 3 — Description', multiline: true, rows: 2 },
          { field: 'item4_title', label: 'Point 4 — Title' },
          { field: 'item4_desc', label: 'Point 4 — Description', multiline: true, rows: 2 },
          { field: 'item5_title', label: 'Point 5 — Title' },
          { field: 'item5_desc', label: 'Point 5 — Description', multiline: true, rows: 2 },
          { field: 'item6_title', label: 'Point 6 — Title' },
          { field: 'item6_desc', label: 'Point 6 — Description', multiline: true, rows: 2 },
        ]}
      />

      {/* Clients / Marquee Section */}
      <PageSection
        pageName="home" sectionName="clients" sectionLabel="🎯 Our Clients / Trusted Brands Section"
        icon={Users} color="#ED8214"
        fields={[
          { field: 'label', label: 'Section Label (small badge above heading)', hint: 'e.g. "Our Clients" or "عملاؤنا"' },
          { field: 'heading', label: 'Main Heading', hint: 'e.g. "TRUSTED BY LEADING BRANDS"' },
          { field: 'subtitle', label: 'Subtitle / Description', hint: 'Short description below the heading', multiline: true, rows: 2 },
        ]}
      />

      {/* Process */}
      <PageSection
        pageName="home" sectionName="process" sectionLabel="📋 Our Process Section"
        icon={FileText} color="#06b6d4"
        fields={[
          { field: 'label', label: 'Section Label' },
          { field: 'heading', label: 'Heading' },
          { field: 'subtitle', label: 'Subtitle' },
          { field: 'step1_title', label: 'Step 1 — Title' },
          { field: 'step1_desc', label: 'Step 1 — Description', multiline: true, rows: 2 },
          { field: 'step2_title', label: 'Step 2 — Title' },
          { field: 'step2_desc', label: 'Step 2 — Description', multiline: true, rows: 2 },
          { field: 'step3_title', label: 'Step 3 — Title' },
          { field: 'step3_desc', label: 'Step 3 — Description', multiline: true, rows: 2 },
          { field: 'step4_title', label: 'Step 4 — Title' },
          { field: 'step4_desc', label: 'Step 4 — Description', multiline: true, rows: 2 },
          { field: 'step5_title', label: 'Step 5 — Title' },
          { field: 'step5_desc', label: 'Step 5 — Description', multiline: true, rows: 2 },
        ]}
      />

      {/* CTA Band */}
      <PageSection
        pageName="home" sectionName="cta" sectionLabel="🎯 CTA Band — Call to Action"
        icon={MousePointerClick} color="#f43f5e"
        fields={[
          { field: 'label', label: 'Section Label (above heading)', hint: 'e.g. "Let\'s Work Together"' },
          { field: 'heading', label: 'Heading Line 1' },
          { field: 'heading2', label: 'Heading Line 2 (in orange)' },
          { field: 'subtitle', label: 'Subtitle' },
          { field: 'cta_primary', label: 'Primary Button Text' },
          { field: 'cta_secondary', label: 'Secondary Button Text' },
        ]}
      />

      {/* Contact Section */}
      <PageSection
        pageName="home" sectionName="contact" sectionLabel="📬 Contact Section — Form & Labels"
        icon={Mail} color="#a78bfa"
        fields={[
          { field: 'label', label: 'Section Label' },
          { field: 'heading', label: 'Heading Line 1' },
          { field: 'heading2', label: 'Heading Line 2' },
          { field: 'subtitle', label: 'Subtitle' },
          { field: 'form_name', label: 'Form — Name Field Label' },
          { field: 'form_email', label: 'Form — Email Field Label' },
          { field: 'form_phone', label: 'Form — Phone Field Label' },
          { field: 'form_company', label: 'Form — Company Field Label' },
          { field: 'form_service', label: 'Form — Service Field Label' },
          { field: 'form_message', label: 'Form — Message Field Label' },
          { field: 'form_submit', label: 'Form — Submit Button Text' },
        ]}
      />

      {/* Footer */}
      <PageSection
        pageName="home" sectionName="footer" sectionLabel="🔽 Footer Text"
        icon={AlignLeft} color="#6b7280"
        fields={[
          { field: 'tagline', label: 'Footer Tagline', multiline: true, rows: 2 },
          { field: 'copyright', label: 'Copyright Text', hint: 'e.g. © 2026 MOPI Production. All rights reserved.' },
        ]}
      />
    </div>
  );

  // ── ABOUT PAGE ──
  const renderPageAbout = () => (
    <div>
      <PageHeader title="About Page" subtitle="Edit all content on the About page" icon={Info} color="#3b82f6" page="about" liveUrl="/about" />

      <PageSection pageName="about" sectionName="hero" sectionLabel="🚀 Hero Banner" icon={Megaphone} color="#ED8214" defaultOpen={true}
        fields={[
          { field: 'badge', label: 'Badge Text (e.g. Our Story)' },
          { field: 'heading', label: 'Main Heading (e.g. Crafting Excellence Since 2016)' },
          { field: 'subtitle', label: 'Hero Subtitle / Description', multiline: true, rows: 3 },
        ]}
        imageKeys={[{ key: 'background', label: 'Hero Background Photo', size: 'lg' }]}
      />

      <PageSection pageName="about" sectionName="mission" sectionLabel="🎯 Mission Section" icon={Zap} color="#f59e0b"
        fields={[
          { field: 'heading', label: 'Mission Heading' },
          { field: 'content', label: 'Mission Description', multiline: true, rows: 4 },
          { field: 'point1', label: 'Mission Point 1' },
          { field: 'point2', label: 'Mission Point 2' },
          { field: 'point3', label: 'Mission Point 3' },
          { field: 'point4', label: 'Mission Point 4' },
        ]}
      />

      <PageSection pageName="about" sectionName="vision" sectionLabel="🔭 Vision Section" icon={Star} color="#8b5cf6"
        fields={[
          { field: 'heading', label: 'Vision Heading' },
          { field: 'content', label: 'Vision Description', multiline: true, rows: 4 },
          { field: 'future_heading', label: 'Future Outlook Heading (e.g. Looking Ahead to 2030)' },
          { field: 'future_content', label: 'Future Outlook Text', multiline: true, rows: 3 },
        ]}
      />

      <PageSection pageName="about" sectionName="values" sectionLabel="⭐ Core Values Section" icon={Globe} color="#10b981"
        fields={[
          { field: 'label', label: 'Section Label (small text above heading)' },
          { field: 'heading', label: 'Section Heading' },
          { field: 'subtitle', label: 'Section Subtitle' },
          { field: 'val1_title', label: 'Value 1: Title' },
          { field: 'val1_desc', label: 'Value 1: Description', multiline: true, rows: 2 },
          { field: 'val2_title', label: 'Value 2: Title' },
          { field: 'val2_desc', label: 'Value 2: Description', multiline: true, rows: 2 },
          { field: 'val3_title', label: 'Value 3: Title' },
          { field: 'val3_desc', label: 'Value 3: Description', multiline: true, rows: 2 },
          { field: 'val4_title', label: 'Value 4: Title' },
          { field: 'val4_desc', label: 'Value 4: Description', multiline: true, rows: 2 },
        ]}
      />

      <PageSection pageName="about" sectionName="timeline" sectionLabel="🗓️ Company Timeline" icon={BookOpen} color="#3b82f6"
        fields={[
          { field: 'label', label: 'Section Label' },
          { field: 'heading', label: 'Section Heading' },
          { field: 'subtitle', label: 'Section Subtitle' },
          { field: 'year1', label: 'Milestone 1: Year' }, { field: 'event1', label: 'Milestone 1: Event' },
          { field: 'year2', label: 'Milestone 2: Year' }, { field: 'event2', label: 'Milestone 2: Event' },
          { field: 'year3', label: 'Milestone 3: Year' }, { field: 'event3', label: 'Milestone 3: Event' },
          { field: 'year4', label: 'Milestone 4: Year' }, { field: 'event4', label: 'Milestone 4: Event' },
          { field: 'year5', label: 'Milestone 5: Year' }, { field: 'event5', label: 'Milestone 5: Event' },
          { field: 'year6', label: 'Milestone 6: Year' }, { field: 'event6', label: 'Milestone 6: Event' },
        ]}
      />

      <PageSection pageName="about" sectionName="awards" sectionLabel="🏆 Awards & Achievements" icon={Award} color="#f59e0b"
        fields={[
          { field: 'label', label: 'Section Label' },
          { field: 'heading', label: 'Section Heading' },
          { field: 'subtitle', label: 'Section Subtitle' },
          { field: 'award1_year', label: 'Award 1: Year' }, { field: 'award1_title', label: 'Award 1: Title' }, { field: 'award1_org', label: 'Award 1: Organization' }, { field: 'award1_desc', label: 'Award 1: Description', multiline: true, rows: 2 },
          { field: 'award2_year', label: 'Award 2: Year' }, { field: 'award2_title', label: 'Award 2: Title' }, { field: 'award2_org', label: 'Award 2: Organization' }, { field: 'award2_desc', label: 'Award 2: Description', multiline: true, rows: 2 },
          { field: 'award3_year', label: 'Award 3: Year' }, { field: 'award3_title', label: 'Award 3: Title' }, { field: 'award3_org', label: 'Award 3: Organization' }, { field: 'award3_desc', label: 'Award 3: Description', multiline: true, rows: 2 },
          { field: 'award4_year', label: 'Award 4: Year' }, { field: 'award4_title', label: 'Award 4: Title' }, { field: 'award4_org', label: 'Award 4: Organization' }, { field: 'award4_desc', label: 'Award 4: Description', multiline: true, rows: 2 },
        ]}
      />

      <PageSection pageName="about" sectionName="cta" sectionLabel="🔗 Call to Action Section" icon={MousePointerClick} color="#f43f5e"
        fields={[
          { field: 'heading', label: 'CTA Heading' },
          { field: 'subtitle', label: 'CTA Subtitle' },
          { field: 'cta_primary', label: 'Primary Button Text' },
          { field: 'cta_secondary', label: 'Secondary Button Text (WhatsApp)' },
        ]}
      />

      <div className="mb-4 px-4 py-3.5 rounded-xl flex items-center gap-3" style={{ background: '#0f172a', border: '1px dashed #374151' }}>
        <Users className="h-4 w-4 shrink-0" style={{ color: '#10b981' }} />
        <div>
          <p className="text-sm font-semibold text-white">Team Members (photos, names, bios)</p>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
            Edit team profiles in{' '}
            <button onClick={() => setSection('team')} className="underline" style={{ color: '#ED8214' }}>Team Members →</button>
          </p>
        </div>
      </div>

      <div className="mb-4 px-4 py-3.5 rounded-xl flex items-center gap-3" style={{ background: '#0f172a', border: '1px dashed #374151' }}>
        <Star className="h-4 w-4 shrink-0" style={{ color: '#f59e0b' }} />
        <div>
          <p className="text-sm font-semibold text-white">Client Testimonials</p>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
            Edit testimonials in{' '}
            <button onClick={() => setSection('testimonials')} className="underline" style={{ color: '#ED8214' }}>Testimonials →</button>
          </p>
        </div>
      </div>
    </div>
  );

  // ── SERVICES PAGE ──
  const renderPageServices = () => (
    <div>
      <PageHeader title="Services Page" subtitle="Edit all content on the Services page" icon={Briefcase} color="#8b5cf6" page="services" liveUrl="/services" />

      <PageSection pageName="services" sectionName="hero" sectionLabel="🚀 Hero Banner" icon={Megaphone} color="#ED8214" defaultOpen={true}
        fields={[
          { field: 'badge', label: 'Badge Text' },
          { field: 'heading', label: 'Main Heading' },
          { field: 'subtitle', label: 'Subtitle' },
        ]}
        imageKeys={[{ key: 'background', label: 'Hero Background Photo', size: 'lg' }]}
      />

      <PageSection pageName="services" sectionName="cta" sectionLabel="🎯 CTA Section" icon={MousePointerClick} color="#f43f5e"
        fields={[
          { field: 'heading', label: 'CTA Heading' },
          { field: 'subtitle', label: 'CTA Subtitle' },
          { field: 'cta_primary', label: 'CTA Button Text' },
        ]}
      />

      <div className="mb-4 px-4 py-3.5 rounded-xl flex items-center gap-3" style={{ background: '#0f172a', border: '1px dashed #374151' }}>
        <Wrench className="h-4 w-4 shrink-0" style={{ color: '#8b5cf6' }} />
        <div>
          <p className="text-sm font-semibold text-white">Individual Service Cards</p>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
            Edit titles, descriptions and photos per service in{' '}
            <button onClick={() => setSection('services')} className="underline" style={{ color: '#ED8214' }}>Services Cards →</button>
          </p>
        </div>
      </div>
    </div>
  );

  // ── PORTFOLIO PAGE ──
  const renderPagePortfolio = () => (
    <div>
      <PageHeader title="Portfolio Page" subtitle="Edit all content on the Portfolio page" icon={Layers} color="#10b981" page="portfolio" liveUrl="/portfolio" />

      <PageSection pageName="portfolio" sectionName="hero" sectionLabel="🚀 Hero Banner" icon={Megaphone} color="#ED8214" defaultOpen={true}
        fields={[
          { field: 'badge', label: 'Badge Text' },
          { field: 'heading', label: 'Main Heading' },
          { field: 'subtitle', label: 'Subtitle' },
        ]}
        imageKeys={[{ key: 'background', label: 'Hero Background Photo', size: 'lg' }]}
      />

      <div className="mb-4 px-4 py-3.5 rounded-xl flex items-center gap-3" style={{ background: '#0f172a', border: '1px dashed #374151' }}>
        <Palette className="h-4 w-4 shrink-0" style={{ color: '#10b981' }} />
        <div>
          <p className="text-sm font-semibold text-white">Portfolio Projects (photos, titles, descriptions)</p>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
            Add/edit individual projects in{' '}
            <button onClick={() => setSection('portfolio')} className="underline" style={{ color: '#ED8214' }}>Portfolio Projects →</button>
          </p>
        </div>
      </div>

      <div className="mb-4 px-4 py-3.5 rounded-xl flex items-center gap-3" style={{ background: '#0f172a', border: '1px dashed #374151' }}>
        <BarChart2 className="h-4 w-4 shrink-0" style={{ color: '#3b82f6' }} />
        <div>
          <p className="text-sm font-semibold text-white">Stats & Numbers (500+ Projects, etc.)</p>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
            Edit numbers in{' '}
            <button onClick={() => setSection('stats')} className="underline" style={{ color: '#ED8214' }}>Stats & Numbers →</button>
          </p>
        </div>
      </div>
    </div>
  );

  // ── CONTACT PAGE ──
  const renderPageContact = () => (
    <div>
      <PageHeader title="Contact Page" subtitle="Edit all content on the Contact page" icon={MessageCircle} color="#f43f5e" page="contact" liveUrl="/contact" />

      <PageSection pageName="contact" sectionName="hero" sectionLabel="🚀 Hero Banner" icon={Megaphone} color="#ED8214" defaultOpen={true}
        fields={[
          { field: 'badge', label: 'Badge Text' },
          { field: 'heading', label: 'Main Heading' },
          { field: 'subtitle', label: 'Subtitle' },
        ]}
        imageKeys={[{ key: 'background', label: 'Hero Background Photo', size: 'lg' }]}
      />

      <PageSection pageName="contact" sectionName="info" sectionLabel="📋 Contact Info Labels" icon={FileText} color="#06b6d4"
        fields={[
          { field: 'address_label', label: 'Address Label', hint: 'e.g. "Our Location" / "موقعنا"' },
          { field: 'phone_label', label: 'Phone Label' },
          { field: 'email_label', label: 'Email Label' },
          { field: 'whatsapp_label', label: 'WhatsApp Label' },
        ]}
      />

      <div className="mb-4 px-4 py-3.5 rounded-xl flex items-center gap-3" style={{ background: '#0f172a', border: '1px dashed #374151' }}>
        <Phone className="h-4 w-4 shrink-0" style={{ color: '#10b981' }} />
        <div>
          <p className="text-sm font-semibold text-white">Contact Details (Phone, Email, Address, WhatsApp)</p>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
            Edit actual contact information in{' '}
            <button onClick={() => setSection('site-settings')} className="underline" style={{ color: '#ED8214' }}>Site Settings →</button>
          </p>
        </div>
      </div>
    </div>
  );

  // ── SITE SETTINGS ──
  const renderSiteSettings = () => {
    const groups = [...new Set(settings.map(s => s.group_name))];
    const groupIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
      'contact': Phone, 'company': Briefcase, 'seo': Globe, 'social': Globe,
    };
    const groupColors: Record<string, string> = {
      'contact': '#10b981', 'company': '#3b82f6', 'seo': '#8b5cf6', 'social': '#ED8214',
    };
    return (
      <div>
        <PageHeader title="Site Settings" subtitle="Edit company info, contact details, and global settings" icon={Settings} color="#ED8214" />
        {groups.map(group => {
          const groupItems = settings.filter(s => s.group_name === group);
          const GIcon = groupIcons[group] || Settings;
          return (
            <SectionCard key={group} title={group.charAt(0).toUpperCase() + group.slice(1)} icon={GIcon} color={groupColors[group] || '#ED8214'} defaultOpen={true}>
              <div className="space-y-4">
                {groupItems.map(item => (
                  <div key={item.id}>
                    <Field label={item.label || item.key}>
                      <Input value={item.value} onChange={e => setSettings(prev => prev.map(s => s.id === item.id ? { ...s, value: e.target.value } : s))} />
                    </Field>
                    <div className="flex justify-end mt-2">
                      <button onClick={() => saveSetting(item)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg text-black flex items-center gap-1.5 hover:scale-105 transition-all"
                        style={{ background: '#ED8214' }}>
                        <Save className="h-3 w-3" />Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          );
        })}
      </div>
    );
  };

  // ── LOGOS ──
  const renderLogos = () => (
    <div>
      <PageHeader title="Logos & Favicon" subtitle="Upload your logo files and favicon for the website" icon={ImageIcon} color="#ED8214" />
      <div className="space-y-4">
        {logos.map(logo => (
          <SectionCard key={logo.id} title={logo.name || logo.placement} icon={ImageIcon} color="#ED8214" defaultOpen={true}>
            <div className="grid md:grid-cols-2 gap-5 items-start">
              <div>
                <Field label="Logo File — Upload Photo">
                  <ImageUploader
                    currentUrl={logo.url}
                    onUploaded={url => setLogos(prev => prev.map(x => x.id === logo.id ? { ...x, url } : x))}
                    label="Click to upload logo file"
                    folder="logos"
                    size="md"
                  />
                </Field>
              </div>
              <div className="space-y-3">
                <Field label="Alt Text" hint="Description of the logo for accessibility">
                  <Input value={logo.alt_text} onChange={e => setLogos(prev => prev.map(x => x.id === logo.id ? { ...x, alt_text: e.target.value } : x))} />
                </Field>
                <Field label="Placement">
                  <Input value={logo.placement} disabled style={{ color: '#4b5563' }} />
                </Field>
                <div className="flex items-center justify-between">
                  <Toggle checked={logo.is_active} onChange={v => setLogos(prev => prev.map(x => x.id === logo.id ? { ...x, is_active: v } : x))} label="Active" />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <SaveBtn onClick={() => saveLogo(logo)} saving={saving} />
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );

  // ── SOCIAL LINKS ──
  const renderSocialLinks = () => (
    <div>
      <PageHeader title="Social Media Links" subtitle="Manage all social media profiles and links" icon={Globe} color="#ED8214" />
      <div className="space-y-4">
        {socials.map(social => (
          <SectionCard key={social.id} title={social.platform} icon={Globe} color="#ED8214" defaultOpen={false}>
            <div className="space-y-4">
              <Field label="Profile URL">
                <Input value={social.url} onChange={e => setSocials(prev => prev.map(s => s.id === social.id ? { ...s, url: e.target.value } : s))} placeholder="https://..." />
              </Field>
              <div className="flex items-center justify-between">
                <Toggle checked={social.is_active} onChange={v => setSocials(prev => prev.map(s => s.id === social.id ? { ...s, is_active: v } : s))} label={social.is_active ? 'Visible on website' : 'Hidden'} />
                <SaveBtn onClick={() => saveSocial(social)} saving={saving} />
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      {/* Add new */}
      <SectionCard title="Add New Social Link" icon={Plus} color="#10b981" defaultOpen={false}>
        <AddSocialForm onSave={item => saveSocial({ ...item, id: 0 })} />
      </SectionCard>
    </div>
  );

  // ── STATS ──
  const renderStats = () => (
    <div>
      <PageHeader title="Stats & Numbers" subtitle="The achievement numbers shown on the website (e.g. 500+ Projects)" icon={BarChart2} color="#ED8214" />
      <div className="flex justify-end mb-4">
        <button onClick={() => setStats(prev => [...prev, { id: 0, label: 'New Stat', value: 0, suffix: '+', sort_order: prev.length, is_active: true }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-black hover:scale-105 transition-all"
          style={{ background: '#ED8214' }}>
          <Plus className="h-4 w-4" />Add Stat
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.id || `new-${i}`} className="p-5 rounded-2xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-black" style={{ color: '#ED8214' }}>{stat.value}{stat.suffix}</div>
              <div className="flex items-center gap-2">
                <Toggle checked={stat.is_active} onChange={v => setStats(prev => prev.map((x, xi) => xi === i ? { ...x, is_active: v } : x))} />
                {stat.id > 0 && <button onClick={() => deleteStat(stat.id)} className="p-1.5 rounded-lg hover:bg-red-900/20 transition-colors" style={{ color: '#ef4444' }}><Trash2 className="h-4 w-4" /></button>}
              </div>
            </div>
            <div className="space-y-3">
              <Field label="Label">
                <Input value={stat.label} onChange={e => setStats(prev => prev.map((x, xi) => xi === i ? { ...x, label: e.target.value } : x))} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Number">
                  <Input type="number" value={stat.value} onChange={e => setStats(prev => prev.map((x, xi) => xi === i ? { ...x, value: +e.target.value } : x))} />
                </Field>
                <Field label="Suffix (e.g. +, %)">
                  <Input value={stat.suffix} onChange={e => setStats(prev => prev.map((x, xi) => xi === i ? { ...x, suffix: e.target.value } : x))} />
                </Field>
              </div>
              <div className="flex justify-end">
                <SaveBtn onClick={() => saveStat(stat)} saving={saving} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── SERVICES CARDS ──
  const renderServices = () => (
    <div>
      <PageHeader title="Service Cards" subtitle="Edit each service — title, description, and photo. All shown on the Services page." icon={Wrench} color="#8b5cf6" />
      <div className="flex justify-end mb-4">
        <button onClick={() => setServices(prev => [...prev, { id: 0, title: 'New Service', subtitle: '', description: '', icon: 'Zap', image_url: '', sort_order: prev.length, is_active: true, is_featured: false }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-black hover:scale-105 transition-all"
          style={{ background: '#ED8214' }}>
          <Plus className="h-4 w-4" />Add Service
        </button>
      </div>
      <div className="space-y-4">
        {services.map((svc, i) => (
          <SectionCard key={svc.id || `new-${i}`} title={svc.title} icon={Wrench} color="#8b5cf6" defaultOpen={!svc.id} badge={svc.is_featured ? 'Featured' : undefined}>
            <div className="space-y-4">
              <div>
                <Field label="Service Photo">
                  <ImageUploader currentUrl={svc.image_url || ''} onUploaded={url => setServices(prev => prev.map((x, xi) => xi === i ? { ...x, image_url: url } : x))} folder="services" label="Click to upload service photo" size="md" />
                </Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Title">
                  <Input value={svc.title} onChange={e => setServices(prev => prev.map((x, xi) => xi === i ? { ...x, title: e.target.value } : x))} />
                </Field>
                <Field label="Subtitle / Short Desc">
                  <Input value={svc.subtitle} onChange={e => setServices(prev => prev.map((x, xi) => xi === i ? { ...x, subtitle: e.target.value } : x))} />
                </Field>
              </div>
              <Field label="Full Description">
                <Textarea value={svc.description} onChange={e => setServices(prev => prev.map((x, xi) => xi === i ? { ...x, description: e.target.value } : x))} rows={3} />
              </Field>
              <div className="flex items-center gap-6">
                <Toggle checked={svc.is_active} onChange={v => setServices(prev => prev.map((x, xi) => xi === i ? { ...x, is_active: v } : x))} label="Visible" />
                <Toggle checked={svc.is_featured} onChange={v => setServices(prev => prev.map((x, xi) => xi === i ? { ...x, is_featured: v } : x))} label="Featured" />
              </div>
              <div className="flex items-center justify-between pt-2">
                {svc.id > 0 && <button onClick={() => deleteService(svc.id)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-colors" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}><Trash2 className="h-3.5 w-3.5" />Delete Service</button>}
                <SaveBtn onClick={() => saveService(svc)} saving={saving} />
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );

  // ── PORTFOLIO ──
  const renderPortfolio = () => (
    <div>
      <PageHeader title="Portfolio Projects" subtitle="Edit all projects — photo, title, category, description, client info" icon={Palette} color="#10b981" />
      <div className="flex justify-end mb-4">
        <button onClick={() => setPortfolio(prev => [...prev, { id: 0, title: 'New Project', category: 'exhibition', client: '', location: '', project_date: '', visitors: '', description: '', image_url: '', award: '', is_featured: false, is_active: true, sort_order: prev.length }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-black hover:scale-105 transition-all"
          style={{ background: '#ED8214' }}>
          <Plus className="h-4 w-4" />Add Project
        </button>
      </div>
      <div className="space-y-4">
        {portfolio.map((proj, i) => (
          <SectionCard key={proj.id || `new-${i}`} title={proj.title} icon={Palette} color="#10b981" defaultOpen={!proj.id} badge={proj.is_featured ? 'Featured' : undefined}>
            <div className="space-y-4">
              <Field label="Project Photo" hint="Main image shown in the portfolio grid">
                <ImageUploader currentUrl={proj.image_url || ''} onUploaded={url => setPortfolio(prev => prev.map((x, xi) => xi === i ? { ...x, image_url: url } : x))} folder="portfolio" label="Click to upload project photo" size="lg" />
              </Field>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Project Title">
                  <Input value={proj.title} onChange={e => setPortfolio(prev => prev.map((x, xi) => xi === i ? { ...x, title: e.target.value } : x))} />
                </Field>
                <Field label="Category">
                  <select value={proj.category}
                    onChange={e => setPortfolio(prev => prev.map((x, xi) => xi === i ? { ...x, category: e.target.value } : x))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }}>
                    <option value="exhibition">Exhibition</option>
                    <option value="events">Events</option>
                    <option value="brand-activation">Brand Activation</option>
                    <option value="corporate">Corporate</option>
                    <option value="booth-construction">Booth Construction</option>
                  </select>
                </Field>
                <Field label="Client Name">
                  <Input value={proj.client} onChange={e => setPortfolio(prev => prev.map((x, xi) => xi === i ? { ...x, client: e.target.value } : x))} />
                </Field>
                <Field label="Location">
                  <Input value={proj.location} onChange={e => setPortfolio(prev => prev.map((x, xi) => xi === i ? { ...x, location: e.target.value } : x))} />
                </Field>
                <Field label="Project Date">
                  <Input value={proj.project_date} onChange={e => setPortfolio(prev => prev.map((x, xi) => xi === i ? { ...x, project_date: e.target.value } : x))} placeholder="e.g. March 2025" />
                </Field>
                <Field label="Visitors / Attendance">
                  <Input value={proj.visitors} onChange={e => setPortfolio(prev => prev.map((x, xi) => xi === i ? { ...x, visitors: e.target.value } : x))} placeholder="e.g. 50,000+" />
                </Field>
              </div>
              <Field label="Project Description">
                <Textarea value={proj.description} onChange={e => setPortfolio(prev => prev.map((x, xi) => xi === i ? { ...x, description: e.target.value } : x))} rows={4} />
              </Field>
              <Field label="Award / Achievement (optional)">
                <Input value={proj.award} onChange={e => setPortfolio(prev => prev.map((x, xi) => xi === i ? { ...x, award: e.target.value } : x))} placeholder="e.g. Best Exhibition Stand 2025" />
              </Field>
              <div className="flex items-center gap-6">
                <Toggle checked={proj.is_active} onChange={v => setPortfolio(prev => prev.map((x, xi) => xi === i ? { ...x, is_active: v } : x))} label="Visible" />
                <Toggle checked={proj.is_featured} onChange={v => setPortfolio(prev => prev.map((x, xi) => xi === i ? { ...x, is_featured: v } : x))} label="Featured (Spotlight)" />
              </div>
              <div className="flex items-center justify-between pt-2">
                {proj.id > 0 && <button onClick={() => deletePortfolio(proj.id)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-colors" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}><Trash2 className="h-3.5 w-3.5" />Delete Project</button>}
                <SaveBtn onClick={() => savePortfolio(proj)} saving={saving} />
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );

  // ── TEAM ──
  const renderTeam = () => (
    <div>
      <PageHeader title="Team Members" subtitle="Edit team member profiles, photos, and bios" icon={Users} color="#10b981" />
      <div className="flex justify-end mb-4">
        <button onClick={() => setTeam(prev => [...prev, { id: 0, name: 'New Member', role: '', bio: '', image_url: '', email: '', linkedin_url: '', sort_order: prev.length, is_active: true }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-black hover:scale-105 transition-all"
          style={{ background: '#ED8214' }}>
          <Plus className="h-4 w-4" />Add Member
        </button>
      </div>
      <div className="space-y-4">
        {team.map((member, i) => (
          <SectionCard key={member.id || `new-${i}`} title={`${member.name} — ${member.role}`} icon={Users} color="#10b981" defaultOpen={!member.id}>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <Field label="Member Photo">
                  <ImageUploader currentUrl={member.image_url} onUploaded={url => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, image_url: url } : x))} folder="team" label="Click to upload member photo" size="md" />
                </Field>
              </div>
              <div className="md:col-span-2 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full Name">
                    <Input value={member.name} onChange={e => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, name: e.target.value } : x))} />
                  </Field>
                  <Field label="Job Title / Role">
                    <Input value={member.role} onChange={e => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, role: e.target.value } : x))} />
                  </Field>
                </div>
                <Field label="Bio / About">
                  <Textarea value={member.bio} onChange={e => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, bio: e.target.value } : x))} rows={3} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email">
                    <Input value={member.email} onChange={e => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, email: e.target.value } : x))} />
                  </Field>
                  <Field label="LinkedIn URL">
                    <Input value={member.linkedin_url} onChange={e => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, linkedin_url: e.target.value } : x))} />
                  </Field>
                </div>
                <div className="flex items-center justify-between">
                  <Toggle checked={member.is_active} onChange={v => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, is_active: v } : x))} label="Visible on website" />
                  <div className="flex gap-2">
                    {member.id > 0 && <button onClick={() => deleteTeam(member.id)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}><Trash2 className="h-3.5 w-3.5" />Delete</button>}
                    <SaveBtn onClick={() => saveTeam(member)} saving={saving} />
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );

  // ── TESTIMONIALS ──
  const renderTestimonials = () => (
    <div>
      <PageHeader title="Client Testimonials" subtitle="Edit client reviews, quotes, and photos" icon={Star} color="#f59e0b" />
      <div className="flex justify-end mb-4">
        <button onClick={() => setTestimonials(prev => [...prev, { id: 0, author_name: 'New Client', author_role: '', company: '', quote: '', rating: 5, image_url: '', is_active: true, sort_order: prev.length }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-black hover:scale-105 transition-all"
          style={{ background: '#ED8214' }}>
          <Plus className="h-4 w-4" />Add Testimonial
        </button>
      </div>
      <div className="space-y-4">
        {testimonials.map((t, i) => (
          <SectionCard key={t.id || `new-${i}`} title={`${t.author_name} — ${t.company}`} icon={Star} color="#f59e0b" defaultOpen={!t.id}>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <Field label="Client Photo">
                  <ImageUploader currentUrl={t.image_url || ''} onUploaded={url => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, image_url: url } : x))} folder="testimonials" label="Upload client photo" size="md" />
                </Field>
              </div>
              <div className="md:col-span-2 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Client Name">
                    <Input value={t.author_name} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, author_name: e.target.value } : x))} />
                  </Field>
                  <Field label="Job Title">
                    <Input value={t.author_role} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, author_role: e.target.value } : x))} />
                  </Field>
                </div>
                <Field label="Company">
                  <Input value={t.company} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, company: e.target.value } : x))} />
                </Field>
                <Field label="Quote / Review">
                  <Textarea value={t.quote} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, quote: e.target.value } : x))} rows={3} />
                </Field>
                <div className="flex items-center gap-4">
                  <Field label="Rating (1-5)">
                    <Input type="number" min="1" max="5" value={t.rating} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, rating: +e.target.value } : x))} style={{ width: 80 }} />
                  </Field>
                  <div className="mt-5">
                    {'★'.repeat(t.rating).split('').map((_, si) => <span key={si} style={{ color: '#ED8214', fontSize: 18 }}>★</span>)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Toggle checked={t.is_active} onChange={v => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, is_active: v } : x))} label="Visible" />
                  <div className="flex gap-2">
                    {t.id > 0 && <button onClick={() => deleteTestimonial(t.id)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}><Trash2 className="h-3.5 w-3.5" />Delete</button>}
                    <SaveBtn onClick={() => saveTestimonial(t)} saving={saving} />
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );

  // ── MEDIA ──
  const renderMedia = () => {
    const mediaRef = useRef<HTMLInputElement>(null);
    return (
      <div>
        <PageHeader title="Media Library" subtitle="All uploaded photos. Copy URLs to use them anywhere on the site." icon={Image} color="#ED8214" />
        <div
          className="mb-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#ED8214] transition-all"
          style={{ background: '#111827', borderColor: '#374151', padding: '40px 20px' }}
          onClick={() => mediaRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleMediaUpload(f); }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(237,130,20,0.1)' }}>
            <Upload className="h-6 w-6" style={{ color: '#ED8214' }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white">Click or drag to upload photos</p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>JPG, PNG, WEBP, GIF — up to 10MB</p>
          </div>
          <input ref={mediaRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleMediaUpload(f); }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {media.map(item => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden" style={{ background: '#111827', border: '1px solid #1f2937' }}>
              <img src={item.url} alt={item.alt_text} className="w-full h-36 object-cover" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2" style={{ background: 'rgba(0,0,0,0.75)' }}>
                <button onClick={() => { navigator.clipboard.writeText(item.url); notify('URL copied!'); }}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white w-full justify-center"
                  style={{ background: '#ED8214', color: '#000' }}>
                  <Link2 className="h-3 w-3" />Copy URL
                </button>
                <button onClick={() => deleteMedia(item)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg w-full justify-center"
                  style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <Trash2 className="h-3 w-3" />Delete
                </button>
              </div>
              <div className="p-2">
                <p className="text-[10px] truncate" style={{ color: '#6b7280' }}>{item.filename}</p>
              </div>
            </div>
          ))}
        </div>
        {media.length === 0 && <p className="text-center py-10 text-sm" style={{ color: '#4b5563' }}>No media uploaded yet. Upload your first photo above.</p>}
      </div>
    );
  };

  // ── INBOX ──
  const renderInbox = () => {
    const inboxTab = inboxTabState;
    const statusColors: Record<string, { bg: string; text: string; border: string }> = {
      new:        { bg: 'rgba(237,130,20,0.12)',   text: '#ED8214',  border: 'rgba(237,130,20,0.35)' },
      read:       { bg: 'rgba(96,165,250,0.10)',   text: '#60a5fa',  border: 'rgba(96,165,250,0.25)' },
      replied:    { bg: 'rgba(16,185,129,0.10)',   text: '#10b981',  border: 'rgba(16,185,129,0.25)' },
      in_progress:{ bg: 'rgba(251,191,36,0.10)',   text: '#fbbf24',  border: 'rgba(251,191,36,0.25)' },
      completed:  { bg: 'rgba(167,243,208,0.08)',  text: '#6ee7b7',  border: 'rgba(110,231,183,0.2)'  },
      archived:   { bg: 'rgba(255,255,255,0.04)',  text: '#6b7280',  border: '#1f2937'                },
    };
    const statusLabel: Record<string, string> = {
      new: '● NEW', read: '✓ READ', replied: '↩ REPLIED',
      in_progress: '⚙ IN PROGRESS', completed: '✅ COMPLETED', archived: '📦 ARCHIVED',
    };

    const StatusActions = ({ id, currentStatus, onUpdate }: { id: number; currentStatus: string; onUpdate: (id: number, st: string) => void }) => (
      <div className="flex flex-wrap gap-2">
        {(['read','in_progress','replied','completed','archived'] as const).map(st => (
          <button key={st} onClick={() => onUpdate(id, st)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
            style={{
              background: currentStatus === st ? (statusColors[st]?.bg ?? 'rgba(255,255,255,0.05)') : '#0f172a',
              border: `1px solid ${currentStatus === st ? (statusColors[st]?.border ?? '#374151') : '#374151'}`,
              color: currentStatus === st ? (statusColors[st]?.text ?? '#9ca3af') : '#9ca3af',
            }}>{statusLabel[st]}</button>
        ))}
      </div>
    );

    return (
      <div>
        <PageHeader
          title={`Inbox${unreadCount > 0 ? ` — ${unreadCount} New` : ''}`}
          subtitle="Click any item to expand its full details — stays open until you close it"
          icon={MessageSquare} color="#ED8214"
        />

        {/* Tab switcher */}
        <div className="flex gap-3 mb-6">
          {([['quotes', `📋 Quote Requests (${quoteRequests.length})`, quoteRequests.filter(q => q.status === 'new').length],
             ['contacts', `📬 Contact Messages (${inbox.length})`, inbox.filter(m => m.status === 'new').length]] as const).map(([tab, label, newCount]) => (
            <button key={tab} onClick={() => { setInboxTabState(tab as 'quotes'|'contacts'); setSelectedMessageId(null); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: inboxTab === tab ? 'rgba(237,130,20,0.15)' : '#111827',
                border: `1.5px solid ${inboxTab === tab ? '#ED8214' : '#374151'}`,
                color: inboxTab === tab ? '#ED8214' : '#6b7280',
              }}>
              {label}
              {(newCount as number) > 0 && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: '#ED8214', color: '#000' }}>{newCount as number}</span>}
            </button>
          ))}
        </div>

        {/* =================== QUOTE REQUESTS TAB =================== */}
        {inboxTab === 'quotes' && (
          <div className="space-y-2">
            {quoteRequests.map(q => {
              const isOpen = selectedMessageId === q.id + 100000;
              const sc = statusColors[q.status] ?? statusColors.archived;
              return (
                <div key={q.id} className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{ border: `1px solid ${isOpen ? sc.border : '#1f2937'}`, background: '#111827' }}>
                  {/* Row header */}
                  <button className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
                    onClick={() => {
                      setSelectedMessageId(isOpen ? null : q.id + 100000);
                      if (!isOpen && q.status === 'new') updateQuoteStatus(q.id, 'read');
                    }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ background: sc.bg, color: sc.text }}>
                      {q.company_name?.charAt(0).toUpperCase() || 'Q'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-white">{q.company_name}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#0f172a', color: '#6b7280' }}>🏗 Quote Request</span>
                      </div>
                      <p className="text-xs truncate" style={{ color: '#6b7280' }}>
                        {isOpen ? `${q.email} · ${q.phone}` : (q.exhibition_name ? `🏷 ${q.exhibition_name}` : q.message?.slice(0, 80) || '—')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                        style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                        {statusLabel[q.status] ?? q.status.toUpperCase()}
                      </span>
                      <span className="text-xs hidden sm:block" style={{ color: '#374151' }}>{new Date(q.created_at).toLocaleDateString()}</span>
                      <span className="text-xs transition-transform duration-200" style={{ color: '#6b7280', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </div>
                  </button>

                  {/* Expanded quote detail */}
                  {isOpen && (
                    <div className="px-5 pb-5" style={{ borderTop: '1px solid #1f2937' }}>
                      {/* Contact info */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 mb-4">
                        {[
                          { icon: '✉️', label: 'Email', val: q.email },
                          { icon: '📞', label: 'Phone', val: q.phone || '—' },
                          { icon: '🏢', label: 'Company', val: q.company_name },
                        ].map(({ icon, label, val }) => (
                          <div key={label} className="p-3 rounded-xl" style={{ background: '#0f172a', border: '1px solid #1f2937' }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>{icon} {label}</p>
                            <p className="text-xs font-semibold text-white break-all">{val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Exhibition details */}
                      <div className="p-4 rounded-xl mb-4" style={{ background: '#0a0e1a', border: '1px solid #1f2937' }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6b7280' }}>🏗 Exhibition Details</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { label: 'Exhibition Name', val: q.exhibition_name || '—' },
                            { label: 'Date', val: q.exhibition_date || '—' },
                            { label: 'Venue', val: q.exhibition_venue || '—' },
                            { label: 'Stand Dimension', val: q.stand_dimension || '—' },
                            { label: 'Layout', val: q.layout || '—' },
                            { label: 'Flooring', val: q.flooring || '—' },
                          ].map(({ label, val }) => (
                            <div key={label}>
                              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6b7280' }}>{label}: </span>
                              <span className="text-xs font-semibold text-white">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {[
                          { label: 'Platform', val: q.platform },
                          { label: 'Meeting Room', val: q.meeting_room },
                          { label: 'Double Deck', val: q.double_deck },
                          { label: 'Storage Room', val: q.storage_room },
                        ].map(({ label, val }) => (
                          <div key={label} className="p-3 rounded-xl text-center" style={{ background: '#0f172a', border: `1px solid ${val === 'yes' ? 'rgba(16,185,129,0.25)' : '#1f2937'}` }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>{label}</p>
                            <p className="text-sm font-bold" style={{ color: val === 'yes' ? '#10b981' : '#6b7280' }}>{val === 'yes' ? '✓ Yes' : '× No'}</p>
                          </div>
                        ))}
                      </div>

                      {/* Required items */}
                      {q.required_items && q.required_items.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6b7280' }}>📋 Required Items</p>
                          <div className="flex flex-wrap gap-2">
                            {q.required_items.map((item: string) => (
                              <span key={item} className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(237,130,20,0.12)', color: '#ED8214', border: '1px solid rgba(237,130,20,0.25)' }}>{item}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Files */}
                      {(q.floor_plan_url || q.brand_guidelines_url) && (
                        <div className="flex gap-3 mb-4">
                          {q.floor_plan_url && (
                            <a href={q.floor_plan_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg"
                              style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
                              📄 View Floor Plan
                            </a>
                          )}
                          {q.brand_guidelines_url && (
                            <a href={q.brand_guidelines_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg"
                              style={{ background: 'rgba(167,243,208,0.08)', color: '#6ee7b7', border: '1px solid rgba(110,231,183,0.2)' }}>
                              🎨 View Brand Guidelines
                            </a>
                          )}
                        </div>
                      )}

                      {/* Message */}
                      {q.message && (
                        <div className="p-4 rounded-xl mb-4" style={{ background: '#0a0e1a', border: '1px solid #1f2937' }}>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6b7280' }}>💬 Comment / Message</p>
                          <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>{q.message}</p>
                        </div>
                      )}

                      {/* Notes */}
                      <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#6b7280' }}>📝 Internal Notes</p>
                        <textarea rows={3}
                          value={inboxNote[q.id + 100000] ?? ''}
                          onChange={e => setInboxNote(prev => ({ ...prev, [q.id + 100000]: e.target.value }))}
                          placeholder="Notes, quote amount discussed, follow-up…"
                          className="w-full rounded-xl px-3.5 py-2.5 text-sm resize-none"
                          style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
                      </div>

                      {/* Status */}
                      <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6b7280' }}>🔄 Update Status</p>
                        <StatusActions id={q.id} currentStatus={q.status} onUpdate={updateQuoteStatus} />
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-3" style={{ borderTop: '1px solid #1f2937' }}>
                        <a href={`mailto:${q.email}?subject=Re: Exhibition Quote — ${encodeURIComponent(q.exhibition_name || 'Your Project')}&body=Dear ${encodeURIComponent(q.company_name)},%0D%0A%0D%0AThank you for your quote request!%0D%0A%0D%0A`}
                          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors hover:bg-blue-900/20"
                          style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
                          <Mail className="h-3.5 w-3.5" /> Reply via Email
                        </a>
                        <a href={`https://wa.me/${q.phone?.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(q.company_name)}, thank you for your quote request to MOPi Production!`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors hover:bg-green-900/20"
                          style={{ color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                          <Phone className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                        <span className="text-xs" style={{ color: '#374151' }}>Received: {new Date(q.created_at).toLocaleString()}</span>
                        <button onClick={() => { if (window.confirm('Delete this quote request?')) deleteQuoteRequest(q.id); }}
                          className="ml-auto flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-red-900/20 transition-colors"
                          style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {quoteRequests.length === 0 && (
              <div className="text-center py-20">
                <MessageSquare className="h-10 w-10 mx-auto mb-3" style={{ color: '#374151' }} />
                <p className="text-sm" style={{ color: '#4b5563' }}>No quote requests yet.</p>
                <p className="text-xs mt-1" style={{ color: '#374151' }}>When someone fills the quote form, requests will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* =================== CONTACT MESSAGES TAB =================== */}
        {inboxTab === 'contacts' && (
          <div className="space-y-2">
            {inbox.map(msg => {
              const isOpen = selectedMessageId === msg.id;
              const sc = statusColors[msg.status] ?? statusColors.archived;
              return (
                <div key={msg.id} className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{ border: `1px solid ${isOpen ? sc.border : '#1f2937'}`, background: '#111827' }}>
                  <button className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
                    onClick={() => {
                      setSelectedMessageId(isOpen ? null : msg.id);
                      if (!isOpen && msg.status === 'new') updateInboxStatus(msg.id, 'read');
                    }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: sc.bg, color: sc.text }}>
                      {msg.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-white">{msg.name}</span>
                        {msg.company && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#0f172a', color: '#6b7280' }}>🏢 {msg.company}</span>}
                      </div>
                      <p className="text-xs truncate" style={{ color: '#6b7280' }}>
                        {isOpen ? `${msg.email} · ${msg.phone}` : msg.message?.slice(0, 80) + (msg.message?.length > 80 ? '…' : '')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                        {statusLabel[msg.status] ?? msg.status.toUpperCase()}
                      </span>
                      <span className="text-xs hidden sm:block" style={{ color: '#374151' }}>{new Date(msg.created_at).toLocaleDateString()}</span>
                      <span className="text-xs transition-transform duration-200" style={{ color: '#6b7280', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5" style={{ borderTop: '1px solid #1f2937' }}>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 mb-4">
                        {[{icon:'✉️',label:'Email',val:msg.email},{icon:'📞',label:'Phone',val:msg.phone},{icon:'🏢',label:'Company',val:msg.company||'—'},{icon:'⚙️',label:'Service',val:msg.service||'—'}].map(({icon,label,val})=>(
                          <div key={label} className="p-3 rounded-xl" style={{background:'#0f172a',border:'1px solid #1f2937'}}>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{color:'#6b7280'}}>{icon} {label}</p>
                            <p className="text-xs font-semibold text-white break-all">{val}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 rounded-xl mb-4" style={{background:'#0a0e1a',border:'1px solid #1f2937'}}>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{color:'#6b7280'}}>💬 Message</p>
                        <p className="text-sm leading-relaxed" style={{color:'#d1d5db'}}>{msg.message}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{color:'#6b7280'}}>📝 Internal Notes</p>
                        <textarea rows={3} value={inboxNote[msg.id]??''} onChange={e=>setInboxNote(prev=>({...prev,[msg.id]:e.target.value}))}
                          placeholder="Notes, follow-up…" className="w-full rounded-xl px-3.5 py-2.5 text-sm resize-none"
                          style={{background:'#0f172a',border:'1px solid #374151',color:'#f3f4f6'}} />
                      </div>
                      <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{color:'#6b7280'}}>🔄 Update Status</p>
                        <StatusActions id={msg.id} currentStatus={msg.status} onUpdate={updateInboxStatus} />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-3" style={{borderTop:'1px solid #1f2937'}}>
                        <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-blue-900/20" style={{color:'#60a5fa',border:'1px solid rgba(96,165,250,0.2)'}}><Mail className="h-3.5 w-3.5"/> Reply</a>
                        <a href={`https://wa.me/${msg.phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-green-900/20" style={{color:'#10b981',border:'1px solid rgba(16,185,129,0.2)'}}><Phone className="h-3.5 w-3.5"/> WhatsApp</a>
                        <span className="text-xs" style={{color:'#374151'}}>Received: {new Date(msg.created_at).toLocaleString()}</span>
                        <button onClick={()=>{if(window.confirm('Delete?'))deleteInbox(msg.id);}} className="ml-auto flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-red-900/20" style={{color:'#ef4444',border:'1px solid rgba(239,68,68,0.2)'}}><Trash2 className="h-3.5 w-3.5"/> Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {inbox.length === 0 && (
              <div className="text-center py-20">
                <MessageSquare className="h-10 w-10 mx-auto mb-3" style={{ color: '#374151' }} />
                <p className="text-sm" style={{ color: '#4b5563' }}>No contact messages yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ─── CLIENTS MANAGEMENT ───────────────────────────────────────────────────
  const renderClientsManagement = () => {
    const sorted = [...clientLogosDB].sort((a, b) => a.sort_order - b.sort_order);
    const activeCount = sorted.filter(c => c.is_active).length;

    return (
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(237,130,20,0.1)' }}>
              <Users className="h-5 w-5" style={{ color: '#ED8214' }} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Client Logos Management</h1>
              <p className="text-sm" style={{ color: '#6b7280' }}>{activeCount} active logos • {sorted.length} total — logos appear in the marquee on the homepage</p>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ background: '#0B0B0B', border: '1px solid #ED821430' }}>
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: '#ED8214' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ED8214' }}>Live Preview — Homepage Marquee</span>
            </div>
            <span className="text-xs" style={{ color: '#374151' }}>{activeCount} logos shown</span>
          </div>
          <div className="py-8 px-4">
            {activeCount > 0 ? (
              <div style={{ overflow: 'hidden', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {sorted.filter(c => c.is_active).map(cl => (
                    <div key={cl.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '120px', height: '76px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                        {cl.logo_url ? (
                          <img src={cl.logo_url} alt={cl.name}
                            style={{ height: '52px', maxWidth: '110px', objectFit: 'contain', filter: 'none', opacity: 1 }} />
                        ) : (
                          <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 700 }}>{cl.name}</span>
                        )}
                      </div>
                      <span style={{ fontSize: '9px', color: '#4b5563', letterSpacing: '0.1em', fontWeight: 700 }}>{cl.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: '#374151' }}>No active logos yet. Add logos below to see the preview.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add New Logo */}
        <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: '#111827', border: '1px solid #1f2937' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #1f2937' }}>
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" style={{ color: '#10b981' }} />
              <span className="font-bold text-sm text-white">Add New Client Logo</span>
            </div>
          </div>
          <div className="p-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <Field label="Client Name *" required>
                  <Input
                    value={newClientName}
                    onChange={e => setNewClientName(e.target.value)}
                    placeholder="e.g. Samsung, BMW, KPMG..."
                  />
                </Field>
                <Field label="Logo Image" hint="Upload PNG, SVG, JPG, or WebP. Recommended: transparent or white background. Min 200px width.">
                  <ImageUploader
                    currentUrl={clientLogoPreview}
                    onUploaded={url => { setNewClientUrl(url); setClientLogoPreview(url); }}
                    label="Click to upload logo (PNG, SVG, JPG, WebP)"
                    folder="client-logos"
                    size="md"
                  />
                </Field>
              </div>
              <div className="flex flex-col justify-between">
                {/* Preview of what it'll look like */}
                <div className="rounded-xl p-5 flex flex-col items-center justify-center gap-4"
                  style={{ background: '#0B0B0B', border: '1px solid #1f2937', minHeight: '160px' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#374151' }}>Preview on Website</p>
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '130px', height: '80px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                    {clientLogoPreview ? (
                      <img src={clientLogoPreview} alt="preview"
                        style={{ maxHeight: '60px', maxWidth: '120px', objectFit: 'contain', filter: 'none', opacity: 1 }} />
                    ) : (
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>Logo preview</span>
                    )}
                  </div>
                  <p className="text-[9px]" style={{ color: '#374151' }}>Full color on white background</p>
                </div>
                <button onClick={addClientLogo} disabled={saving || !newClientName.trim()}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl text-black transition-all hover:scale-[1.02] disabled:opacity-50 mt-4"
                  style={{ background: '#ED8214', boxShadow: '0 4px 14px rgba(237,130,20,0.25)' }}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add to Marquee
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Logos Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: '#374151' }}>All Logos ({sorted.length})</h2>
          <span className="text-xs" style={{ color: '#4b5563' }}>Drag up/down arrows to reorder</span>
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ background: '#111827', border: '1px dashed #1f2937' }}>
            <Users className="h-10 w-10 mx-auto mb-3" style={{ color: '#374151' }} />
            <p className="text-sm" style={{ color: '#4b5563' }}>No logos yet. Add your first client logo above.</p>
          </div>
        )}

        <div className="space-y-3">
          {sorted.map((cl, idx) => (
            <div key={cl.id}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{ background: '#111827', border: `1px solid ${cl.is_active ? '#1f2937' : '#0f172a'}`, opacity: cl.is_active ? 1 : 0.55 }}>
              <div className="flex items-center gap-4 px-5 py-4">

                {/* Reorder arrows */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button onClick={() => moveClientLogo(cl.id, 'up')} disabled={idx === 0}
                    className="w-6 h-5 flex items-center justify-center rounded transition-colors hover:bg-white/5 disabled:opacity-20"
                    style={{ color: '#6b7280' }}>
                    <svg width="10" height="7" viewBox="0 0 10 7" fill="currentColor"><path d="M5 0L10 7H0L5 0Z"/></svg>
                  </button>
                  <button onClick={() => moveClientLogo(cl.id, 'down')} disabled={idx === sorted.length - 1}
                    className="w-6 h-5 flex items-center justify-center rounded transition-colors hover:bg-white/5 disabled:opacity-20"
                    style={{ color: '#6b7280' }}>
                    <svg width="10" height="7" viewBox="0 0 10 7" fill="currentColor"><path d="M5 7L0 0H10L5 7Z"/></svg>
                  </button>
                </div>

                {/* Logo preview */}
                <div className="shrink-0 w-20 h-12 rounded-lg flex items-center justify-center overflow-hidden"
                  style={{ background: '#0B0B0B', border: '1px solid #1f2937' }}>
                  {cl.logo_url ? (
                    <img src={cl.logo_url} alt={cl.name}
                      style={{ maxHeight: '40px', maxWidth: '70px', objectFit: 'contain', filter: 'grayscale(0.6)', opacity: 0.8 }} />
                  ) : (
                    <span style={{ fontSize: '9px', color: '#374151', textAlign: 'center' }}>No logo</span>
                  )}
                </div>

                {/* Name input */}
                <div className="flex-1 min-w-0">
                  <input
                    value={cl.name}
                    onChange={e => setClientLogosDB(prev => prev.map(c => c.id === cl.id ? { ...c, name: e.target.value } : c))}
                    className="w-full bg-transparent text-white font-bold text-sm outline-none border-b transition-colors"
                    style={{ borderColor: '#374151', paddingBottom: '2px' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#ED8214'}
                    onBlur={e => e.currentTarget.style.borderColor = '#374151'}
                    placeholder="Client name"
                  />
                  <p className="text-[10px] mt-1 truncate" style={{ color: '#4b5563' }}>
                    {cl.logo_url ? `✓ Logo uploaded` : '⚠ No logo uploaded yet'}
                  </p>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4b5563' }}>Show</span>
                  <Toggle
                    checked={cl.is_active}
                    onChange={v => {
                      const updated = { ...cl, is_active: v };
                      setClientLogosDB(prev => prev.map(c => c.id === cl.id ? updated : c));
                      updateClientLogo(updated);
                    }}
                  />
                </div>

                {/* Upload logo */}
                <button
                  onClick={() => document.getElementById(`logo-upload-${cl.id}`)?.click()}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors hover:bg-white/5 shrink-0"
                  style={{ color: '#ED8214', border: '1px solid rgba(237,130,20,0.2)' }}>
                  <Upload className="h-3.5 w-3.5" /> Upload
                </button>
                <input id={`logo-upload-${cl.id}`} type="file" accept="image/*" className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const ext = file.name.split('.').pop();
                    const filename = `client-logos/${Date.now()}_${cl.id}.${ext}`;
                    const { error } = await supabase.storage.from('cms-media').upload(filename, file, { upsert: true });
                    if (error) { notify('Upload failed', 'error'); return; }
                    const { data: urlData } = supabase.storage.from('cms-media').getPublicUrl(filename);
                    const updated = { ...cl, logo_url: urlData.publicUrl };
                    setClientLogosDB(prev => prev.map(c => c.id === cl.id ? updated : c));
                    await updateClientLogo(updated);
                    notify('✅ Logo uploaded and saved!');
                    e.target.value = '';
                  }} />

                {/* Save */}
                <button onClick={() => updateClientLogo(cl)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors shrink-0"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <Save className="h-3.5 w-3.5" /> Save
                </button>

                {/* Delete */}
                <button onClick={() => deleteClientLogo(cl.id)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors hover:bg-red-900/20 shrink-0"
                  style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Logo upload area (expand on demand) */}
              {cl.logo_url === '' && (
                <div className="px-5 pb-4">
                  <ImageUploader
                    currentUrl={cl.logo_url}
                    onUploaded={async url => {
                      const updated = { ...cl, logo_url: url };
                      setClientLogosDB(prev => prev.map(c => c.id === cl.id ? updated : c));
                      await updateClientLogo(updated);
                      notify('✅ Logo saved!');
                    }}
                    label="Upload logo (PNG, SVG, JPG, WebP)"
                    folder="client-logos"
                    size="sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  // ──────────────────────────────────────────────────────────────

  const sectionRenderer: Record<Section, () => React.ReactNode> = {
    'dashboard': renderDashboard,
    'site-settings': renderSiteSettings,
    'social-links': renderSocialLinks,
    'logos': renderLogos,
    'hero-sections': () => <div />,
    'stats': renderStats,
    'services': renderServices,
    'portfolio': renderPortfolio,
    'team': renderTeam,
    'testimonials': renderTestimonials,
    'media': renderMedia,
    'about': () => <div />,
    'inbox': renderInbox,
    'page-home': renderPageHome,
    'page-about': renderPageAbout,
    'page-services': renderPageServices,
    'page-portfolio': renderPagePortfolio,
    'page-contact': renderPageContact,
    'clients-management': renderClientsManagement,
  };

  const sectionTitles: Record<Section, string> = {
    'dashboard': 'Dashboard', 'page-home': 'Home Page', 'page-about': 'About Page',
    'page-services': 'Services Page', 'page-portfolio': 'Portfolio Page', 'page-contact': 'Contact Page',
    'site-settings': 'Site Settings', 'social-links': 'Social Media', 'logos': 'Logos & Favicon',
    'hero-sections': 'Hero Sections', 'stats': 'Stats & Numbers', 'services': 'Service Cards',
    'portfolio': 'Portfolio Projects', 'team': 'Team Members', 'testimonials': 'Testimonials',
    'media': 'Media Library', 'about': 'About Content', 'inbox': 'Inbox',
    'clients-management': '✨ Client Logos Management',
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#060608', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #374151; }
        select option { background: #0f172a; }
      `}</style>

      {/* Sidebar */}
      <aside className="shrink-0 flex flex-col transition-all duration-300 z-40"
        style={{ width: sidebarOpen ? 232 : 60, background: '#0c0c0e', borderRight: '1px solid #141418', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 p-4 shrink-0" style={{ borderBottom: '1px solid #141418' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: 'rgba(237,130,20,0.1)', border: '1px solid rgba(237,130,20,0.2)' }}>
            <img src="/images/mopi_logo_20260101_112924.png" alt="MOPi" className="h-6 w-6 object-contain" />
          </div>
          {sidebarOpen && <span className="font-black text-xs tracking-widest uppercase text-white truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>CMS Admin</span>}
          <button onClick={() => setSidebarOpen(p => !p)} className="ml-auto shrink-0 p-1 rounded-lg hover:bg-white/5 transition-colors" style={{ color: '#4b5563' }}>
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {navGroups.map(group => (
            <div key={group.label} className="mb-4">
              {sidebarOpen && <p className="text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 mb-1" style={{ color: '#2d2d35' }}>{group.label}</p>}
              {group.items.map(item => {
                const active = section === item.id;
                return (
                  <button key={item.id} onClick={() => setSection(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all text-left"
                    style={{ background: active ? 'rgba(237,130,20,0.1)' : 'transparent', color: active ? '#ED8214' : (('color' in item && item.color) ? item.color + 'aa' : '#4b5563'), border: active ? '1px solid rgba(237,130,20,0.15)' : '1px solid transparent' }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = ('color' in item && item.color) ? (item.color as string) : '#9ca3af'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ('color' in item && item.color) ? (item.color as string) + 'aa' : '#4b5563'; } }}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    {sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-2 shrink-0" style={{ borderTop: '1px solid #141418' }}>
          <Link to="/" target="_blank" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all" style={{ color: '#4b5563' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#9ca3af')} onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}>
            <ExternalLink className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span className="text-sm">View Website</span>}
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all" style={{ color: '#4b5563' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')} onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}>
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto" style={{ minWidth: 0 }}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5" style={{ background: 'rgba(6,6,8,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #141418' }}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white">{sectionTitles[section]}</span>
            {saving && <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(237,130,20,0.1)', color: '#ED8214', border: '1px solid rgba(237,130,20,0.2)' }}><Loader2 className="h-3 w-3 animate-spin" />Saving...</div>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchAll} className="p-2 rounded-lg transition-all hover:text-[#ED8214] hover:bg-white/5" style={{ color: '#4b5563', border: '1px solid #1f2937' }} title="Refresh data">
              <RefreshCw className="h-4 w-4" />
            </button>
            <Link to="/" target="_blank" className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition-all hover:text-[#ED8214]" style={{ color: '#6b7280', border: '1px solid #1f2937' }}>
              <ExternalLink className="h-3.5 w-3.5" />Live Site
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-5xl">
          {!loaded ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(237,130,20,0.1)' }}>
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#ED8214' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Loading CMS data...</p>
            </div>
          ) : (
            <div style={{ animation: 'fadeUp 0.3s ease' }}>
              {sectionRenderer[section]()}
            </div>
          )}
        </div>
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────────

function PageHeader({ title, subtitle, icon: Icon, color, page, liveUrl }: {
  title: string; subtitle: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string; page?: string; liveUrl?: string;
}) {
  return (
    <div className="mb-7 pb-5" style={{ borderBottom: '1px solid #1f2937' }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>{subtitle}</p>
          </div>
        </div>
        {liveUrl && (
          <Link to={liveUrl} target="_blank"
            className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all hover:scale-105"
            style={{ color: color, background: `${color}12`, border: `1px solid ${color}30` }}>
            <ExternalLink className="h-3.5 w-3.5" />Preview Page
          </Link>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl" style={{ background: 'rgba(237,130,20,0.05)', border: '1px solid rgba(237,130,20,0.12)' }}>
        <span style={{ color: '#ED8214' }}>💡</span>
        <span style={{ color: '#9ca3af' }}>All changes save directly to your live website. Each section has its own "Save Section" button.</span>
        <span className="ml-1 font-bold" style={{ color: '#ED8214' }}>🇬🇧 English (left) · 🇸🇦 Arabic (right)</span>
      </div>
    </div>
  );
}

function AddSocialForm({ onSave }: { onSave: (item: { platform: string; url: string; icon: string; is_active: boolean; sort_order: number }) => void }) {
  const [form, setForm] = useState({ platform: '', url: '', icon: '', is_active: true, sort_order: 10 });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Platform Name</label>
          <input value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))} placeholder="e.g. TikTok, Snapchat"
            className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Profile URL</label>
          <input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..."
            className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
        </div>
      </div>
      <button onClick={() => { if (form.platform && form.url) { onSave({ ...form, icon: form.platform }); setForm({ platform: '', url: '', icon: '', is_active: true, sort_order: 10 }); } }}
        className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-black hover:scale-105 transition-all"
        style={{ background: '#ED8214' }}>
        <Plus className="h-4 w-4" />Add Social Link
      </button>
    </div>
  );
}
