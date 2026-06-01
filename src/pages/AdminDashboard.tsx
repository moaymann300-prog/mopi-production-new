import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard, Settings, Image, Globe, FileText, Briefcase,
  Users, MessageSquare, Star, BarChart2, LogIn, LogOut, Eye,
  EyeOff, Save, Plus, Trash2, Upload, X, Check,
  ChevronDown, Menu, AlertCircle, Loader2,
  Instagram, Facebook, Youtube, Linkedin, Phone, Mail, MapPin,
  Hash, Link2, Layers, Zap, Award, Wrench, Palette, Package,
  Home, Info, Server, RefreshCw, ExternalLink, Type, PenLine,
  BookOpen, Megaphone, MessageCircle,
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
interface PageContent { id: number; page: string; section: string; field: string; value_en: string; value_ar: string; }
interface PageImage { id: number; page: string; section: string; image_key: string; image_url: string; alt_en: string; alt_ar: string; sort_order: number; }

type Section =
  | 'dashboard' | 'site-settings' | 'social-links' | 'logos'
  | 'hero-sections' | 'stats' | 'services' | 'portfolio'
  | 'team' | 'testimonials' | 'media' | 'about' | 'inbox'
  | 'page-home' | 'page-about' | 'page-services' | 'page-portfolio' | 'page-contact';

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold animate-[fadeUp_0.3s_ease]"
    style={{ background: type === 'success' ? '#16a34a' : '#dc2626', color: '#fff', maxWidth: 320 }}>
    {type === 'success' ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
    <span className="flex-1">{msg}</span>
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="h-4 w-4" /></button>
  </div>
);

