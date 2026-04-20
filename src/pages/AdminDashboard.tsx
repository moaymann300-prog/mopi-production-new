import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Settings, Image, FileText, Users, LayoutDashboard,
  LogOut, Save, Upload, Trash2, Edit, Plus, Eye,
  Globe, Phone, Mail, MapPin, Star, Briefcase,
  Home, Info, Wrench, FolderOpen, MessageSquare,
  CheckCircle, AlertCircle, X, Menu, ChevronRight,
  Facebook, Instagram, Linkedin, Twitter, RefreshCw,
  ToggleLeft, ToggleRight, Move, ImageIcon
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface SiteSetting { key: string; value: string }
interface HeroSection { id?: number; page: string; title: string; subtitle: string; description: string; button_primary_text: string; button_primary_link: string; button_secondary_text: string; button_secondary_link: string; background_image: string }
interface ServiceItem { id?: number; title: string; subtitle: string; description: string; image: string; features: string[]; pricing: string; is_featured: boolean; sort_order: number; is_active: boolean }
interface PortfolioItem { id?: number; title: string; category: string; client: string; location: string; project_date: string; description: string; image: string; award: string; is_featured: boolean; is_active: boolean }
interface TeamMember { id?: number; name: string; role: string; bio: string; image: string; experience: string; sort_order: number; is_active: boolean }
interface Testimonial { id?: number; client_name: string; client_title: string; client_company: string; client_image: string; testimonial: string; rating: number; is_featured: boolean; is_active: boolean }
interface ContactSubmission { id: number; name: string; email: string; company: string; phone: string; service: string; message: string; status: string; created_at: string }
interface MediaItem { id?: number; name: string; url: string; type: string; alt_text: string; section: string }
interface LogoState { url: string; alt: string; name?: string }

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white animate-in slide-in-from-bottom-4 duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
    {type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 hover:opacity-70"><X className="h-4 w-4" /></button>
  </div>
);

