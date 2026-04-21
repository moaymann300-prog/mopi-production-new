import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard, Settings, Image, Globe, FileText, Briefcase,
  Users, MessageSquare, Star, BarChart2, LogIn, LogOut, Eye,
  EyeOff, Save, Plus, Trash2, Edit3, Upload, X, Check,
  ChevronDown, ChevronRight, Menu, AlertCircle, Loader2,
  Instagram, Facebook, Youtube, Linkedin, Phone, Mail, MapPin,
  Hash, Link2, Layers, Zap, Award, Wrench, Palette, Package,
  Home, Info, Server, RefreshCw, ExternalLink,
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

type Section =
  | 'dashboard' | 'site-settings' | 'social-links' | 'logos'
  | 'hero-sections' | 'stats' | 'services' | 'portfolio'
  | 'team' | 'testimonials' | 'media' | 'about' | 'inbox';

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
const ImageUploader = ({ currentUrl, onUploaded, label = 'Upload Image', folder = 'general' }: { currentUrl?: string; onUploaded: (url: string) => void; label?: string; folder?: string; }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');
  const inputRef = useRef<HTMLInputElement>(null);

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
      // Fallback to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPreview(url);
        onUploaded(url);
      };
      reader.readAsDataURL(file);
    }
    setUploading(false);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer rounded-xl overflow-hidden border-2 border-dashed transition-all hover:border-[#F4A300] group"
        style={{ borderColor: '#374151', background: '#111827', minHeight: 100 }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-32 object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-24 gap-2">
            <Upload className="h-6 w-6" style={{ color: '#6b7280' }} />
            <span className="text-xs" style={{ color: '#6b7280' }}>{label}</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          style={{ background: 'rgba(244,163,0,0.15)' }}>
          <Upload className="h-5 w-5" style={{ color: '#F4A300' }} />
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      {preview && (
        <div className="mt-2 flex gap-2 items-center">
          <input type="text" value={preview} readOnly className="flex-1 px-2 py-1.5 rounded text-xs" style={{ background: '#111827', border: '1px solid #374151', color: '#9ca3af' }} />
          <button onClick={() => { setPreview(''); onUploaded(''); }} className="p-1.5 rounded hover:bg-red-900/30" style={{ color: '#ef4444' }}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div>
    <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>{label}</label>
    {children}
    {hint && <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{hint}</p>}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full px-3 py-2.5 rounded-lg text-sm transition-all" style={{ background: '#111827', border: '1px solid #374151', color: '#f3f4f6', ...props.style }}
    onFocus={e => (e.currentTarget.style.borderColor = '#F4A300')}
    onBlur={e => (e.currentTarget.style.borderColor = '#374151')} />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full px-3 py-2.5 rounded-lg text-sm transition-all resize-none" rows={3}
    style={{ background: '#111827', border: '1px solid #374151', color: '#f3f4f6', ...props.style }}
    onFocus={e => (e.currentTarget.style.borderColor = '#F4A300')}
    onBlur={e => (e.currentTarget.style.borderColor = '#374151')} />
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button onClick={() => onChange(!checked)} className="relative inline-flex h-6 w-11 rounded-full transition-colors"
    style={{ background: checked ? '#F4A300' : '#374151' }}>
    <span className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform mt-0.5"
      style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }} />
  </button>
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
    if (error) {
      setLoginError(error.message);
    } else {
      setAuthed(true);
    }
    setLoginLoading(false);
  };

  // Check session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setAuthed(true);
    });
    supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session);
    });
  }, []);

  // ── Fetch all data ──
  const fetchAll = useCallback(async () => {
    const [s, sl, lg, h, st, sv, pf, tm, ts, md, ab, ib] = await Promise.all([
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
    setLoaded(true);
  }, []);

  useEffect(() => { if (authed) fetchAll(); }, [authed, fetchAll]);

  const logout = async () => { await supabase.auth.signOut(); setAuthed(false); };

  // ════════════════ SAVE HANDLERS ════════════════

  // Settings
  const saveSetting = async (item: SiteSetting) => {
    setSaving(true);
    const { error } = await supabase.from('cms_site_settings_2026_04_21').update({ value: item.value, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error');
    else notify('Setting saved!');
    setSaving(false);
  };

  // Social
  const saveSocial = async (item: SocialLink) => {
    const { error } = item.id
      ? await supabase.from('cms_social_links_2026_04_21').update({ url: item.url, is_active: item.is_active, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_social_links_2026_04_21').insert([{ platform: item.platform, url: item.url, icon: item.icon, is_active: item.is_active, sort_order: item.sort_order }]);
    if (error) notify('Save failed: ' + error.message, 'error');
    else { notify('Saved!'); fetchAll(); }
  };

  // Logos
  const saveLogo = async (item: Logo) => {
    const { error } = await supabase.from('cms_logos_2026_04_21').update({ url: item.url, alt_text: item.alt_text, is_active: item.is_active, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error');
    else notify('Logo updated!');
  };

  // Hero
  const saveHero = async (item: HeroSection) => {
    setSaving(true);
    const { error } = await supabase.from('cms_hero_sections_2026_04_21').update({ badge_text: item.badge_text, heading: item.heading, subheading: item.subheading, cta_primary_label: item.cta_primary_label, cta_primary_url: item.cta_primary_url, cta_secondary_label: item.cta_secondary_label, cta_secondary_url: item.cta_secondary_url, bg_image_url: item.bg_image_url, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error');
    else notify('Hero section saved!');
    setSaving(false);
  };

  // Stats
  const saveStat = async (item: Stat) => {
    const payload = { label: item.label, value: item.value, suffix: item.suffix, is_active: item.is_active, sort_order: item.sort_order };
    const { error } = item.id
      ? await supabase.from('cms_stats_2026_04_21').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_stats_2026_04_21').insert([payload]);
    if (error) notify('Save failed: ' + error.message, 'error');
    else { notify('Stat saved!'); fetchAll(); }
  };
  const deleteStat = async (id: number) => {
    if (!confirm('Delete this stat?')) return;
    await supabase.from('cms_stats_2026_04_21').delete().eq('id', id);
    notify('Stat deleted!'); fetchAll();
  };

  // Services
  const saveService = async (item: Service) => {
    const payload = { title: item.title, subtitle: item.subtitle, description: item.description, icon: item.icon, image_url: item.image_url, sort_order: item.sort_order, is_active: item.is_active, is_featured: item.is_featured };
    const { error } = item.id
      ? await supabase.from('cms_services_2026_04_21').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_services_2026_04_21').insert([payload]);
    if (error) notify('Save failed: ' + error.message, 'error');
    else { notify('Service saved!'); fetchAll(); }
  };
  const deleteService = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('cms_services_2026_04_21').delete().eq('id', id);
    notify('Service deleted!'); fetchAll();
  };

  // Portfolio
  const savePortfolio = async (item: Portfolio) => {
    const payload = { title: item.title, category: item.category, client: item.client, location: item.location, project_date: item.project_date, visitors: item.visitors, description: item.description, image_url: item.image_url, award: item.award, is_featured: item.is_featured, is_active: item.is_active, sort_order: item.sort_order };
    const { error } = item.id
      ? await supabase.from('cms_portfolio_2026_04_21').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_portfolio_2026_04_21').insert([payload]);
    if (error) notify('Save failed: ' + error.message, 'error');
    else { notify('Project saved!'); fetchAll(); }
  };
  const deletePortfolio = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('cms_portfolio_2026_04_21').delete().eq('id', id);
    notify('Project deleted!'); fetchAll();
  };

  // Team
  const saveTeam = async (item: TeamMember) => {
    const payload = { name: item.name, role: item.role, bio: item.bio, image_url: item.image_url, email: item.email, linkedin_url: item.linkedin_url, sort_order: item.sort_order, is_active: item.is_active };
    const { error } = item.id
      ? await supabase.from('cms_team_2026_04_21').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_team_2026_04_21').insert([payload]);
    if (error) notify('Save failed: ' + error.message, 'error');
    else { notify('Team member saved!'); fetchAll(); }
  };
  const deleteTeam = async (id: number) => {
    if (!confirm('Delete this team member?')) return;
    await supabase.from('cms_team_2026_04_21').delete().eq('id', id);
    notify('Deleted!'); fetchAll();
  };

  // Testimonials
  const saveTestimonial = async (item: Testimonial) => {
    const payload = { author_name: item.author_name, author_role: item.author_role, company: item.company, quote: item.quote, rating: item.rating, image_url: item.image_url, is_active: item.is_active, sort_order: item.sort_order };
    const { error } = item.id
      ? await supabase.from('cms_testimonials_2026_04_21').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', item.id)
      : await supabase.from('cms_testimonials_2026_04_21').insert([payload]);
    if (error) notify('Save failed: ' + error.message, 'error');
    else { notify('Testimonial saved!'); fetchAll(); }
  };
  const deleteTestimonial = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('cms_testimonials_2026_04_21').delete().eq('id', id);
    notify('Deleted!'); fetchAll();
  };

  // About
  const saveAbout = async (item: AboutContent) => {
    const { error } = await supabase.from('cms_about_content_2026_04_21').update({ title: item.title, content: item.content, image_url: item.image_url, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify('Save failed: ' + error.message, 'error');
    else notify('About section saved!');
  };

  // Inbox
  const updateInboxStatus = async (id: number, status: string) => {
    await supabase.from('cms_contact_submissions_2026_04_21').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    notify('Status updated!'); fetchAll();
  };
  const deleteInbox = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('cms_contact_submissions_2026_04_21').delete().eq('id', id);
    notify('Message deleted!'); fetchAll();
  };

  // Media upload
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
      notify('Upload failed. Saving as base64...', 'error');
    }
  };
  const deleteMedia = async (item: MediaItem) => {
    if (!confirm('Delete this image?')) return;
    await supabase.from('cms_media_2026_04_21').delete().eq('id', item.id);
    notify('Deleted!'); fetchAll();
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
              style={{ background: '#F4A300', boxShadow: '0 6px 20px rgba(244,163,0,0.3)' }}>
              {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-xs mt-3" style={{ color: '#374151' }}>
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
      label: 'Pages', items: [
        { id: 'hero-sections' as Section, icon: Home, label: 'Hero Sections' },
        { id: 'stats' as Section, icon: BarChart2, label: 'Stats & Numbers' },
        { id: 'about' as Section, icon: Info, label: 'About Page' },
        { id: 'services' as Section, icon: Briefcase, label: 'Services' },
        { id: 'portfolio' as Section, icon: Layers, label: 'Portfolio' },
      ]
    },
    {
      label: 'Content', items: [
        { id: 'team' as Section, icon: Users, label: 'Team Members' },
        { id: 'testimonials' as Section, icon: Star, label: 'Testimonials' },
        { id: 'media' as Section, icon: Image, label: 'Media Library' },
        { id: 'inbox' as Section, icon: MessageSquare, label: `Inbox ${inbox.filter(m => m.status === 'new').length > 0 ? `(${inbox.filter(m => m.status === 'new').length})` : ''}` },
      ]
    },
  ];

  const unreadCount = inbox.filter(m => m.status === 'new').length;

  // ════════════════ SECTION RENDERERS ════════════════

  const renderDashboard = () => (
    <div>
      <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Services', count: services.length, icon: Briefcase, color: '#3b82f6' },
          { label: 'Portfolio', count: portfolio.length, icon: Layers, color: '#8b5cf6' },
          { label: 'Team', count: team.length, icon: Users, color: '#10b981' },
          { label: 'New Messages', count: unreadCount, icon: MessageSquare, color: '#F4A300' },
        ].map(c => (
          <div key={c.label} className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${c.color}20` }}>
                <c.icon className="h-4.5 w-4.5" style={{ color: c.color }} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6b7280' }}>{c.label}</span>
            </div>
            <div className="text-3xl font-black" style={{ color: c.color, fontFamily: "'Poppins', sans-serif" }}>{c.count}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
          <h3 className="font-bold text-sm mb-4 text-white flex items-center gap-2"><MessageSquare className="h-4 w-4" style={{ color: '#F4A300' }} />Recent Messages</h3>
          {inbox.slice(0, 5).map(m => (
            <div key={m.id} className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid #1f2937' }}>
              <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: m.status === 'new' ? '#F4A300' : '#374151' }} />
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
          <h3 className="font-bold text-sm mb-4 text-white flex items-center gap-2"><Server className="h-4 w-4" style={{ color: '#F4A300' }} />Quick Links</h3>
          <div className="space-y-2">
            {[
              { label: 'Homepage', url: '/' }, { label: 'About Page', url: '/about' },
              { label: 'Services Page', url: '/services' }, { label: 'Portfolio Page', url: '/portfolio' },
              { label: 'Contact Page', url: '/contact' },
            ].map(l => (
              <Link key={l.url} to={l.url} target="_blank"
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all hover:text-[#F4A300]"
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
          <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Site Settings</h2>
          <button onClick={fetchAll} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all hover:text-[#F4A300]" style={{ color: '#6b7280', background: '#111827', border: '1px solid #1f2937' }}>
            <RefreshCw className="h-3.5 w-3.5" />Refresh
          </button>
        </div>
        {groups.map(g => (
          <div key={g} className="mb-7 p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: '#F4A300' }}>
              <span className="w-4 h-px block" style={{ background: '#F4A300' }} />{g}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {settings.filter(s => s.group_name === g).map(s => (
                <div key={s.id}>
                  <Field label={s.label}>
                    <div className="flex gap-2">
                      <Input value={s.value || ''} onChange={e => setSettings(prev => prev.map(x => x.id === s.id ? { ...x, value: e.target.value } : x))} />
                      <button onClick={() => saveSetting(s)} className="px-3 py-2 rounded-lg text-white text-xs font-bold shrink-0 transition-all hover:scale-105" style={{ background: '#F4A300' }}>
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
      <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Social Media Links</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {socials.map(s => (
          <div key={s.id} className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(244,163,0,0.1)', border: '1px solid rgba(244,163,0,0.2)' }}>
                  {s.platform === 'Instagram' && <Instagram className="h-4 w-4" style={{ color: '#F4A300' }} />}
                  {s.platform === 'Facebook' && <Facebook className="h-4 w-4" style={{ color: '#F4A300' }} />}
                  {s.platform === 'LinkedIn' && <Linkedin className="h-4 w-4" style={{ color: '#F4A300' }} />}
                  {s.platform === 'YouTube' && <Youtube className="h-4 w-4" style={{ color: '#F4A300' }} />}
                  {!['Instagram', 'Facebook', 'LinkedIn', 'YouTube'].includes(s.platform) && <Link2 className="h-4 w-4" style={{ color: '#F4A300' }} />}
                </div>
                <span className="font-bold text-sm text-white">{s.platform}</span>
              </div>
              <Toggle checked={s.is_active} onChange={v => setSocials(prev => prev.map(x => x.id === s.id ? { ...x, is_active: v } : x))} />
            </div>
            <Field label="Profile / Page URL">
              <div className="flex gap-2">
                <Input value={s.url} placeholder="https://instagram.com/mopiproduction" onChange={e => setSocials(prev => prev.map(x => x.id === s.id ? { ...x, url: e.target.value } : x))} />
                <button onClick={() => saveSocial(s)} className="px-3 rounded-lg text-white shrink-0 transition-all hover:scale-105" style={{ background: '#F4A300' }}>
                  <Save className="h-4 w-4" />
                </button>
              </div>
            </Field>
          </div>
        ))}
      </div>
      {/* Add new social */}
      <div className="mt-4 p-5 rounded-xl" style={{ background: '#111827', border: '1px dashed #374151' }}>
        <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2"><Plus className="h-4 w-4" style={{ color: '#F4A300' }} />Add New Social Link</h3>
        <NewSocialForm onSave={async (item) => { await saveSocial({ ...item, id: 0 }); }} />
      </div>
    </div>
  );

  const renderLogos = () => (
    <div>
      <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Logo Management</h2>
      <div className="grid md:grid-cols-2 gap-5">
        {logos.map(logo => (
          <div key={logo.id} className="p-6 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">{logo.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(244,163,0,0.1)', color: '#F4A300' }}>{logo.placement}</span>
              </div>
              <Toggle checked={logo.is_active} onChange={v => setLogos(prev => prev.map(x => x.id === logo.id ? { ...x, is_active: v } : x))} />
            </div>
            {/* Current logo preview */}
            <div className="mb-4 p-4 rounded-lg flex items-center justify-center" style={{ background: '#000', border: '1px solid #374151', minHeight: 90 }}>
              {logo.url ? <img src={logo.url} alt={logo.alt_text} className="max-h-16 max-w-full object-contain" /> : <span className="text-xs" style={{ color: '#4b5563' }}>No logo set</span>}
            </div>
            <div className="space-y-3">
              <Field label="Upload New Logo">
                <ImageUploader currentUrl="" onUploaded={url => setLogos(prev => prev.map(x => x.id === logo.id ? { ...x, url } : x))} label="Click or drag to upload" folder="logos" />
              </Field>
              <Field label="Alt Text">
                <Input value={logo.alt_text} onChange={e => setLogos(prev => prev.map(x => x.id === logo.id ? { ...x, alt_text: e.target.value } : x))} placeholder="Logo description" />
              </Field>
              <button onClick={() => saveLogo(logo)} className="w-full py-2.5 rounded-lg text-white font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{ background: '#F4A300' }}>
                <Save className="h-4 w-4" />Save Logo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHeroSections = () => (
    <div>
      <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Hero Sections</h2>
      <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Manage the hero section content for each page of your website.</p>
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
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Stats & Numbers</h2>
        <button onClick={() => setStats(prev => [...prev, { id: 0, label: 'New Stat', value: 0, suffix: '+', sort_order: prev.length, is_active: true }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white transition-all hover:scale-105"
          style={{ background: '#F4A300' }}>
          <Plus className="h-4 w-4" />Add Stat
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.id || `new-${i}`} className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-black" style={{ color: '#F4A300', fontFamily: "'Poppins', sans-serif" }}>{stat.value}{stat.suffix}</div>
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
            <button onClick={() => saveStat(stat)} className="mt-4 w-full py-2 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: '#F4A300' }}>
              <Save className="h-4 w-4" />{stat.id ? 'Save Changes' : 'Create Stat'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div>
      <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>About Page Content</h2>
      <div className="grid md:grid-cols-2 gap-5">
        {aboutContent.map(ab => (
          <div key={ab.id} className="p-5 rounded-xl" style={{ background: '#111827', border: '1px solid #1f2937' }}>
            <h3 className="font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#F4A300' }}>
              <span className="w-3 h-px block" style={{ background: '#F4A300' }} />{ab.section}
            </h3>
            <div className="space-y-3">
              <Field label="Section Title">
                <Input value={ab.title || ''} onChange={e => setAboutContent(prev => prev.map(x => x.id === ab.id ? { ...x, title: e.target.value } : x))} />
              </Field>
              <Field label="Content">
                <Textarea rows={4} value={ab.content || ''} onChange={e => setAboutContent(prev => prev.map(x => x.id === ab.id ? { ...x, content: e.target.value } : x))} />
              </Field>
              <Field label="Section Image (optional)">
                <ImageUploader currentUrl={ab.image_url || ''} onUploaded={url => setAboutContent(prev => prev.map(x => x.id === ab.id ? { ...x, image_url: url } : x))} folder="about" />
              </Field>
              <button onClick={() => saveAbout(ab)} className="w-full py-2.5 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: '#F4A300' }}>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Services</h2>
        <button onClick={() => setServices(prev => [...prev, { id: 0, title: 'New Service', subtitle: '', description: '', icon: 'Layers', image_url: '', sort_order: prev.length + 1, is_active: true, is_featured: false }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#F4A300' }}>
          <Plus className="h-4 w-4" />Add Service
        </button>
      </div>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Portfolio Projects</h2>
        <button onClick={() => setPortfolio(prev => [...prev, { id: 0, title: 'New Project', category: 'Exhibition', client: '', location: 'Cairo, Egypt', project_date: '2026', visitors: '', description: '', image_url: '', award: '', is_featured: false, is_active: true, sort_order: prev.length + 1 }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#F4A300' }}>
          <Plus className="h-4 w-4" />Add Project
        </button>
      </div>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Team Members</h2>
        <button onClick={() => setTeam(prev => [...prev, { id: 0, name: 'New Member', role: '', bio: '', image_url: '', email: '', linkedin_url: '', sort_order: prev.length + 1, is_active: true }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#F4A300' }}>
          <Plus className="h-4 w-4" />Add Member
        </button>
      </div>
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
              <Field label="Photo">
                <ImageUploader currentUrl={member.image_url} onUploaded={url => setTeam(prev => prev.map((x, xi) => xi === i ? { ...x, image_url: url } : x))} folder="team" />
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
              <button onClick={() => saveTeam(member)} className="w-full py-2.5 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: '#F4A300' }}>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Testimonials</h2>
        <button onClick={() => setTestimonials(prev => [...prev, { id: 0, author_name: 'Client Name', author_role: 'CEO', company: 'Company', quote: '', rating: 5, image_url: '', is_active: true, sort_order: prev.length + 1 }])}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#F4A300' }}>
          <Plus className="h-4 w-4" />Add Testimonial
        </button>
      </div>
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
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name"><Input value={t.author_name} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, author_name: e.target.value } : x))} /></Field>
                <Field label="Role / Title"><Input value={t.author_role || ''} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, author_role: e.target.value } : x))} /></Field>
                <Field label="Company"><Input value={t.company || ''} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, company: e.target.value } : x))} /></Field>
                <Field label="Rating (1-5)">
                  <Input type="number" min={1} max={5} value={t.rating} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, rating: parseInt(e.target.value) || 5 } : x))} />
                </Field>
              </div>
              <Field label="Photo (optional)">
                <ImageUploader currentUrl={t.image_url || ''} onUploaded={url => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, image_url: url } : x))} folder="testimonials" />
              </Field>
              <Field label="Quote / Review">
                <Textarea rows={4} value={t.quote || ''} onChange={e => setTestimonials(prev => prev.map((x, xi) => xi === i ? { ...x, quote: e.target.value } : x))} placeholder="What did the client say?" />
              </Field>
              <button onClick={() => saveTestimonial(t)} className="w-full py-2.5 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: '#F4A300' }}>
                <Save className="h-4 w-4" />{t.id ? 'Save Changes' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMedia = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Media Library</h2>
          <button onClick={() => inputRef.current?.click()} className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#F4A300' }}>
            <Upload className="h-4 w-4" />Upload Image
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => { Array.from(e.target.files || []).forEach(handleMediaUpload); }} />
        {media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl" style={{ background: '#111827', border: '2px dashed #374151' }}>
            <Upload className="h-10 w-10 mb-3" style={{ color: '#374151' }} />
            <p className="font-bold text-white mb-1">No images yet</p>
            <p className="text-sm mb-4" style={{ color: '#6b7280' }}>Upload your first image to get started</p>
            <button onClick={() => inputRef.current?.click()} className="px-5 py-2 rounded-lg text-white font-bold text-sm" style={{ background: '#F4A300' }}>Choose Files</button>
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
          Contact Inbox {unreadCount > 0 && <span className="ml-2 text-sm px-2.5 py-0.5 rounded-full" style={{ background: '#F4A300', color: '#000' }}>{unreadCount} new</span>}
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
            <div key={msg.id} className="p-5 rounded-xl transition-all" style={{ background: '#111827', border: `1px solid ${msg.status === 'new' ? 'rgba(244,163,0,0.3)' : '#1f2937'}` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: msg.status === 'new' ? '#F4A300' : msg.status === 'replied' ? '#10b981' : '#374151' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-bold text-sm text-white">{msg.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: msg.status === 'new' ? 'rgba(244,163,0,0.15)' : 'rgba(255,255,255,0.05)', color: msg.status === 'new' ? '#F4A300' : '#6b7280' }}>{msg.status}</span>
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
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 shrink-0" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <img src="/images/mopi_logo_20260101_112924.png" alt="MOPi" className="h-8 w-8 object-contain shrink-0" />
          {sidebarOpen && <span className="font-black text-xs tracking-widest uppercase text-white truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>CMS Admin</span>}
          <button onClick={() => setSidebarOpen(p => !p)} className="ml-auto shrink-0 p-1 rounded hover:bg-white/5" style={{ color: '#6b7280' }}>
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2">
          {sidebarGroups.map(group => (
            <div key={group.label} className="mb-3">
              {sidebarOpen && <p className="text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1.5 mb-1" style={{ color: '#374151' }}>{group.label}</p>}
              {group.items.map(item => (
                <button key={item.id} onClick={() => setSection(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all text-left"
                  style={{ background: section === item.id ? 'rgba(244,163,0,0.12)' : 'transparent', color: section === item.id ? '#F4A300' : '#6b7280', border: section === item.id ? '1px solid rgba(244,163,0,0.2)' : '1px solid transparent' }}
                  onMouseEnter={e => { if (section !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (section !== item.id) e.currentTarget.style.background = 'transparent'; }}>
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
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
        {/* Topbar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a' }}>
          <div className="flex items-center gap-3">
            <div className="text-sm font-bold text-white capitalize">{section.replace(/-/g, ' ')}</div>
            {saving && <div className="flex items-center gap-1.5 text-xs" style={{ color: '#F4A300' }}><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving...</div>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAll} className="p-2 rounded-lg transition-all hover:text-[#F4A300]" style={{ color: '#4b5563', background: '#111827', border: '1px solid #1f2937' }}>
              <RefreshCw className="h-4 w-4" />
            </button>
            <Link to="/" target="_blank" className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition-all hover:text-[#F4A300]" style={{ color: '#6b7280', background: '#111827', border: '1px solid #1f2937' }}>
              <ExternalLink className="h-3.5 w-3.5" />Live Site
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-6xl">
          {!loaded ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#F4A300' }} />
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

function NewSocialForm({ onSave }: { onSave: (item: Omit<SocialLink, 'id'>) => void }) {
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
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: '#F4A300' }}>
          <Plus className="h-4 w-4" />Add Social Link
        </button>
      </div>
    </div>
  );
}

function HeroEditor({ hero, onSave, saving }: { hero: HeroSection; onSave: (h: HeroSection) => void; saving: boolean }) {
  const [data, setData] = useState(hero);
  const [open, setOpen] = useState(false);
  const pageColors: Record<string, string> = { home: '#F4A300', about: '#3b82f6', services: '#8b5cf6', portfolio: '#10b981', contact: '#f43f5e' };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#111827', border: '1px solid #1f2937' }}>
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center justify-between p-5 text-left">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: pageColors[hero.page] || '#F4A300' }} />
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
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Background Image URL (optional)</label>
            <input value={data.bg_image_url || ''} onChange={e => setData(p => ({ ...p, bg_image_url: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: '#0f172a', border: '1px solid #374151', color: '#f3f4f6' }} placeholder="https://..." />
          </div>
          <button onClick={() => onSave(data)} disabled={saving}
            className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all hover:scale-[1.02]"
            style={{ background: '#F4A300' }}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Hero Section
          </button>
        </div>
      )}
    </div>
  );
}

function ServiceEditor({ service, index, onChange, onSave, onDelete }: { service: Service; index: number; onChange: (s: Service) => void; onSave: () => void; onDelete: () => void; }) {
  const [open, setOpen] = useState(!service.id);
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#111827', border: '1px solid #1f2937' }}>
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full" style={{ background: service.is_active ? '#10b981' : '#374151' }} />
          <span className="font-bold text-sm text-white">{service.title}</span>
          {service.is_featured && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(244,163,0,0.15)', color: '#F4A300' }}>Featured</span>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg hover:bg-red-900/30" style={{ color: '#ef4444' }}><Trash2 className="h-4 w-4" /></button>
          <ChevronDown className="h-4 w-4" style={{ color: '#6b7280', transform: open ? 'rotate(180deg)' : 'none' }} />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4" style={{ borderTop: '1px solid #1f2937' }}>
          <div className="pt-4 grid md:grid-cols-2 gap-4">
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
                <div onClick={() => onChange({ ...service, is_active: !service.is_active })} className="relative inline-flex h-6 w-11 rounded-full cursor-pointer transition-colors" style={{ background: service.is_active ? '#F4A300' : '#374151' }}>
                  <span className="inline-block h-5 w-5 rounded-full bg-white shadow mt-0.5 transition-transform" style={{ transform: service.is_active ? 'translateX(22px)' : 'translateX(2px)' }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Featured</span>
                <div onClick={() => onChange({ ...service, is_featured: !service.is_featured })} className="relative inline-flex h-6 w-11 rounded-full cursor-pointer transition-colors" style={{ background: service.is_featured ? '#F4A300' : '#374151' }}>
                  <span className="inline-block h-5 w-5 rounded-full bg-white shadow mt-0.5 transition-transform" style={{ transform: service.is_featured ? 'translateX(22px)' : 'translateX(2px)' }} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Service Image</label>
            <ImageUploader currentUrl={service.image_url || ''} onUploaded={url => onChange({ ...service, image_url: url })} folder="services" />
          </div>
          <button onClick={onSave} className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all hover:scale-[1.02]" style={{ background: '#F4A300' }}>
            <Save className="h-4 w-4" />{service.id ? 'Save Changes' : 'Create Service'}
          </button>
        </div>
      )}
    </div>
  );
}

function PortfolioEditor({ project, index, onChange, onSave, onDelete }: { project: Portfolio; index: number; onChange: (p: Portfolio) => void; onSave: () => void; onDelete: () => void; }) {
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
          {project.is_featured && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(244,163,0,0.15)', color: '#F4A300' }}>Featured</span>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg" style={{ color: '#ef4444' }}><Trash2 className="h-4 w-4" /></button>
          <ChevronDown className="h-4 w-4" style={{ color: '#6b7280', transform: open ? 'rotate(180deg)' : 'none' }} />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4" style={{ borderTop: '1px solid #1f2937' }}>
          <div className="pt-4 grid md:grid-cols-2 gap-4">
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
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#9ca3af' }}>Project Image</label>
            <ImageUploader currentUrl={project.image_url || ''} onUploaded={url => onChange({ ...project, image_url: url })} folder="portfolio" />
          </div>
          <div className="flex items-center gap-6">
            {[['is_active', 'Active'], ['is_featured', 'Featured']].map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div onClick={() => onChange({ ...project, [key]: !project[key as keyof Portfolio] })}
                  className="relative inline-flex h-6 w-11 rounded-full cursor-pointer transition-colors"
                  style={{ background: project[key as keyof Portfolio] ? '#F4A300' : '#374151' }}>
                  <span className="inline-block h-5 w-5 rounded-full bg-white shadow mt-0.5 transition-transform"
                    style={{ transform: project[key as keyof Portfolio] ? 'translateX(22px)' : 'translateX(2px)' }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>{label}</span>
              </div>
            ))}
          </div>
          <button onClick={onSave} className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all hover:scale-[1.02]" style={{ background: '#F4A300' }}>
            <Save className="h-4 w-4" />{project.id ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      )}
    </div>
  );
}