// ─── ImageUploader ─────────────────────────────────────────────────────────────
const ImageUploader = ({
  currentUrl, onUploaded, label = 'Click or drag to upload photo', folder = 'general', compact = false
}: {
  currentUrl?: string; onUploaded: (url: string) => void;
  label?: string; folder?: string; compact?: boolean;
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

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer rounded-xl overflow-hidden border-2 border-dashed transition-all hover:border-[#ED8214] group"
        style={{ borderColor: preview ? '#ED8214' : '#374151', background: '#0a0e1a', minHeight: compact ? 72 : 110 }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
        {preview ? (
          <img src={preview} alt="preview" className={`w-full object-cover ${compact ? 'h-20' : 'h-28'}`} />
        ) : (
          <div className={`flex flex-col items-center justify-center gap-2 ${compact ? 'h-16' : 'h-24'}`}>
            <Upload className="h-5 w-5" style={{ color: '#4b5563' }} />
            <span className="text-xs text-center px-3" style={{ color: '#6b7280' }}>{label}</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }}>
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#ED8214' }} />
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-bold" style={{ background: '#ED8214', color: '#000' }}>
            <Upload className="h-3 w-3" />Upload
          </span>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      {preview && (
        <div className="mt-2 flex gap-2 items-center">
          <span className="flex-1 text-xs truncate px-2 py-1 rounded" style={{ background: '#111827', color: '#6b7280', border: '1px solid #1f2937' }}>
            ✓ Photo uploaded
          </span>
          <button onClick={(e) => { e.stopPropagation(); setPreview(''); onUploaded(''); }}
            className="p-1.5 rounded hover:bg-red-900/30 shrink-0" style={{ color: '#ef4444' }}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── UI Helpers ───────────────────────────────────────────────────────────────
const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div>
    <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>{label}</label>
    {children}
    {hint && <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{hint}</p>}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full px-3 py-2.5 rounded-lg text-sm transition-all"
    style={{ background: '#111827', border: '1px solid #374151', color: '#f3f4f6', ...props.style }}
    onFocus={e => (e.currentTarget.style.borderColor = '#ED8214')}
    onBlur={e => (e.currentTarget.style.borderColor = '#374151')} />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full px-3 py-2.5 rounded-lg text-sm transition-all resize-none" rows={props.rows || 3}
    style={{ background: '#111827', border: '1px solid #374151', color: '#f3f4f6', ...props.style }}
    onFocus={e => (e.currentTarget.style.borderColor = '#ED8214')}
    onBlur={e => (e.currentTarget.style.borderColor = '#374151')} />
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button onClick={() => onChange(!checked)} className="relative inline-flex h-6 w-11 rounded-full transition-colors"
    style={{ background: checked ? '#ED8214' : '#374151' }}>
    <span className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform mt-0.5"
      style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }} />
  </button>
);

// Bilingual text editor (EN + AR side by side)
const BilingualField = ({
  label, valueEn, valueAr, onChangeEn, onChangeAr, multiline = false, rows = 3
}: {
  label: string; valueEn: string; valueAr: string;
  onChangeEn: (v: string) => void; onChangeAr: (v: string) => void;
  multiline?: boolean; rows?: number;
}) => (
  <div>
    <label className="block text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: '#9ca3af' }}>{label}</label>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-[10px] mb-1 flex items-center gap-1 font-semibold" style={{ color: '#ED8214' }}>
          🇬🇧 English
        </p>
        {multiline
          ? <Textarea rows={rows} value={valueEn} onChange={e => onChangeEn(e.target.value)} placeholder="English text..." />
          : <Input value={valueEn} onChange={e => onChangeEn(e.target.value)} placeholder="English text..." />
        }
      </div>
      <div>
        <p className="text-[10px] mb-1 flex items-center gap-1 font-semibold" style={{ color: '#60a5fa' }}>
          🇸🇦 Arabic
        </p>
        {multiline
          ? <Textarea rows={rows} value={valueAr} onChange={e => onChangeAr(e.target.value)}
              placeholder="النص العربي..." style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif" }} />
          : <Input value={valueAr} onChange={e => onChangeAr(e.target.value)}
              placeholder="النص العربي..." style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif" }} />
        }
      </div>
    </div>
  </div>
);

// ─── Main Admin Dashboard ──────────────────────────────────────────────────────
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

  // Data state
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
  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [pageImages, setPageImages] = useState<PageImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Login ──
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

  // ── Fetch all data ──
  const fetchAll = useCallback(async () => {
    const [s, sl, lg, h, st, sv, pf, tm, ts, md, ab, ib, pc, pi] = await Promise.all([
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
    setLoaded(true);
  }, []);

  useEffect(() => { if (authed) fetchAll(); }, [authed, fetchAll]);

  const logout = async () => { await supabase.auth.signOut(); setAuthed(false); };

  // ════════════════ SAVE HANDLERS ════════════════

  const saveSetting = async (item: SiteSetting) => {
    setSaving(true);
    const { error } = await supabase.from('cms_site_settings_2026_04_21').update({ value: item.value, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error'); else notify('Setting saved!');
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
    if (error) notify('Save failed: ' + error.message, 'error'); else notify('Hero section saved!');
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
    notify('Stat deleted!'); fetchAll();
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
    notify('Service deleted!'); fetchAll();
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
    notify('Project deleted!'); fetchAll();
  };

  const saveTeam = async (item: TeamMember) => {
    const payload = { name: item.name, role: item.role, bio: item.bio, image_url: item.image_url, email: item.email, linkedin_url: item.linkedin_url, sort_order: item.sort_order, is_active: item.is_active };
    const { error } = item.id
      ? await supabase.from('cms_team_2026_04_21').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_team_2026_04_21').insert([payload]);
    if (error) notify('Save failed: ' + error.message, 'error'); else { notify('Team member saved!'); fetchAll(); }
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
    if (error) notify('Save failed: ' + error.message, 'error'); else { notify('Testimonial saved!'); fetchAll(); }
  };
  const deleteTestimonial = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('cms_testimonials_2026_04_21').delete().eq('id', id);
    notify('Deleted!'); fetchAll();
  };

  const saveAbout = async (item: AboutContent) => {
    const { error } = await supabase.from('cms_about_content_2026_04_21').update({ title: item.title, content: item.content, image_url: item.image_url, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error'); else notify('About section saved!');
  };

  const updateInboxStatus = async (id: number, status: string) => {
    await supabase.from('cms_contact_submissions_2026_04_21').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    notify('Status updated!'); fetchAll();
  };
  const deleteInbox = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('cms_contact_submissions_2026_04_21').delete().eq('id', id);
    notify('Message deleted!'); fetchAll();
  };

  const handleMediaUpload = async (file: File) => {
    try {
      const ext = file.name.split('.').pop();
      const filename = `media/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage.from('cms-media').upload(filename, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('cms-media').getPublicUrl(filename);
      await supabase.from('cms_media_2026_04_21').insert([{ filename: file.name, url: data.publicUrl, alt_text: file.name.replace(`.${ext}`, ''), category: 'general', file_type: 'image', file_size: file.size }]);
      notify('Image uploaded!'); fetchAll();
    } catch {
      notify('Upload failed', 'error');
    }
  };
  const deleteMedia = async (item: MediaItem) => {
    if (!confirm('Delete this image?')) return;
    await supabase.from('cms_media_2026_04_21').delete().eq('id', item.id);
    notify('Deleted!'); fetchAll();
  };

  // Page content save
  const savePageContent = async (item: PageContent) => {
    setSaving(true);
    const { error } = await supabase.from('cms_page_content_2026_06_01')
      .update({ value_en: item.value_en, value_ar: item.value_ar, updated_at: new Date().toISOString() })
      .eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error'); else notify('Content saved!');
    setSaving(false);
  };

  const savePageContentBulk = async (items: PageContent[]) => {
    setSaving(true);
    let hasError = false;
    for (const item of items) {
      const { error } = await supabase.from('cms_page_content_2026_06_01')
        .update({ value_en: item.value_en, value_ar: item.value_ar, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      if (error) { hasError = true; }
    }
    if (hasError) notify('Some items failed to save', 'error'); else notify('All content saved!');
    setSaving(false);
  };

  // Page image save
  const savePageImage = async (item: PageImage) => {
    setSaving(true);
    const { error } = await supabase.from('cms_page_images_2026_06_01')
      .update({ image_url: item.image_url, alt_en: item.alt_en, alt_ar: item.alt_ar, updated_at: new Date().toISOString() })
      .eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error'); else notify('Image saved!');
    setSaving(false);
  };

  // Helper: get page content item
  const getPC = (page: string, section: string, field: string) =>
    pageContent.find(p => p.page === page && p.section === section && p.field === field);

  const updatePC = (id: number, en: string, ar: string) => {
    setPageContent(prev => prev.map(p => p.id === id ? { ...p, value_en: en, value_ar: ar } : p));
  };

  const getPI = (page: string, section: string, key: string) =>
    pageImages.find(p => p.page === page && p.section === section && p.image_key === key);

  const updatePI = (id: number, url: string) => {
    setPageImages(prev => prev.map(p => p.id === id ? { ...p, image_url: url } : p));
  };

  // ════════════════ LOGIN SCREEN ════════════════
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#000', fontFamily: "'Inter', sans-serif" }}>
        <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
        <div className="w-full max-w-sm" style={{ animation: 'fadeUp 0.5s ease' }}>
          <div className="text-center mb-8">
            <img src="/images/mopi_logo_20260101_112924.png" alt="MOPi" className="h-14 w-auto object-contain mx-auto mb-4" />
            <h1 className="text-xl font-black text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Admin Dashboard</h1>
            <p className="text-sm" style={{ color: '#6b7280' }}>Sign in to manage your website</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 p-7 rounded-2xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Email</label>
              <Input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="admin@mopiproduction.com" required />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Password</label>
              <div className="relative">
                <Input type={showPwd ? 'text' : 'password'} value={loginPwd} onChange={e => setLoginPwd(e.target.value)} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }}>
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {loginError && <p className="text-xs py-2 px-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(220,38,38,0.1)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.2)' }}><AlertCircle className="h-3.5 w-3.5" />{loginError}</p>}
            <button type="submit" disabled={loginLoading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{ background: '#ED8214', boxShadow: '0 6px 20px rgba(237,130,20,0.3)' }}>
              {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-xs mt-3">
              <Link to="/" className="hover:underline" style={{ color: '#6b7280' }}>← Back to Website</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ════════════════ SIDEBAR CONFIG ════════════════
  const sidebarGroups = [
    {
      label: 'Overview', items: [
        { id: 'dashboard' as Section, icon: LayoutDashboard, label: 'Dashboard' },
      ]
    },
    {
      label: 'Global', items: [
        { id: 'site-settings' as Section, icon: Settings, label: 'Site Settings' },
        { id: 'social-links' as Section, icon: Globe, label: 'Social Media' },
        { id: 'logos' as Section, icon: Image, label: 'Logos' },
      ]
    },
    {
      label: 'Page Content', items: [
        { id: 'page-home' as Section, icon: Home, label: 'Homepage Texts' },
        { id: 'page-about' as Section, icon: Info, label: 'About Page Texts' },
        { id: 'page-services' as Section, icon: Briefcase, label: 'Services Page Texts' },
        { id: 'page-portfolio' as Section, icon: Layers, label: 'Portfolio Page Texts' },
        { id: 'page-contact' as Section, icon: MessageCircle, label: 'Contact Page Texts' },
      ]
    },
    {
      label: 'Data & Content', items: [
        { id: 'hero-sections' as Section, icon: Megaphone, label: 'Hero Sections' },
        { id: 'stats' as Section, icon: BarChart2, label: 'Stats & Numbers' },
        { id: 'about' as Section, icon: BookOpen, label: 'About Content' },
        { id: 'services' as Section, icon: Wrench, label: 'Services' },
        { id: 'portfolio' as Section, icon: Palette, label: 'Portfolio' },
        { id: 'team' as Section, icon: Users, label: 'Team Members' },
        { id: 'testimonials' as Section, icon: Star, label: 'Testimonials' },
        { id: 'media' as Section, icon: Image, label: 'Media Library' },
        { id: 'inbox' as Section, icon: MessageSquare, label: `Inbox ${inbox.filter(m => m.status === 'new').length > 0 ? `(${inbox.filter(m => m.status === 'new').length})` : ''}` },
      ]
    },
  ];

  const unreadCount = inbox.filter(m => m.status === 'new').length;

  // ════════════════ PAGE CONTENT EDITOR HELPER ════════════════

  const renderPageContentSection = (
    pageName: string,
    sectionName: string,
    sectionLabel: string,
    fields: { field: string; label: string; multiline?: boolean; rows?: number }[],
    imageKeys?: { key: string; label: string }[],
    accent?: string
  ) => {
    const sectionItems = fields.map(f => getPC(pageName, sectionName, f.field)).filter(Boolean) as PageContent[];
    const sectionImageItems = (imageKeys || []).map(k => getPI(pageName, sectionName, k.key)).filter(Boolean) as PageImage[];

    return (
      <div key={`${pageName}-${sectionName}`} className="mb-6 p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: accent || '#ED8214' }}>
            <span className="w-4 h-px block" style={{ background: accent || '#ED8214' }} />{sectionLabel}
          </h3>
          <button
            onClick={() => savePageContentBulk(sectionItems)}
            disabled={saving}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all hover:scale-105"
            style={{ background: '#ED8214' }}>
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
            Save Section
          </button>
        </div>

        <div className="space-y-4">
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
              />
            );
          })}

          {/* Image uploads for this section */}
          {imageKeys && imageKeys.length > 0 && sectionImageItems.length > 0 && (
            <div className="pt-2 border-t" style={{ borderColor: '#1f2937' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6b7280' }}>Section Photos</p>
              <div className="grid grid-cols-2 gap-4">
                {imageKeys.map(ik => {
                  const imgItem = getPI(pageName, sectionName, ik.key);
                  if (!imgItem) return null;
                  return (
                    <div key={ik.key}>
                      <Field label={ik.label}>
                        <ImageUploader
                          currentUrl={imgItem.image_url}
                          onUploaded={url => {
                            updatePI(imgItem.id, url);
                            savePageImage({ ...imgItem, image_url: url });
                          }}
                          folder={`pages/${pageName}`}
                          label={`Upload ${ik.label}`}
                        />
                      </Field>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ════════════════ SECTION RENDERERS ════════════════

  const renderDashboard = () => (
    <div>
      <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Services', count: services.length, icon: Briefcase, color: '#3b82f6' },
          { label: 'Portfolio', count: portfolio.length, icon: Layers, color: '#8b5cf6' },
          { label: 'Team', count: team.length, icon: Users, color: '#10b981' },
          { label: 'New Messages', count: unreadCount, icon: MessageSquare, color: '#ED8214' },
        ].map(c => (
          <div key={c.label} className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${c.color}20` }}>
                <c.icon className="h-4 w-4" style={{ color: c.color }} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6b7280' }}>{c.label}</span>
            </div>
            <div className="text-3xl font-black" style={{ color: c.color, fontFamily: "'Poppins', sans-serif" }}>{c.count}</div>
          </div>
        ))}
      </div>
      {/* Quick access guide */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
          <h3 className="font-bold text-sm mb-4 text-white flex items-center gap-2"><Type className="h-4 w-4" style={{ color: '#ED8214' }} />Text & Content Control</h3>
          <div className="space-y-1.5">
            {[
              { id: 'page-home', label: '🏠 Homepage — Every text, every word', desc: 'Hero, About, Services, Why Us, Process, CTA, Footer' },
              { id: 'page-about', label: '👥 About Page — Full content control', desc: 'Hero, Story, Mission, Values sections' },
              { id: 'page-services', label: '⚙️ Services Page — All text blocks', desc: 'Hero, CTA sections' },
              { id: 'page-portfolio', label: '🖼️ Portfolio Page — Page texts', desc: 'Hero section, category labels' },
              { id: 'page-contact', label: '📞 Contact Page — All labels', desc: 'Hero, contact info labels' },
            ].map(item => (
              <button key={item.id} onClick={() => setSection(item.id as Section)}
                className="w-full text-left px-3 py-2 rounded-lg transition-all hover:text-[#ED8214] group"
                style={{ background: '#0f172a' }}>
                <p className="text-sm font-semibold text-white group-hover:text-[#ED8214] transition-colors">{item.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#4b5563' }}>{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
          <h3 className="font-bold text-sm mb-4 text-white flex items-center gap-2"><Image className="h-4 w-4" style={{ color: '#ED8214' }} />Data & Photos Control</h3>
          <div className="space-y-1.5">
            {[
              { id: 'services', label: '⚙️ Services — Title, desc, photo per service' },
              { id: 'portfolio', label: '🖼️ Portfolio — Project photos & details' },
              { id: 'team', label: '👤 Team — Member photos & bios' },
              { id: 'testimonials', label: '⭐ Testimonials — Client photos & quotes' },
              { id: 'logos', label: '🔰 Logos — Header, footer, favicon upload' },
              { id: 'media', label: '📁 Media Library — All uploaded photos' },
            ].map(item => (
              <button key={item.id} onClick={() => setSection(item.id as Section)}
                className="w-full text-left px-3 py-2 rounded-lg transition-all text-sm font-semibold text-white hover:text-[#ED8214] transition-colors"
                style={{ background: '#0f172a' }}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
          <h3 className="font-bold text-sm mb-4 text-white flex items-center gap-2"><MessageSquare className="h-4 w-4" style={{ color: '#ED8214' }} />Recent Messages</h3>
          {inbox.slice(0, 4).map(m => (
            <div key={m.id} className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid #1f2937' }}>
              <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: m.status === 'new' ? '#ED8214' : '#374151' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{m.name}</p>
                <p className="text-xs truncate" style={{ color: '#6b7280' }}>{m.message}</p>
              </div>
              <span className="text-[10px] shrink-0" style={{ color: '#4b5563' }}>{new Date(m.created_at).toLocaleDateString()}</span>
            </div>
          ))}
          {inbox.length === 0 && <p className="text-sm" style={{ color: '#4b5563' }}>No messages yet.</p>}
        </div>
        <div className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
          <h3 className="font-bold text-sm mb-4 text-white flex items-center gap-2"><Server className="h-4 w-4" style={{ color: '#ED8214' }} />Quick Links</h3>
          <div className="space-y-2">
            {[
              { label: 'Homepage', url: '/' }, { label: 'About Page', url: '/about' },
              { label: 'Services Page', url: '/services' }, { label: 'Portfolio Page', url: '/portfolio' },
              { label: 'Contact Page', url: '/contact' },
            ].map(l => (
              <Link key={l.url} to={l.url} target="_blank"
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all hover:text-[#ED8214]"
                style={{ color: '#9ca3af', background: '#0f172a' }}>
                <ExternalLink className="h-3.5 w-3.5" />{l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSiteSettings = () => {
    const groups = [...new Set(settings.map(s => s.group_name))];
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Site Settings</h2>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Contact info, company name, WhatsApp number, email addresses</p>
          </div>
          <button onClick={fetchAll} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all hover:text-[#ED8214]" style={{ color: '#6b7280', background: '#111827', border: '1px solid #1f2937' }}>
            <RefreshCw className="h-3.5 w-3.5" />Refresh
          </button>
        </div>
        {groups.map(g => (
          <div key={g} className="mb-7 p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: '#ED8214' }}>
              <span className="w-4 h-px block" style={{ background: '#ED8214' }} />{g}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {settings.filter(s => s.group_name === g).map(s => (
                <div key={s.id}>
                  <Field label={s.label}>
                    <div className="flex gap-2">
                      <Input value={s.value || ''} onChange={e => setSettings(prev => prev.map(x => x.id === s.id ? { ...x, value: e.target.value } : x))} />
                      <button onClick={() => saveSetting(s)} className="px-3 py-2 rounded-lg text-white text-xs font-bold shrink-0 transition-all hover:scale-105" style={{ background: '#ED8214' }}>
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  </Field>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSocialLinks = () => (
    <div>
      <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Social Media Links</h2>
      <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Manage your social media profile links.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {socials.map(s => (
          <div key={s.id} className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(237,130,20,0.1)', border: '1px solid rgba(237,130,20,0.2)' }}>
                  {s.platform === 'Instagram' && <Instagram className="h-4 w-4" style={{ color: '#ED8214' }} />}
                  {s.platform === 'Facebook' && <Facebook className="h-4 w-4" style={{ color: '#ED8214' }} />}
                  {s.platform === 'LinkedIn' && <Linkedin className="h-4 w-4" style={{ color: '#ED8214' }} />}
                  {s.platform === 'YouTube' && <Youtube className="h-4 w-4" style={{ color: '#ED8214' }} />}
                  {!['Instagram', 'Facebook', 'LinkedIn', 'YouTube'].includes(s.platform) && <Link2 className="h-4 w-4" style={{ color: '#ED8214' }} />}
                </div>
                <span className="font-bold text-sm text-white">{s.platform}</span>
              </div>
              <Toggle checked={s.is_active} onChange={v => setSocials(prev => prev.map(x => x.id === s.id ? { ...x, is_active: v } : x))} />
            </div>
            <Field label="Profile / Page URL">
              <div className="flex gap-2">
                <Input value={s.url} onChange={e => setSocials(prev => prev.map(x => x.id === s.id ? { ...x, url: e.target.value } : x))} />
                <button onClick={() => saveSocial(s)} className="px-3 rounded-lg text-white shrink-0 transition-all hover:scale-105" style={{ background: '#ED8214' }}>
                  <Save className="h-4 w-4" />
                </button>
              </div>
            </Field>
          </div>
        ))}
      </div>
      <div className="mt-4 p-5 rounded-xl" style={{ background: '#111827', border: '1px dashed #374151' }}>
        <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2"><Plus className="h-4 w-4" style={{ color: '#ED8214' }} />Add New Social Link</h3>
        <NewSocialForm onSave={async (item) => { await saveSocial({ ...item, id: 0 }); }} />
      </div>
    </div>
  );

  const renderLogos = () => (
    <div>
      <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Logo Management</h2>
      <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Upload logos for the header, footer, and favicon (browser tab icon).</p>
      <div className="grid md:grid-cols-2 gap-5">
        {logos.map(logo => (
          <div key={logo.id} className="p-6 rounded-xl" style={{ background: '#111827', border: logo.placement === 'favicon' ? '1px solid rgba(237,130,20,0.4)' : '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white">{logo.name}</h3>
                  {logo.placement === 'favicon' && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(237,130,20,0.15)', color: '#ED8214', border: '1px solid rgba(237,130,20,0.3)' }}>Browser Tab</span>
                  )}
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(237,130,20,0.1)', color: '#ED8214' }}>{logo.placement}</span>
              </div>
              <Toggle checked={logo.is_active} onChange={v => setLogos(prev => prev.map(x => x.id === logo.id ? { ...x, is_active: v } : x))} />
            </div>
            {logo.placement === 'favicon' ? (
              <div className="mb-4 space-y-2">
                <div className="p-3 rounded-lg flex items-center justify-center" style={{ background: '#000', border: '1px solid #374151', minHeight: 70 }}>
                  {logo.url ? <img src={logo.url} alt={logo.alt_text} className="object-contain" style={{ width: 32, height: 32 }} /> : <span className="text-xs" style={{ color: '#4b5563' }}>No favicon set</span>}
                </div>
              </div>
            ) : (
              <div className="mb-4 p-4 rounded-lg flex items-center justify-center" style={{ background: '#000', border: '1px solid #374151', minHeight: 90 }}>
                {logo.url ? <img src={logo.url} alt={logo.alt_text} className="max-h-16 max-w-full object-contain" /> : <span className="text-xs" style={{ color: '#4b5563' }}>No logo set</span>}
              </div>
            )}
            <div className="space-y-3">
              <Field label={logo.placement === 'favicon' ? 'Upload Favicon (32×32 PNG/ICO recommended)' : 'Upload New Logo'}>
                <ImageUploader currentUrl="" onUploaded={url => setLogos(prev => prev.map(x => x.id === logo.id ? { ...x, url } : x))} label="Click to upload logo file" folder="logos" />
              </Field>
              <Field label="Alt Text">
                <Input value={logo.alt_text} onChange={e => setLogos(prev => prev.map(x => x.id === logo.id ? { ...x, alt_text: e.target.value } : x))} />
              </Field>
              <button onClick={() => saveLogo(logo)} className="w-full py-2.5 rounded-lg text-white font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{ background: '#ED8214' }}>
                <Save className="h-4 w-4" />{logo.placement === 'favicon' ? 'Save Favicon' : 'Save Logo'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHeroSections = () => (
    <div>
      <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Hero Sections</h2>
      <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Control the hero banner on each page — text, CTA buttons, and background image.</p>
      <div className="space-y-5">
        {heroes.map(hero => (
          <HeroEditor key={hero.id} hero={hero} onSave={saveHero} saving={saving} />
        ))}
      </div>
    </div>
  );

  const renderStats = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Stats & Numbers</h2>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Numbers shown in the achievements section (e.g. 500+ Projects)</p>
        </div>
        <button onClick={() => setStats(prev => [...prev, { id: 0, label: 'New Stat', value: 0, suffix: '+', sort_order: prev.length, is_active: true }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white transition-all hover:scale-105"
          style={{ background: '#ED8214' }}>
          <Plus className="h-4 w-4" />Add Stat
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.id || `new-${i}`} className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-black" style={{ color: '#ED8214', fontFamily: "'Poppins', sans-serif" }}>{stat.value}{stat.suffix}</div>
              <div className="flex items-center gap-2">
                <Toggle checked={stat.is_active} onChange={v => setStats(prev => prev.map((x, xi) => xi === i ? { ...x, is_active: v } : x))} />
                {stat.id > 0 && <button onClick={() => deleteStat(stat.id)} className="p-1.5 rounded-lg hover:bg-red-900/30" style={{ color: '#ef4444' }}><Trash2 className="h-4 w-4" /></button>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Field label="Label">
                  <Input value={stat.label} onChange={e => setStats(prev => prev.map((x, xi) => xi === i ? { ...x, label: e.target.value } : x))} placeholder="Projects Completed" />
                </Field>
              </div>
              <div>
                <Field label="Suffix">
                  <Input value={stat.suffix} onChange={e => setStats(prev => prev.map((x, xi) => xi === i ? { ...x, suffix: e.target.value } : x))} placeholder="+" />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Number">
                  <Input type="number" value={stat.value} onChange={e => setStats(prev => prev.map((x, xi) => xi === i ? { ...x, value: parseInt(e.target.value) || 0 } : x))} />
                </Field>
              </div>
              <div>
                <Field label="Order">
                  <Input type="number" value={stat.sort_order} onChange={e => setStats(prev => prev.map((x, xi) => xi === i ? { ...x, sort_order: parseInt(e.target.value) || 0 } : x))} />
                </Field>
              </div>
            </div>
            <button onClick={() => saveStat(stat)} className="mt-4 w-full py-2 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: '#ED8214' }}>
              <Save className="h-4 w-4" />{stat.id ? 'Save Changes' : 'Create Stat'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div>
      <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>About Page Content</h2>
      <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Manage sections and images for the About page.</p>
      <div className="grid md:grid-cols-2 gap-5">
        {aboutContent.map(ab => (
          <div key={ab.id} className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <h3 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#ED8214' }}>
              <span className="w-3 h-px block" style={{ background: '#ED8214' }} />{ab.section}
            </h3>
            <div className="space-y-3">
              <Field label="Section Title">
                <Input value={ab.title || ''} onChange={e => setAboutContent(prev => prev.map(x => x.id === ab.id ? { ...x, title: e.target.value } : x))} />
              </Field>
              <Field label="Content">
                <Textarea rows={4} value={ab.content || ''} onChange={e => setAboutContent(prev => prev.map(x => x.id === ab.id ? { ...x, content: e.target.value } : x))} />
              </Field>
              <Field label="Section Photo (Upload)">
                <ImageUploader currentUrl={ab.image_url || ''} onUploaded={url => setAboutContent(prev => prev.map(x => x.id === ab.id ? { ...x, image_url: url } : x))} folder="about" label="Click to upload section photo" />
              </Field>
              <button onClick={() => saveAbout(ab)} className="w-full py-2.5 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: '#ED8214' }}>
                <Save className="h-4 w-4" />Save Section
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderServices = () => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Services</h2>
        <button onClick={() => setServices(prev => [...prev, { id: 0, title: 'New Service', subtitle: '', description: '', icon: 'Layers', image_url: '', sort_order: prev.length + 1, is_active: true, is_featured: false }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#ED8214' }}>
          <Plus className="h-4 w-4" />Add Service
        </button>
      </div>
      <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Each service has a title, description, and photo. Upload a photo for each service.</p>
      <div className="space-y-4">
        {services.map((svc, i) => (
          <ServiceEditor key={svc.id || `new-${i}`} service={svc} index={i}
            onChange={updated => setServices(prev => prev.map((x, xi) => xi === i ? updated : x))}
            onSave={() => saveService(svc)}
            onDelete={() => svc.id ? deleteService(svc.id) : setServices(prev => prev.filter((_, xi) => xi !== i))} />
        ))}
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Portfolio Projects</h2>
        <button onClick={() => setPortfolio(prev => [...prev, { id: 0, title: 'New Project', category: 'Exhibition', client: '', location: 'Cairo, Egypt', project_date: '2026', visitors: '', description: '', image_url: '', award: '', is_featured: false, is_active: true, sort_order: prev.length + 1 }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#ED8214' }}>
          <Plus className="h-4 w-4" />Add Project
        </button>
      </div>
      <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Upload a project photo for each portfolio item. This photo appears in the portfolio grid and spotlight.</p>
      <div className="space-y-4">
        {portfolio.map((proj, i) => (
          <PortfolioEditor key={proj.id || `new-${i}`} project={proj} index={i}
            onChange={updated => setPortfolio(prev => prev.map((x, xi) => xi === i ? updated : x))}
            onSave={() => savePortfolio(proj)}
            onDelete={() => proj.id ? deletePortfolio(proj.id) : setPortfolio(prev => prev.filter((_, xi) => xi !== i))} />
        ))}
      </div>
    </div>
  );

  const renderTeam = () => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Team Members</h2>
        <button onClick={() => setTeam(prev => [...prev, { id: 0, name: 'New Member', role: '', bio: '', image_url: '', email: '', linkedin_url: '', sort_order: prev.length + 1, is_active: true }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#ED8214' }}>
          <Plus className="h-4 w-4" />Add Member
        </button>
      </div>
      <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Upload a professional photo for each team member.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {team.map((member, i) => (
          <div key={member.id || `new-${i}`} className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {member.image_url ? <img src={member.image_url} className="w-10 h-10 rounded-full object-cover" alt={member.name} /> : <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#1f2937' }}><Users className="h-5 w-5" style={{ color: '#4b5563' }} /></div>}
                <div>
                  <p className="font-bold text-sm text-white">{member.name}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{member.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Toggle checked={member.is_active} onChange={v => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, is_active: v } : x))} />
                <button onClick={() => member.id ? deleteTeam(member.id) : setTeam(prev => prev.filter((_, xi) => xi !== i))} className="p-1.5 rounded-lg" style={{ color: '#ef4444' }}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="space-y-3">
              <Field label="Member Photo">
                <ImageUploader currentUrl={member.image_url} onUploaded={url => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, image_url: url } : x))} folder="team" label="Click to upload member photo" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name"><Input value={member.name} onChange={e => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, name: e.target.value } : x))} /></Field>
                <Field label="Role"><Input value={member.role || ''} onChange={e => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, role: e.target.value } : x))} placeholder="CEO, Designer..." /></Field>
                <Field label="Email"><Input value={member.email || ''} onChange={e => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, email: e.target.value } : x))} type="email" /></Field>
                <Field label="LinkedIn URL"><Input value={member.linkedin_url || ''} onChange={e => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, linkedin_url: e.target.value } : x))} /></Field>
              </div>
              <Field label="Bio">
                <Textarea value={member.bio || ''} onChange={e => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, bio: e.target.value } : x))} placeholder="Short biography..." />
              </Field>
              <button onClick={() => saveTeam(member)} className="w-full py-2.5 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: '#ED8214' }}>
                <Save className="h-4 w-4" />{member.id ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Testimonials</h2>
        <button onClick={() => setTestimonials(prev => [...prev, { id: 0, author_name: 'Client Name', author_role: 'CEO', company: 'Company', quote: '', rating: 5, image_url: '', is_active: true, sort_order: prev.length + 1 }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#ED8214' }}>
          <Plus className="h-4 w-4" />Add Testimonial
        </button>
      </div>
      <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Upload client photos for testimonials.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map((t, i) => (
          <div key={t.id || `new-${i}`} className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-sm text-white">{t.author_name}</p>
              <div className="flex items-center gap-2">
                <Toggle checked={t.is_active} onChange={v => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, is_active: v } : x))} />
                <button onClick={() => t.id ? deleteTestimonial(t.id) : setTestimonials(prev => prev.filter((_, xi) => xi !== i))} className="p-1.5 rounded-lg" style={{ color: '#ef4444' }}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="space-y-3">
              <Field label="Client Photo">
                <ImageUploader currentUrl={t.image_url || ''} onUploaded={url => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, image_url: url } : x))} folder="testimonials" label="Click to upload client photo" compact />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name"><Input value={t.author_name} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, author_name: e.target.value } : x))} /></Field>
                <Field label="Role / Title"><Input value={t.author_role || ''} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, author_role: e.target.value } : x))} /></Field>
                <Field label="Company"><Input value={t.company || ''} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, company: e.target.value } : x))} /></Field>
                <Field label="Rating (1-5)"><Input type="number" min={1} max={5} value={t.rating} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, rating: parseInt(e.target.value) || 5 } : x))} /></Field>
              </div>
              <Field label="Quote / Review">
                <Textarea rows={4} value={t.quote || ''} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, quote: e.target.value } : x))} placeholder="What did the client say?" />
              </Field>
              <button onClick={() => saveTestimonial(t)} className="w-full py-2.5 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: '#ED8214' }}>
                <Save className="h-4 w-4" />{t.id ? 'Save Changes' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMedia = () => {
    const inputRef2 = useRef<HTMLInputElement>(null);
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Media Library</h2>
          <button onClick={() => inputRef2.current?.click()} className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#ED8214' }}>
            <Upload className="h-4 w-4" />Upload Photos
          </button>
        </div>
        <p className="text-sm mb-6" style={{ color: '#6b7280' }}>All uploaded photos. You can copy a photo URL and use it anywhere.</p>
        <input ref={inputRef2} type="file" accept="image/*" multiple className="hidden"
          onChange={e => { Array.from(e.target.files || []).forEach(handleMediaUpload); }} />
        {media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl" style={{ background: '#111827', border: '2px dashed #374151' }}>
            <Upload className="h-10 w-10 mb-3" style={{ color: '#374151' }} />
            <p className="font-bold text-white mb-1">No photos yet</p>
            <p className="text-sm mb-4" style={{ color: '#6b7280' }}>Upload your first photo to get started</p>
            <button onClick={() => inputRef2.current?.click()} className="px-5 py-2 rounded-lg text-white font-bold text-sm" style={{ background: '#ED8214' }}>Choose Files</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {media.map(m => (
              <div key={m.id} className="group relative rounded-xl overflow-hidden" style={{ background: '#111827', border: '1px solid #1f2937' }}>
                <img src={m.url} alt={m.alt_text || m.filename} className="w-full h-28 object-cover" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2" style={{ background: 'rgba(0,0,0,0.75)' }}>
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <ExternalLink className="h-3.5 w-3.5 text-white" />
                  </a>
                  <button onClick={() => deleteMedia(m)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.8)' }}>
                    <Trash2 className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-[10px] truncate" style={{ color: '#6b7280' }}>{m.filename}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderInbox = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Contact Inbox {unreadCount > 0 && <span className="ml-2 text-sm px-2.5 py-0.5 rounded-full" style={{ background: '#ED8214', color: '#000' }}>{unreadCount} new</span>}
        </h2>
      </div>
      {inbox.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
          <MessageSquare className="h-10 w-10 mb-3" style={{ color: '#374151' }} />
          <p className="font-bold text-white">No messages yet</p>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Contact form submissions will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inbox.map(msg => (
            <div key={msg.id} className="p-5 rounded-xl transition-all" style={{ background: '#111827', border: `1px solid ${msg.status === 'new' ? 'rgba(237,130,20,0.3)' : '#1f2937'}` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: msg.status === 'new' ? '#ED8214' : msg.status === 'replied' ? '#10b981' : '#374151' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-bold text-sm text-white">{msg.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: msg.status === 'new' ? 'rgba(237,130,20,0.15)' : 'rgba(255,255,255,0.05)', color: msg.status === 'new' ? '#ED8214' : '#6b7280' }}>{msg.status}</span>
                      {msg.service && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>{msg.service}</span>}
                    </div>
                    <div className="flex items-center gap-4 text-xs mb-2" style={{ color: '#6b7280' }}>
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{msg.email}</span>
                      {msg.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{msg.phone}</span>}
                      {msg.company && <span>{msg.company}</span>}
                      <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm" style={{ color: '#d1d5db' }}>{msg.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select value={msg.status} onChange={e => updateInboxStatus(msg.id, e.target.value)}
                    className="text-xs px-2 py-1.5 rounded-lg" style={{ background: '#0f172a', border: '1px solid #374151', color: '#9ca3af' }}>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <a href={`mailto:${msg.email}?subject=Re: Your inquiry via MOPi Production`}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1" style={{ background: '#1d4ed8' }}>
                    <Mail className="h-3 w-3" />Reply
                  </a>
                  <button onClick={() => deleteInbox(msg.id)} className="p-1.5 rounded-lg" style={{ color: '#ef4444' }}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ════════════════ PAGE CONTENT RENDERERS ════════════════

  const renderPageHome = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Homepage — All Text Content</h2>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Edit every single word on the homepage in both English and Arabic. Each section has a "Save Section" button.</p>
      </div>
      <div className="mb-4 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(237,130,20,0.08)', border: '1px solid rgba(237,130,20,0.2)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(237,130,20,0.2)' }}><Type className="h-4 w-4" style={{ color: '#ED8214' }} /></div>
        <div>
          <p className="text-sm font-bold" style={{ color: '#ED8214' }}>🇬🇧 Left = English · 🇸🇦 Right = Arabic</p>
          <p className="text-xs" style={{ color: '#9ca3af' }}>Edit both sides and click "Save Section" to apply changes to the live website.</p>
        </div>
      </div>
      {renderPageContentSection('home', 'hero', '🚀 Hero Section', [
        { field: 'badge', label: 'Badge Text' },
        { field: 'line1', label: 'Headline Line 1' },
        { field: 'line2', label: 'Headline Line 2' },
        { field: 'subtitle', label: 'Subtitle / Tagline' },
        { field: 'cta_primary', label: 'Primary Button Text' },
        { field: 'cta_secondary', label: 'Secondary Button Text' },
      ], [{ key: 'background', label: 'Hero Background Photo' }])}
      {renderPageContentSection('home', 'about', '👥 About Section', [
        { field: 'label', label: 'Section Label' },
        { field: 'heading1', label: 'Heading Line 1' },
        { field: 'heading2', label: 'Heading Line 2' },
        { field: 'heading3', label: 'Heading Line 3' },
        { field: 'paragraph1', label: 'Paragraph 1', multiline: true, rows: 3 },
        { field: 'paragraph2', label: 'Paragraph 2', multiline: true, rows: 3 },
        { field: 'point1', label: 'Feature Point 1' },
        { field: 'point2', label: 'Feature Point 2' },
        { field: 'point3', label: 'Feature Point 3' },
        { field: 'point4', label: 'Feature Point 4' },
        { field: 'cta', label: 'CTA Button Text' },
      ], [{ key: 'main_image', label: 'About Section Photo' }])}
      {renderPageContentSection('home', 'services', '⚙️ Services Section Header', [
        { field: 'label', label: 'Section Label' },
        { field: 'heading', label: 'Heading' },
        { field: 'subtitle', label: 'Subtitle' },
      ])}
      {renderPageContentSection('home', 'portfolio', '🖼️ Portfolio Section Header', [
        { field: 'label', label: 'Section Label' },
        { field: 'heading', label: 'Heading' },
        { field: 'subtitle', label: 'Subtitle' },
        { field: 'cta', label: 'View All Button Text' },
      ])}
      {renderPageContentSection('home', 'why', '✅ Why Choose Us Section', [
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
      ])}
      {renderPageContentSection('home', 'process', '📋 Process Section', [
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
      ])}
      {renderPageContentSection('home', 'cta', '🎯 CTA Band Section', [
        { field: 'heading', label: 'Heading Line 1' },
        { field: 'heading2', label: 'Heading Line 2' },
        { field: 'subtitle', label: 'Subtitle' },
        { field: 'cta_primary', label: 'Primary Button' },
        { field: 'cta_secondary', label: 'Secondary Button' },
      ])}
      {renderPageContentSection('home', 'contact', '📬 Contact Section', [
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
        { field: 'form_submit', label: 'Form — Submit Button' },
      ])}
      {renderPageContentSection('home', 'footer', '🔽 Footer', [
        { field: 'tagline', label: 'Footer Tagline', multiline: true, rows: 2 },
        { field: 'copyright', label: 'Copyright Text' },
      ])}
    </div>
  );

  const renderPageAbout = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>About Page — All Text Content</h2>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Edit every word on the About page in both English and Arabic.</p>
      </div>
      {renderPageContentSection('about', 'hero', '🚀 Hero Banner', [
        { field: 'badge', label: 'Badge Text' },
        { field: 'heading', label: 'Heading' },
        { field: 'subtitle', label: 'Subtitle' },
      ])}
      {renderPageContentSection('about', 'story', '📖 Our Story Section', [
        { field: 'heading', label: 'Section Heading' },
        { field: 'content', label: 'Story Text', multiline: true, rows: 5 },
      ], [{ key: 'image', label: 'Story Section Photo' }])}
      {renderPageContentSection('about', 'mission', '🎯 Mission Section', [
        { field: 'heading', label: 'Section Heading' },
        { field: 'content', label: 'Mission Text', multiline: true, rows: 4 },
      ])}
      {renderPageContentSection('about', 'values', '⭐ Values Section', [
        { field: 'heading', label: 'Section Heading' },
      ])}
    </div>
  );

  const renderPageServices = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Services Page — Text Content</h2>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Edit page-level texts. Individual service titles, descriptions and photos are managed in "Services" section.</p>
      </div>
      {renderPageContentSection('services', 'hero', '🚀 Hero Banner', [
        { field: 'badge', label: 'Badge Text' },
        { field: 'heading', label: 'Heading' },
        { field: 'subtitle', label: 'Subtitle' },
      ])}
      {renderPageContentSection('services', 'cta', '🎯 CTA Section', [
        { field: 'heading', label: 'CTA Heading' },
        { field: 'subtitle', label: 'CTA Subtitle' },
        { field: 'cta_primary', label: 'CTA Button Text' },
      ])}
      <div className="mt-4 p-4 rounded-xl" style={{ background: '#111827', border: '1px dashed #374151' }}>
        <p className="text-sm font-bold text-white mb-1">📌 Service Cards (titles, descriptions, photos)</p>
        <p className="text-sm" style={{ color: '#6b7280' }}>Edit individual service content in the <button onClick={() => setSection('services')} className="underline text-[#ED8214]">Services section →</button></p>
      </div>
    </div>
  );

  const renderPagePortfolio = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Portfolio Page — Text Content</h2>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Edit page-level texts. Individual project photos and details are managed in "Portfolio" section.</p>
      </div>
      {renderPageContentSection('portfolio', 'hero', '🚀 Hero Banner', [
        { field: 'badge', label: 'Badge Text' },
        { field: 'heading', label: 'Heading' },
        { field: 'subtitle', label: 'Subtitle' },
      ])}
      <div className="mt-4 p-4 rounded-xl" style={{ background: '#111827', border: '1px dashed #374151' }}>
        <p className="text-sm font-bold text-white mb-1">📌 Project Cards (titles, descriptions, photos)</p>
        <p className="text-sm" style={{ color: '#6b7280' }}>Edit individual projects in the <button onClick={() => setSection('portfolio')} className="underline text-[#ED8214]">Portfolio section →</button></p>
      </div>
    </div>
  );

  const renderPageContact = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Contact Page — Text Content</h2>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Edit all text labels. Contact info (phone, email, address) is managed in Site Settings.</p>
      </div>
      {renderPageContentSection('contact', 'hero', '🚀 Hero Banner', [
        { field: 'badge', label: 'Badge Text' },
        { field: 'heading', label: 'Heading' },
        { field: 'subtitle', label: 'Subtitle' },
      ])}
      {renderPageContentSection('contact', 'info', '📋 Contact Info Labels', [
        { field: 'address_label', label: 'Address Label' },
        { field: 'phone_label', label: 'Phone Label' },
        { field: 'email_label', label: 'Email Label' },
        { field: 'whatsapp_label', label: 'WhatsApp Label' },
      ])}
      <div className="mt-4 p-4 rounded-xl" style={{ background: '#111827', border: '1px dashed #374151' }}>
        <p className="text-sm font-bold text-white mb-1">📌 Contact Details (phone number, email address, WhatsApp)</p>
        <p className="text-sm" style={{ color: '#6b7280' }}>Edit actual contact values in <button onClick={() => setSection('site-settings')} className="underline text-[#ED8214]">Site Settings →</button></p>
      </div>
    </div>
  );

  // ════════════════ SECTION MAP ════════════════
  const sectionRenderer: Record<Section, () => React.ReactNode> = {
    'dashboard': renderDashboard,
    'site-settings': renderSiteSettings,
    'social-links': renderSocialLinks,
    'logos': renderLogos,
    'hero-sections': renderHeroSections,
    'stats': renderStats,
    'services': renderServices,
    'portfolio': renderPortfolio,
    'team': renderTeam,
    'testimonials': renderTestimonials,
    'media': renderMedia,
    'about': renderAbout,
    'inbox': renderInbox,
    'page-home': renderPageHome,
    'page-about': renderPageAbout,
    'page-services': renderPageServices,
    'page-portfolio': renderPagePortfolio,
    'page-contact': renderPageContact,
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #374151; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside className="shrink-0 flex flex-col transition-all duration-300 z-40"
        style={{ width: sidebarOpen ? 240 : 64, background: '#0f0f0f', borderRight: '1px solid #1a1a1a', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="flex items-center gap-3 p-4 shrink-0" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <img src="/images/mopi_logo_20260101_112924.png" alt="MOPi" className="h-8 w-8 object-contain shrink-0" />
          {sidebarOpen && <span className="font-black text-xs tracking-widest uppercase text-white truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>CMS Admin</span>}
          <button onClick={() => setSidebarOpen(p => !p)} className="ml-auto shrink-0 p-1 rounded hover:bg-white/5" style={{ color: '#6b7280' }}>
            <Menu className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 py-3 px-2">
          {sidebarGroups.map(group => (
            <div key={group.label} className="mb-3">
              {sidebarOpen && <p className="text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1.5 mb-1" style={{ color: '#374151' }}>{group.label}</p>}
              {group.items.map(item => (
                <button key={item.id} onClick={() => setSection(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all text-left"
                  style={{ background: section === item.id ? 'rgba(237,130,20,0.12)' : 'transparent', color: section === item.id ? '#ED8214' : '#6b7280', border: section === item.id ? '1px solid rgba(237,130,20,0.2)' : '1px solid transparent' }}
                  onMouseEnter={e => { if (section !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (section !== item.id) e.currentTarget.style.background = 'transparent'; }}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-3 shrink-0" style={{ borderTop: '1px solid #1a1a1a' }}>
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all" style={{ color: '#4b5563' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#9ca3af')} onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}>
            <ExternalLink className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span className="text-sm">View Website</span>}
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all" style={{ color: '#4b5563' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')} onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}>
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto" style={{ minWidth: 0 }}>
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a' }}>
          <div className="flex items-center gap-3">
            <div className="text-sm font-bold text-white capitalize">{section.replace(/-/g, ' ')}</div>
            {saving && <div className="flex items-center gap-1.5 text-xs" style={{ color: '#ED8214' }}><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving...</div>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAll} className="p-2 rounded-lg transition-all hover:text-[#ED8214]" style={{ color: '#4b5563', background: '#111827', border: '1px solid #1f2937' }}>
              <RefreshCw className="h-4 w-4" />
            </button>
            <Link to="/" target="_blank" className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition-all hover:text-[#ED8214]" style={{ color: '#6b7280', background: '#111827', border: '1px solid #1f2937' }}>
              <ExternalLink className="h-3.5 w-3.5" />Live Site
            </Link>
          </div>
        </div>
        <div className="p-6 max-w-6xl">
          {!loaded ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#ED8214' }} />
                <p className="text-sm" style={{ color: '#6b7280' }}>Loading CMS data...</p>
              </div>
            </div>
          ) : (
            sectionRenderer[section]()
          )}
        </div>
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function NewSocialForm({ onSave }: { onSave: (item: Omit<{ id: number; platform: string; url: string; icon: string; is_active: boolean; sort_order: number; }, 'id'>) => void }) {
  const [form, setForm] = useState({ platform: '', url: '', icon: '', is_active: true, sort_order: 10 });
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Platform</label>
        <input value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))} placeholder="e.g. TikTok"
          className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#111827', border: '1px solid #374151', color: '#f3f4f6' }} />
      </div>
      <div>
        <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>URL</label>
        <input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..."
          className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#111827', border: '1px solid #374151', color: '#f3f4f6' }} />
      </div>
      <div className="col-span-2">
        <button onClick={() => { if (form.platform && form.url) { onSave({ ...form, icon: form.platform }); setForm({ platform: '', url: '', icon: '', is_active: true, sort_order: 10 }); } }}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#ED8214' }}>
          <Plus className="h-4 w-4" />Add Social Link
        </button>
      </div>
    </div>
  );
}

function HeroEditor({ hero, onSave, saving }: { hero: { id: number; page: string; badge_text: string; heading: string; subheading: string; cta_primary_label: string; cta_primary_url: string; cta_secondary_label: string; cta_secondary_url: string; bg_image_url: string; }; onSave: (h: typeof hero) => void; saving: boolean }) {
  const [data, setData] = useState(hero);
  const [open, setOpen] = useState(false);
  const pageColors: Record<string, string> = { home: '#ED8214', about: '#3b82f6', services: '#8b5cf6', portfolio: '#10b981', contact: '#f43f5e' };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#111827', border: '1px solid #1f2937' }}>
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center justify-between p-5 text-left">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: pageColors[hero.page] || '#ED8214' }} />
          <span className="font-bold text-white capitalize">{hero.page} Page Hero</span>
          {hero.badge_text && <span className="text-xs px-2 py-0.5 rounded-full hidden sm:inline" style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>{hero.badge_text}</span>}
        </div>
        <ChevronDown className="h-4 w-4 transition-transform" style={{ color: '#6b7280', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4" style={{ borderTop: '1px solid #1f2937' }}>
          <div className="pt-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Badge Text</label>
              <input value={data.badge_text || ''} onChange={e => setData(p => ({ ...p, badge_text: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Page</label>
              <input value={data.page} disabled className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#4b5563' }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Heading</label>
            <input value={data.heading || ''} onChange={e => setData(p => ({ ...p, heading: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }}
              placeholder="Use <span>text</span> for orange highlight" />
            <p className="text-xs mt-1" style={{ color: '#4b5563' }}>Tip: wrap text in {`<span>`} for orange highlight</p>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Subheading</label>
            <textarea value={data.subheading || ''} onChange={e => setData(p => ({ ...p, subheading: e.target.value }))} rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Primary CTA Label</label>
              <input value={data.cta_primary_label || ''} onChange={e => setData(p => ({ ...p, cta_primary_label: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Primary CTA URL</label>
              <input value={data.cta_primary_url || ''} onChange={e => setData(p => ({ ...p, cta_primary_url: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} placeholder="/contact" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Secondary CTA Label</label>
              <input value={data.cta_secondary_label || ''} onChange={e => setData(p => ({ ...p, cta_secondary_label: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Secondary CTA URL</label>
              <input value={data.cta_secondary_url || ''} onChange={e => setData(p => ({ ...p, cta_secondary_url: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Background Image — Upload Photo</label>
            <ImageUploader currentUrl={data.bg_image_url || ''} onUploaded={url => setData(p => ({ ...p, bg_image_url: url }))} folder="heroes" label="Click to upload hero background photo" />
          </div>
          <button onClick={() => onSave(data)} disabled={saving}
            className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all hover:scale-[1.02]"
            style={{ background: '#ED8214' }}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Hero Section
          </button>
        </div>
      )}
    </div>
  );
}

function ServiceEditor({ service, index, onChange, onSave, onDelete }: {
  service: { id: number; title: string; subtitle: string; description: string; icon: string; image_url: string; sort_order: number; is_active: boolean; is_featured: boolean; };
  index: number; onChange: (s: typeof service) => void; onSave: () => void; onDelete: () => void;
}) {
  const [open, setOpen] = useState(!service.id);
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#111827', border: '1px solid #1f2937' }}>
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full" style={{ background: service.is_active ? '#10b981' : '#374151' }} />
          {service.image_url && <img src={service.image_url} className="w-8 h-8 rounded-lg object-cover" alt="" />}
          <span className="font-bold text-sm text-white">{service.title}</span>
          {service.is_featured && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(237,130,20,0.15)', color: '#ED8214' }}>Featured</span>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg hover:bg-red-900/30" style={{ color: '#ef4444' }}><Trash2 className="h-4 w-4" /></button>
          <ChevronDown className="h-4 w-4" style={{ color: '#6b7280', transform: open ? 'rotate(180deg)' : 'none' }} />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4" style={{ borderTop: '1px solid #1f2937' }}>
          <div className="pt-4">
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Service Photo</label>
            <ImageUploader currentUrl={service.image_url || ''} onUploaded={url => onChange({ ...service, image_url: url })} folder="services" label="Click to upload service photo" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Title</label>
              <input value={service.title} onChange={e => onChange({ ...service, title: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Subtitle</label>
              <input value={service.subtitle || ''} onChange={e => onChange({ ...service, subtitle: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Description</label>
            <textarea value={service.description || ''} onChange={e => onChange({ ...service, description: e.target.value })} rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Icon Name</label>
              <input value={service.icon || ''} onChange={e => onChange({ ...service, icon: e.target.value })} placeholder="Layers, Zap, Award..."
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Sort Order</label>
              <input type="number" value={service.sort_order} onChange={e => onChange({ ...service, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Active</span>
                <div onClick={() => onChange({ ...service, is_active: !service.is_active })} className="relative inline-flex h-6 w-11 rounded-full cursor-pointer transition-colors" style={{ background: service.is_active ? '#ED8214' : '#374151' }}>
                  <span className="inline-block h-5 w-5 rounded-full bg-white shadow mt-0.5 transition-transform" style={{ transform: service.is_active ? 'translateX(22px)' : 'translateX(2px)' }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Featured</span>
                <div onClick={() => onChange({ ...service, is_featured: !service.is_featured })} className="relative inline-flex h-6 w-11 rounded-full cursor-pointer transition-colors" style={{ background: service.is_featured ? '#ED8214' : '#374151' }}>
                  <span className="inline-block h-5 w-5 rounded-full bg-white shadow mt-0.5 transition-transform" style={{ transform: service.is_featured ? 'translateX(22px)' : 'translateX(2px)' }} />
                </div>
              </div>
            </div>
          </div>
          <button onClick={onSave} className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all hover:scale-[1.02]" style={{ background: '#ED8214' }}>
            <Save className="h-4 w-4" />{service.id ? 'Save Changes' : 'Create Service'}
          </button>
        </div>
      )}
    </div>
  );
}

function PortfolioEditor({ project, index, onChange, onSave, onDelete }: {
  project: { id: number; title: string; category: string; client: string; location: string; project_date: string; visitors: string; description: string; image_url: string; award: string; is_featured: boolean; is_active: boolean; sort_order: number; };
  index: number; onChange: (p: typeof project) => void; onSave: () => void; onDelete: () => void;
}) {
  const [open, setOpen] = useState(!project.id);
  const categories = ['Exhibition', 'Event', 'Booth', 'Corporate', 'Brand Activation', 'Other'];
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#111827', border: '1px solid #1f2937' }}>
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          {project.image_url && <img src={project.image_url} className="w-8 h-8 rounded-lg object-cover shrink-0" alt="" />}
          <div className="text-left">
            <p className="font-bold text-sm text-white">{project.title}</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>{project.category} · {project.location}</p>
          </div>
          {project.is_featured && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(237,130,20,0.15)', color: '#ED8214' }}>Featured</span>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg" style={{ color: '#ef4444' }}><Trash2 className="h-4 w-4" /></button>
          <ChevronDown className="h-4 w-4" style={{ color: '#6b7280', transform: open ? 'rotate(180deg)' : 'none' }} />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4" style={{ borderTop: '1px solid #1f2937' }}>
          <div className="pt-4">
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Project Photo (Upload)</label>
            <ImageUploader currentUrl={project.image_url || ''} onUploaded={url => onChange({ ...project, image_url: url })} folder="portfolio" label="Click to upload project photo" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Project Title</label>
              <input value={project.title} onChange={e => onChange({ ...project, title: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Category</label>
              <select value={project.category || ''} onChange={e => onChange({ ...project, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Client</label>
              <input value={project.client || ''} onChange={e => onChange({ ...project, client: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Location</label>
              <input value={project.location || ''} onChange={e => onChange({ ...project, location: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Date</label>
              <input value={project.project_date || ''} onChange={e => onChange({ ...project, project_date: e.target.value })} placeholder="March 2026"
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Visitors</label>
              <input value={project.visitors || ''} onChange={e => onChange({ ...project, visitors: e.target.value })} placeholder="50,000+"
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Award (optional)</label>
            <input value={project.award || ''} onChange={e => onChange({ ...project, award: e.target.value })} placeholder="Best Innovation Award 2026"
              className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Description</label>
            <textarea value={project.description || ''} onChange={e => onChange({ ...project, description: e.target.value })} rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} />
          </div>
          <div className="flex items-center gap-6">
            {[['is_active', 'Active'], ['is_featured', 'Featured']].map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div onClick={() => onChange({ ...project, [key]: !project[key as keyof typeof project] })}
                  className="relative inline-flex h-6 w-11 rounded-full cursor-pointer transition-colors"
                  style={{ background: project[key as keyof typeof project] ? '#ED8214' : '#374151' }}>
                  <span className="inline-block h-5 w-5 rounded-full bg-white shadow mt-0.5 transition-transform"
                    style={{ transform: project[key as keyof typeof project] ? 'translateX(22px)' : 'translateX(2px)' }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>{label}</span>
              </div>
            ))}
          </div>
          <button onClick={onSave} className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all hover:scale-[1.02]" style={{ background: '#ED8214' }}>
            <Save className="h-4 w-4" />{project.id ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      )}
    </div>
  );
}