// ─── Image Picker ─────────────────────────────────────────────────────────────
const ImagePicker = ({ value, onChange, label }: { value: string; onChange: (url: string) => void; label?: string }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      <div className="flex gap-2">
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="https://... or upload below" className="text-sm" />
        <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()} className="shrink-0">
          {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img src={value} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) => (
  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
    <div className="p-2 rounded-lg bg-orange-50"><Icon className="h-5 w-5 text-orange-500" /></div>
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Data states
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({
    company_name: 'MOPi Production',
    company_tagline: 'Creating Exceptional Exhibition Experiences',
    company_description: 'We specialize in exhibition booth design, event production, and custom structures.',
    company_email: 'info@mopiproduction.com',
    company_phone: '+1 (555) 123-4567',
    company_address: '123 Exhibition Boulevard, New York, NY 10001, USA',
    company_facebook: 'https://facebook.com/mopiproduction',
    company_instagram: 'https://instagram.com/mopiproduction',
    company_linkedin: 'https://linkedin.com/company/mopiproduction',
    company_twitter: 'https://twitter.com/mopiproduction',
    stat_projects: '500+',
    stat_experience: '15+',
    stat_clients: '200+',
    stat_countries: '50+',
  });

  const [heroSections, setHeroSections] = useState<Record<string, HeroSection>>({});
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [logos, setLogos] = useState<{ header: LogoState; footer: LogoState }>({
    header: { url: '/images/mopi_logo_20260101_112924.png', alt: 'MOPi Production Header Logo' },
    footer: { url: '/images/mopi_logo_20260101_112924.png', alt: 'MOPi Production Footer Logo' },
  });

  // Edit modals
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingHero, setEditingHero] = useState<HeroSection | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ─── Load all data ──────────────────────────────────────────────────────────
  const loadAllData = async () => {
    try {
      const [siteRes, heroRes, servicesRes, portfolioRes, teamRes, testiRes, contactRes, mediaRes, logoRes] = await Promise.all([
        supabase.from('site_settings_2026_04_20').select('*'),
        supabase.from('hero_section_2026_04_20').select('*'),
        supabase.from('services_2026_04_20').select('*').order('sort_order'),
        supabase.from('portfolio_2026_04_20').select('*').order('sort_order'),
        supabase.from('team_members_2026_04_20').select('*').order('sort_order'),
        supabase.from('testimonials_2026_04_20').select('*').order('sort_order'),
        supabase.from('contact_submissions_2026_04_20').select('*').order('created_at', { ascending: false }),
        supabase.from('media_library_2026_04_20').select('*'),
        supabase.from('logo_settings_2026_01_01_13_00').select('*'),
      ]);

      if (siteRes.data) {
        const settings: Record<string, string> = {};
        siteRes.data.forEach((s: SiteSetting) => { settings[s.key] = s.value || ''; });
        setSiteSettings(prev => ({ ...prev, ...settings }));
      }
      if (heroRes.data) {
        const heroes: Record<string, HeroSection> = {};
        heroRes.data.forEach((h: HeroSection) => { heroes[h.page] = h; });
        setHeroSections(heroes);
      }
      if (servicesRes.data) setServices(servicesRes.data);
      if (portfolioRes.data) setPortfolio(portfolioRes.data);
      if (teamRes.data) setTeam(teamRes.data);
      if (testiRes.data) setTestimonials(testiRes.data);
      if (contactRes.data) setContacts(contactRes.data);
      if (mediaRes.data) setMedia(mediaRes.data);
      if (logoRes.data) {
        const logoData: Record<string, LogoState> = {};
        logoRes.data.forEach((l: any) => {
          logoData[l.logo_type] = { url: l.logo_url, alt: l.alt_text || '', name: l.logo_name };
        });
        if (logoData.header) setLogos(prev => ({ ...prev, header: logoData.header }));
        if (logoData.footer) setLogos(prev => ({ ...prev, footer: logoData.footer }));
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => { if (isAuthenticated) loadAllData(); }, [isAuthenticated]);

  // ─── Auth ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.password.length < 4) { showToast('Please enter a valid password', 'error'); return; }
    setIsAuthenticated(true);
    showToast('Welcome back! Dashboard loaded.');
  };

  const handleLogout = () => { setIsAuthenticated(false); setActiveTab('dashboard'); };

  // ─── Save Site Settings ────────────────────────────────────────────────────
  const saveSiteSettings = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(siteSettings).map(([key, value]) => ({
        key, value, updated_at: new Date().toISOString()
      }));
      const { error } = await supabase.from('site_settings_2026_04_20').upsert(updates, { onConflict: 'key' });
      if (error) throw error;
      showToast('Site settings saved successfully!');
    } catch (err: any) {
      showToast('Saved locally. Database: ' + (err?.message || 'check connection'), 'error');
    } finally { setSaving(false); }
  };

  // ─── Save Hero ─────────────────────────────────────────────────────────────
  const saveHero = async (hero: HeroSection) => {
    setSaving(true);
    try {
      const { error } = hero.id
        ? await supabase.from('hero_section_2026_04_20').update({ ...hero, updated_at: new Date().toISOString() }).eq('id', hero.id)
        : await supabase.from('hero_section_2026_04_20').upsert({ ...hero, updated_at: new Date().toISOString() }, { onConflict: 'page' });
      if (error) throw error;
      setHeroSections(prev => ({ ...prev, [hero.page]: hero }));
      setEditingHero(null);
      showToast(`${hero.page} hero saved!`);
    } catch (err: any) {
      showToast('Error: ' + err?.message, 'error');
    } finally { setSaving(false); }
  };

  // ─── Save Service ──────────────────────────────────────────────────────────
  const saveService = async (service: ServiceItem) => {
    setSaving(true);
    try {
      if (service.id) {
        const { error } = await supabase.from('services_2026_04_20').update({ ...service, updated_at: new Date().toISOString() }).eq('id', service.id);
        if (error) throw error;
        setServices(prev => prev.map(s => s.id === service.id ? service : s));
      } else {
        const { data, error } = await supabase.from('services_2026_04_20').insert({ ...service, updated_at: new Date().toISOString() }).select().single();
        if (error) throw error;
        setServices(prev => [...prev, data]);
      }
      setEditingService(null);
      showToast('Service saved!');
    } catch (err: any) {
      showToast('Error: ' + err?.message, 'error');
    } finally { setSaving(false); }
  };

  const deleteService = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('services_2026_04_20').delete().eq('id', id);
    setServices(prev => prev.filter(s => s.id !== id));
    showToast('Service deleted!');
  };

  // ─── Save Portfolio ────────────────────────────────────────────────────────
  const savePortfolio = async (item: PortfolioItem) => {
    setSaving(true);
    try {
      if (item.id) {
        const { error } = await supabase.from('portfolio_2026_04_20').update({ ...item, updated_at: new Date().toISOString() }).eq('id', item.id);
        if (error) throw error;
        setPortfolio(prev => prev.map(p => p.id === item.id ? item : p));
      } else {
        const { data, error } = await supabase.from('portfolio_2026_04_20').insert({ ...item, updated_at: new Date().toISOString() }).select().single();
        if (error) throw error;
        setPortfolio(prev => [...prev, data]);
      }
      setEditingPortfolio(null);
      showToast('Portfolio item saved!');
    } catch (err: any) {
      showToast('Error: ' + err?.message, 'error');
    } finally { setSaving(false); }
  };

  const deletePortfolio = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('portfolio_2026_04_20').delete().eq('id', id);
    setPortfolio(prev => prev.filter(p => p.id !== id));
    showToast('Project deleted!');
  };

  // ─── Save Team ─────────────────────────────────────────────────────────────
  const saveTeam = async (member: TeamMember) => {
    setSaving(true);
    try {
      if (member.id) {
        const { error } = await supabase.from('team_members_2026_04_20').update({ ...member, updated_at: new Date().toISOString() }).eq('id', member.id);
        if (error) throw error;
        setTeam(prev => prev.map(t => t.id === member.id ? member : t));
      } else {
        const { data, error } = await supabase.from('team_members_2026_04_20').insert({ ...member, updated_at: new Date().toISOString() }).select().single();
        if (error) throw error;
        setTeam(prev => [...prev, data]);
      }
      setEditingTeam(null);
      showToast('Team member saved!');
    } catch (err: any) {
      showToast('Error: ' + err?.message, 'error');
    } finally { setSaving(false); }
  };

  const deleteTeam = async (id: number) => {
    if (!confirm('Delete this team member?')) return;
    await supabase.from('team_members_2026_04_20').delete().eq('id', id);
    setTeam(prev => prev.filter(t => t.id !== id));
    showToast('Team member deleted!');
  };

  // ─── Save Testimonial ──────────────────────────────────────────────────────
  const saveTestimonial = async (t: Testimonial) => {
    setSaving(true);
    try {
      if (t.id) {
        const { error } = await supabase.from('testimonials_2026_04_20').update({ ...t, updated_at: new Date().toISOString() }).eq('id', t.id);
        if (error) throw error;
        setTestimonials(prev => prev.map(x => x.id === t.id ? t : x));
      } else {
        const { data, error } = await supabase.from('testimonials_2026_04_20').insert({ ...t, updated_at: new Date().toISOString() }).select().single();
        if (error) throw error;
        setTestimonials(prev => [...prev, data]);
      }
      setEditingTestimonial(null);
      showToast('Testimonial saved!');
    } catch (err: any) {
      showToast('Error: ' + err?.message, 'error');
    } finally { setSaving(false); }
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials_2026_04_20').delete().eq('id', id);
    setTestimonials(prev => prev.filter(x => x.id !== id));
    showToast('Testimonial deleted!');
  };

  // ─── Logo Upload ──────────────────────────────────────────────────────────
  const uploadLogo = (logoType: 'header' | 'footer', file: File) => {
    if (!file.type.startsWith('image/')) { showToast('Please select an image file', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('File must be under 5MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setLogos(prev => ({ ...prev, [logoType]: { ...prev[logoType], url: base64, name: file.name } }));
      try {
        const { data: existing } = await supabase.from('logo_settings_2026_01_01_13_00').select('id').eq('logo_type', logoType).single();
        if (existing) {
          await supabase.from('logo_settings_2026_01_01_13_00').update({ logo_url: base64, logo_name: file.name, updated_at: new Date().toISOString() }).eq('logo_type', logoType);
        } else {
          await supabase.from('logo_settings_2026_01_01_13_00').insert({ logo_type: logoType, logo_url: base64, logo_name: file.name, alt_text: `MOPi Production ${logoType} logo` });
        }
        showToast(`${logoType} logo updated!`);
      } catch (err: any) {
        showToast('Logo saved locally. DB: ' + err?.message, 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  // ─── Media Upload ─────────────────────────────────────────────────────────
  const uploadMedia = (file: File, section = 'general') => {
    if (!file.type.startsWith('image/')) { showToast('Please select an image file', 'error'); return; }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const url = e.target?.result as string;
      const newItem: MediaItem = { name: file.name, url, type: 'image', alt_text: file.name, section };
      try {
        const { data, error } = await supabase.from('media_library_2026_04_20').insert(newItem).select().single();
        if (error) throw error;
        setMedia(prev => [data, ...prev]);
        showToast('Media uploaded!');
      } catch {
        setMedia(prev => [{ ...newItem, id: Date.now() }, ...prev]);
        showToast('Media saved locally');
      }
    };
    reader.readAsDataURL(file);
  };

  const deleteMedia = async (id: number) => {
    if (!confirm('Delete this media item?')) return;
    await supabase.from('media_library_2026_04_20').delete().eq('id', id);
    setMedia(prev => prev.filter(m => m.id !== id));
    showToast('Media deleted!');
  };

  // ─── Contact status ───────────────────────────────────────────────────────
  const updateContactStatus = async (id: number, status: string) => {
    await supabase.from('contact_submissions_2026_04_20').update({ status }).eq('id', id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    showToast('Status updated!');
  };
  const deleteContact = async (id: number) => {
    if (!confirm('Delete this submission?')) return;
    await supabase.from('contact_submissions_2026_04_20').delete().eq('id', id);
    setContacts(prev => prev.filter(c => c.id !== id));
    showToast('Submission deleted!');
  };

  // ─── Sidebar nav items ─────────────────────────────────────────────────────
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'hero', label: 'Hero Sections', icon: Home },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'logos', label: 'Logos', icon: ImageIcon },
    { id: 'contacts', label: 'Contact Inbox', icon: MessageSquare },
  ];

  // ─── Login Screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center">
            <img src="./images/mopi_logo_20260101_112924.png" alt="MOPi" className="h-16 w-auto mx-auto mb-4 object-contain" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-orange-100 text-sm mt-1">MOPi Production CMS</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <Input type="email" placeholder="admin@mopiproduction.com" value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} required className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <Input type="password" placeholder="Enter password" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} required className="w-full" />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all hover:scale-[1.02]">
              Sign In to Dashboard
            </Button>
            <p className="text-center text-xs text-gray-400">Enter any email and password to access</p>
          </form>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );

  // ─── Helper: Field Editor ──────────────────────────────────────────────────
  const Field = ({ label, value, onChange, type = 'text', rows }: { label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {rows ? <Textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className="text-sm resize-none" /> : <Input type={type} value={value} onChange={e => onChange(e.target.value)} className="text-sm" />}
    </div>
  );

  // ─── Tab: Dashboard ────────────────────────────────────────────────────────
  const DashboardTab = () => (
    <div className="space-y-6">
      <SectionHeader icon={LayoutDashboard} title="Dashboard Overview" subtitle="Your website at a glance" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Services', count: services.length, icon: Wrench, color: 'bg-blue-50 text-blue-600' },
          { label: 'Portfolio', count: portfolio.length, icon: FolderOpen, color: 'bg-purple-50 text-purple-600' },
          { label: 'Team Members', count: team.length, icon: Users, color: 'bg-green-50 text-green-600' },
          { label: 'New Contacts', count: contacts.filter(c => c.status === 'new').length, icon: MessageSquare, color: 'bg-orange-50 text-orange-600' },
        ].map(stat => (
          <Card key={stat.label} className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Edit Homepage Hero', tab: 'hero', icon: Home },
            { label: 'Add Portfolio Item', tab: 'portfolio', icon: FolderOpen },
            { label: 'Add Service', tab: 'services', icon: Wrench },
            { label: 'Upload Media', tab: 'media', icon: Image },
            { label: 'Update Logo', tab: 'logos', icon: ImageIcon },
            { label: 'View Contacts', tab: 'contacts', icon: MessageSquare },
          ].map(action => (
            <button key={action.label} onClick={() => setActiveTab(action.tab)} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-sm font-medium text-gray-700 hover:text-orange-600">
              <action.icon className="h-4 w-4" />
              {action.label}
            </button>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Contact Submissions</CardTitle></CardHeader>
        <CardContent>
          {contacts.length === 0 ? <p className="text-gray-400 text-sm">No contact submissions yet.</p> : (
            <div className="space-y-2">
              {contacts.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{c.name} <span className="font-normal text-gray-500">— {c.company}</span></p>
                    <p className="text-xs text-gray-400">{c.email} · {c.service}</p>
                  </div>
                  <Badge className={c.status === 'new' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>{c.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // ─── Tab: Site Settings ────────────────────────────────────────────────────
  const SettingsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader icon={Settings} title="Site Settings" subtitle="Control all website text and info" />
        <Button onClick={saveSiteSettings} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
          {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save All
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-sm text-orange-600 uppercase tracking-wide">Company Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(['company_name', 'company_tagline', 'company_email', 'company_phone', 'company_address'] as const).map(k => (
              <Field key={k} label={k.replace('company_', '').replace('_', ' ')} value={siteSettings[k] || ''} onChange={v => setSiteSettings(p => ({ ...p, [k]: v }))} />
            ))}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
              <Textarea value={siteSettings.company_description || ''} onChange={e => setSiteSettings(p => ({ ...p, company_description: e.target.value }))} rows={3} className="text-sm resize-none" />
            </div>
          </CardContent>
        </Card>
        <Card><CardHeader><CardTitle className="text-sm text-orange-600 uppercase tracking-wide">Social Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'company_facebook', label: 'Facebook URL', icon: Facebook },
              { key: 'company_instagram', label: 'Instagram URL', icon: Instagram },
              { key: 'company_linkedin', label: 'LinkedIn URL', icon: Linkedin },
              { key: 'company_twitter', label: 'Twitter URL', icon: Twitter },
            ].map(s => (
              <div key={s.key} className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1"><s.icon className="h-3 w-3" />{s.label}</label>
                <Input value={siteSettings[s.key] || ''} onChange={e => setSiteSettings(p => ({ ...p, [s.key]: e.target.value }))} className="text-sm" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card><CardHeader><CardTitle className="text-sm text-orange-600 uppercase tracking-wide">Stats (Homepage)</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {[
              { key: 'stat_projects', label: 'Projects Completed' },
              { key: 'stat_experience', label: 'Years Experience' },
              { key: 'stat_clients', label: 'Happy Clients' },
              { key: 'stat_countries', label: 'Countries Served' },
            ].map(s => (
              <Field key={s.key} label={s.label} value={siteSettings[s.key] || ''} onChange={v => setSiteSettings(p => ({ ...p, [s.key]: v }))} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ─── Tab: Hero Sections ────────────────────────────────────────────────────
  const pages = ['home', 'about', 'services', 'portfolio', 'contact'];
  const HeroTab = () => (
    <div className="space-y-6">
      <SectionHeader icon={Home} title="Hero Sections" subtitle="Edit the top banner for each page" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map(page => {
          const hero = heroSections[page];
          return (
            <Card key={page} className="hover:shadow-md transition-all cursor-pointer group" onClick={() => setEditingHero(hero || { page, title: '', subtitle: '', description: '', button_primary_text: '', button_primary_link: '', button_secondary_text: '', button_secondary_link: '', background_image: '' })}>
              <CardContent className="p-0 overflow-hidden rounded-xl">
                <div className="relative h-32 bg-gray-900">
                  {hero?.background_image && <img src={hero.background_image} alt={page} className="w-full h-full object-cover opacity-50" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />}
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <Badge className="w-fit mb-1 capitalize bg-orange-500 text-white text-xs">{page}</Badge>
                    <p className="text-white font-bold text-sm line-clamp-2">{hero?.title || 'Click to configure'}</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white rounded-lg p-1.5"><Edit className="h-4 w-4 text-orange-500" /></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hero Edit Modal */}
      {editingHero && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditingHero(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-gray-900 capitalize">{editingHero.page} — Hero Section</h3>
              <button onClick={() => setEditingHero(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title" value={editingHero.title} onChange={v => setEditingHero(p => p ? { ...p, title: v } : p)} />
                <Field label="Subtitle" value={editingHero.subtitle} onChange={v => setEditingHero(p => p ? { ...p, subtitle: v } : p)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                <Textarea value={editingHero.description} onChange={e => setEditingHero(p => p ? { ...p, description: e.target.value } : p)} rows={3} className="text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Primary Button Text" value={editingHero.button_primary_text} onChange={v => setEditingHero(p => p ? { ...p, button_primary_text: v } : p)} />
                <Field label="Primary Button Link" value={editingHero.button_primary_link} onChange={v => setEditingHero(p => p ? { ...p, button_primary_link: v } : p)} />
                <Field label="Secondary Button Text" value={editingHero.button_secondary_text} onChange={v => setEditingHero(p => p ? { ...p, button_secondary_text: v } : p)} />
                <Field label="Secondary Button Link" value={editingHero.button_secondary_link} onChange={v => setEditingHero(p => p ? { ...p, button_secondary_link: v } : p)} />
              </div>
              <ImagePicker label="Background Image" value={editingHero.background_image} onChange={v => setEditingHero(p => p ? { ...p, background_image: v } : p)} />
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 rounded-b-2xl">
              <Button onClick={() => saveHero(editingHero!)} disabled={saving} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Hero
              </Button>
              <Button variant="outline" onClick={() => setEditingHero(null)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ─── Tab: Services ─────────────────────────────────────────────────────────
  const ServicesTab = () => {
    const emptyService: ServiceItem = { title: '', subtitle: '', description: '', image: '', features: [], pricing: '', is_featured: false, sort_order: 0, is_active: true };
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SectionHeader icon={Wrench} title="Services" subtitle="Manage your service offerings" />
          <Button onClick={() => setEditingService(emptyService)} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Service
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {services.map(service => (
            <Card key={service.id} className="hover:shadow-md transition-all">
              <CardContent className="p-0 overflow-hidden rounded-xl">
                {service.image && <img src={service.image} alt={service.title} className="w-full h-40 object-cover" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{service.title}</h3>
                      <p className="text-xs text-gray-500">{service.subtitle}</p>
                    </div>
                    {service.is_featured && <Badge className="bg-orange-100 text-orange-700 shrink-0">Featured</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{service.description}</p>
                  <p className="text-sm font-semibold text-orange-600 mb-3">{service.pricing}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingService(service)} className="flex-1 hover:border-orange-300 hover:text-orange-600">
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteService(service.id!)} className="text-red-500 hover:border-red-300 hover:bg-red-50">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingService && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditingService(null)}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-bold">{editingService.id ? 'Edit Service' : 'Add Service'}</h3>
                <button onClick={() => setEditingService(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Title" value={editingService.title} onChange={v => setEditingService(p => p ? { ...p, title: v } : p)} />
                  <Field label="Subtitle" value={editingService.subtitle} onChange={v => setEditingService(p => p ? { ...p, subtitle: v } : p)} />
                  <Field label="Pricing" value={editingService.pricing} onChange={v => setEditingService(p => p ? { ...p, pricing: v } : p)} />
                  <Field label="Sort Order" value={String(editingService.sort_order)} onChange={v => setEditingService(p => p ? { ...p, sort_order: parseInt(v) || 0 } : p)} type="number" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                  <Textarea value={editingService.description} onChange={e => setEditingService(p => p ? { ...p, description: e.target.value } : p)} rows={3} className="text-sm resize-none" />
                </div>
                <ImagePicker label="Service Image" value={editingService.image} onChange={v => setEditingService(p => p ? { ...p, image: v } : p)} />
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Features (one per line)</label>
                  <Textarea value={editingService.features.join('\n')} onChange={e => setEditingService(p => p ? { ...p, features: e.target.value.split('\n').filter(Boolean) } : p)} rows={4} className="text-sm resize-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingService.is_featured} onChange={e => setEditingService(p => p ? { ...p, is_featured: e.target.checked } : p)} className="rounded" />
                  <span className="text-sm font-medium text-gray-700">Featured on Homepage</span>
                </label>
              </div>
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 rounded-b-2xl">
                <Button onClick={() => saveService(editingService!)} disabled={saving} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Service
                </Button>
                <Button variant="outline" onClick={() => setEditingService(null)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Tab: Portfolio ────────────────────────────────────────────────────────
  const PortfolioTab = () => {
    const emptyProject: PortfolioItem = { title: '', category: 'Exhibition', client: '', location: '', project_date: '', description: '', image: '', award: '', is_featured: false, is_active: true };
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SectionHeader icon={FolderOpen} title="Portfolio" subtitle="Manage your project showcase" />
          <Button onClick={() => setEditingPortfolio(emptyProject)} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map(item => (
            <Card key={item.id} className="hover:shadow-md transition-all">
              <CardContent className="p-0 overflow-hidden rounded-xl">
                <div className="relative">
                  <img src={item.image} alt={item.title} className="w-full h-44 object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1703849222937-8a050e8a0607?w=400&auto=format&fit=crop&q=60' }} />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge className="bg-orange-500 text-white text-xs">{item.category}</Badge>
                    {item.is_featured && <Badge className="bg-yellow-500 text-white text-xs">⭐</Badge>}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{item.client} · {item.location}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingPortfolio(item)} className="flex-1 hover:border-orange-300 hover:text-orange-600">
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deletePortfolio(item.id!)} className="text-red-500 hover:border-red-300 hover:bg-red-50">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingPortfolio && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditingPortfolio(null)}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-bold">{editingPortfolio.id ? 'Edit Project' : 'Add Project'}</h3>
                <button onClick={() => setEditingPortfolio(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Project Title" value={editingPortfolio.title} onChange={v => setEditingPortfolio(p => p ? { ...p, title: v } : p)} />
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
                    <select value={editingPortfolio.category} onChange={e => setEditingPortfolio(p => p ? { ...p, category: e.target.value } : p)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                      {['Exhibition', 'Event', 'Booth', 'Corporate'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <Field label="Client Name" value={editingPortfolio.client} onChange={v => setEditingPortfolio(p => p ? { ...p, client: v } : p)} />
                  <Field label="Location" value={editingPortfolio.location} onChange={v => setEditingPortfolio(p => p ? { ...p, location: v } : p)} />
                  <Field label="Date" value={editingPortfolio.project_date} onChange={v => setEditingPortfolio(p => p ? { ...p, project_date: v } : p)} />
                  <Field label="Award (optional)" value={editingPortfolio.award} onChange={v => setEditingPortfolio(p => p ? { ...p, award: v } : p)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                  <Textarea value={editingPortfolio.description} onChange={e => setEditingPortfolio(p => p ? { ...p, description: e.target.value } : p)} rows={3} className="text-sm resize-none" />
                </div>
                <ImagePicker label="Project Image" value={editingPortfolio.image} onChange={v => setEditingPortfolio(p => p ? { ...p, image: v } : p)} />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingPortfolio.is_featured} onChange={e => setEditingPortfolio(p => p ? { ...p, is_featured: e.target.checked } : p)} className="rounded" />
                  <span className="text-sm font-medium text-gray-700">Featured on Homepage</span>
                </label>
              </div>
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 rounded-b-2xl">
                <Button onClick={() => savePortfolio(editingPortfolio!)} disabled={saving} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Project
                </Button>
                <Button variant="outline" onClick={() => setEditingPortfolio(null)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Tab: Team ─────────────────────────────────────────────────────────────
  const TeamTab = () => {
    const emptyMember: TeamMember = { name: '', role: '', bio: '', image: '', experience: '', sort_order: 0, is_active: true };
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SectionHeader icon={Users} title="Team Members" subtitle="Manage your About page team section" />
          <Button onClick={() => setEditingTeam(emptyMember)} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Member
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map(member => (
            <Card key={member.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex gap-4">
                <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover shrink-0" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=100&auto=format&fit=crop&q=60' }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{member.name}</h3>
                  <p className="text-xs text-orange-600 font-medium">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.experience}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => setEditingTeam(member)} className="flex-1 h-7 text-xs hover:border-orange-300 hover:text-orange-600">
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteTeam(member.id!)} className="h-7 text-red-500 hover:border-red-300 hover:bg-red-50">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingTeam && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditingTeam(null)}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-bold">{editingTeam.id ? 'Edit Member' : 'Add Member'}</h3>
                <button onClick={() => setEditingTeam(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Full Name" value={editingTeam.name} onChange={v => setEditingTeam(p => p ? { ...p, name: v } : p)} />
                  <Field label="Role / Position" value={editingTeam.role} onChange={v => setEditingTeam(p => p ? { ...p, role: v } : p)} />
                  <Field label="Experience" value={editingTeam.experience} onChange={v => setEditingTeam(p => p ? { ...p, experience: v } : p)} />
                  <Field label="Sort Order" value={String(editingTeam.sort_order)} onChange={v => setEditingTeam(p => p ? { ...p, sort_order: parseInt(v) || 0 } : p)} type="number" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bio</label>
                  <Textarea value={editingTeam.bio} onChange={e => setEditingTeam(p => p ? { ...p, bio: e.target.value } : p)} rows={3} className="text-sm resize-none" />
                </div>
                <ImagePicker label="Profile Photo" value={editingTeam.image} onChange={v => setEditingTeam(p => p ? { ...p, image: v } : p)} />
              </div>
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 rounded-b-2xl">
                <Button onClick={() => saveTeam(editingTeam!)} disabled={saving} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Member
                </Button>
                <Button variant="outline" onClick={() => setEditingTeam(null)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Tab: Testimonials ─────────────────────────────────────────────────────
  const TestimonialsTab = () => {
    const empty: Testimonial = { client_name: '', client_title: '', client_company: '', client_image: '', testimonial: '', rating: 5, is_featured: false, is_active: true };
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SectionHeader icon={Star} title="Testimonials" subtitle="Client reviews shown on homepage" />
          <Button onClick={() => setEditingTestimonial(empty)} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Review
          </Button>
        </div>
        <div className="space-y-4">
          {testimonials.map(t => (
            <Card key={t.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex gap-4">
                <img src={t.client_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60'} alt={t.client_name} className="w-12 h-12 rounded-full object-cover shrink-0" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60' }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">{t.client_name}</span>
                      <span className="text-gray-400 text-xs ml-2">{t.client_title} · {t.client_company}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingTestimonial(t)} className="h-7 text-xs hover:border-orange-300 hover:text-orange-600">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteTestimonial(t.id!)} className="h-7 text-red-500 hover:border-red-300 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{t.testimonial}"</p>
                  <div className="flex items-center gap-1 mt-1">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingTestimonial && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditingTestimonial(null)}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-bold">{editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                <button onClick={() => setEditingTestimonial(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Client Name" value={editingTestimonial.client_name} onChange={v => setEditingTestimonial(p => p ? { ...p, client_name: v } : p)} />
                  <Field label="Job Title" value={editingTestimonial.client_title} onChange={v => setEditingTestimonial(p => p ? { ...p, client_title: v } : p)} />
                  <Field label="Company" value={editingTestimonial.client_company} onChange={v => setEditingTestimonial(p => p ? { ...p, client_company: v } : p)} />
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</label>
                    <select value={editingTestimonial.rating} onChange={e => setEditingTestimonial(p => p ? { ...p, rating: parseInt(e.target.value) } : p)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Testimonial Text</label>
                  <Textarea value={editingTestimonial.testimonial} onChange={e => setEditingTestimonial(p => p ? { ...p, testimonial: e.target.value } : p)} rows={4} className="text-sm resize-none" />
                </div>
                <ImagePicker label="Client Photo (optional)" value={editingTestimonial.client_image} onChange={v => setEditingTestimonial(p => p ? { ...p, client_image: v } : p)} />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingTestimonial.is_featured} onChange={e => setEditingTestimonial(p => p ? { ...p, is_featured: e.target.checked } : p)} className="rounded" />
                  <span className="text-sm font-medium text-gray-700">Featured on Homepage</span>
                </label>
              </div>
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 rounded-b-2xl">
                <Button onClick={() => saveTestimonial(editingTestimonial!)} disabled={saving} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save
                </Button>
                <Button variant="outline" onClick={() => setEditingTestimonial(null)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Tab: Media Library ────────────────────────────────────────────────────
  const MediaTab = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SectionHeader icon={Image} title="Media Library" subtitle="Upload and manage all website images" />
          <Button onClick={() => fileRef.current?.click()} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Upload className="h-4 w-4 mr-2" /> Upload Image
          </Button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { Array.from(e.target.files || []).forEach(f => uploadMedia(f)); e.target.value = ''; }} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(item => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square hover:shadow-md transition-all">
              <img src={item.url} alt={item.alt_text} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3' }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(item.url).then(() => showToast('URL copied!'))} className="bg-white text-gray-800 rounded-lg p-2 hover:bg-orange-500 hover:text-white transition-colors" title="Copy URL">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteMedia(item.id!)} className="bg-white text-red-600 rounded-lg p-2 hover:bg-red-500 hover:text-white transition-colors" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-2">
                <p className="text-white text-xs truncate">{item.name}</p>
              </div>
            </div>
          ))}
          <button onClick={() => fileRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-orange-500">
            <Upload className="h-8 w-8" />
            <span className="text-xs font-medium">Upload</span>
          </button>
        </div>
      </div>
    );
  };

  // ─── Tab: Logos ────────────────────────────────────────────────────────────
  const LogosTab = () => {
    const headerRef = useRef<HTMLInputElement>(null);
    const footerRef = useRef<HTMLInputElement>(null);
    return (
      <div className="space-y-6">
        <SectionHeader icon={ImageIcon} title="Logo Management" subtitle="Control header and footer logos" />
        <div className="grid md:grid-cols-2 gap-6">
          {(['header', 'footer'] as const).map(type => (
            <Card key={type}>
              <CardHeader><CardTitle className="capitalize text-sm text-orange-600 uppercase tracking-wide">{type} Logo</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 rounded-xl p-6 flex items-center justify-center h-32">
                  <img src={logos[type].url} alt={logos[type].alt} className="max-h-full w-auto object-contain" onError={e => { (e.target as HTMLImageElement).src = './images/mopi_logo_20260101_112924.png' }} />
                </div>
                <p className="text-xs text-gray-400 truncate">{logos[type].name || 'Default logo'}</p>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => (type === 'header' ? headerRef : footerRef).current?.click()}>
                    <Upload className="h-4 w-4 mr-2" /> Upload New
                  </Button>
                  <Button variant="outline" className="text-red-500 hover:border-red-300 hover:bg-red-50" onClick={() => setLogos(prev => ({ ...prev, [type]: { url: './images/mopi_logo_20260101_112924.png', alt: 'MOPi Production', name: 'default' } }))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <input ref={headerRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadLogo('header', f); e.target.value = ''; }} />
        <input ref={footerRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadLogo('footer', f); e.target.value = ''; }} />
      </div>
    );
  };

  // ─── Tab: Contacts ─────────────────────────────────────────────────────────
  const ContactsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader icon={MessageSquare} title="Contact Inbox" subtitle="All form submissions from your website" />
        <Button variant="outline" onClick={loadAllData}><RefreshCw className="h-4 w-4 mr-2" /> Refresh</Button>
      </div>
      {contacts.length === 0 ? (
        <Card><CardContent className="py-16 text-center"><MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No contact submissions yet.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {contacts.map(c => (
            <Card key={c.id} className="hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{c.name} <span className="font-normal text-gray-500 text-sm">— {c.company}</span></h3>
                    <p className="text-sm text-gray-500">{c.email} {c.phone && `· ${c.phone}`}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={c.status === 'new' ? 'bg-orange-100 text-orange-700' : c.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>{c.status}</Badge>
                    <Button size="sm" variant="outline" onClick={() => deleteContact(c.id)} className="h-7 text-red-500 hover:border-red-300 hover:bg-red-50"><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
                {c.service && <p className="text-xs text-orange-600 font-medium mb-2">Service: {c.service}</p>}
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{c.message}</p>
                <div className="flex gap-2 mt-3">
                  {['new', 'in-progress', 'replied', 'closed'].map(s => (
                    <button key={s} onClick={() => updateContactStatus(c.id, s)} className={`text-xs px-3 py-1 rounded-full border transition-colors ${c.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'}`}>{s}</button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // ─── Render tabs ───────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'settings': return <SettingsTab />;
      case 'hero': return <HeroTab />;
      case 'services': return <ServicesTab />;
      case 'portfolio': return <PortfolioTab />;
      case 'team': return <TeamTab />;
      case 'testimonials': return <TestimonialsTab />;
      case 'media': return <MediaTab />;
      case 'logos': return <LogosTab />;
      case 'contacts': return <ContactsTab />;
      default: return <DashboardTab />;
    }
  };

  // ─── Main Layout ───────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-gray-900 text-white flex flex-col transition-all duration-300 shrink-0`}>
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          {sidebarOpen && <img src="./images/mopi_logo_20260101_112924.png" alt="MOPi" className="h-8 w-auto object-contain" />}
          <button onClick={() => setSidebarOpen(p => !p)} className="ml-auto p-1 hover:bg-gray-800 rounded-lg transition-colors">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800 space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <Eye className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>View Website</span>}
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-900 hover:text-red-300 transition-all">
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900 capitalize">{navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}</h1>
            <p className="text-xs text-gray-500">MOPi Production CMS · Control your entire website</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={loadAllData} className="hover:border-orange-300 hover:text-orange-600">
              <RefreshCw className="h-4 w-4 mr-1" /> Sync
            </Button>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Eye className="h-4 w-4 mr-1" /> Live Site
              </Button>
            </a>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {renderTab()}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminDashboard;
