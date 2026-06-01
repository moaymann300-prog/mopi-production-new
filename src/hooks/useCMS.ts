import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CMSSetting { key: string; value: string; }
export interface CMSSocialLink { platform: string; url: string; icon: string; is_active: boolean; sort_order: number; }
export interface CMSLogo { placement: string; url: string; alt_text: string; is_active: boolean; }
export interface CMSHero { page: string; badge_text: string; heading: string; subheading: string; cta_primary_label: string; cta_primary_url: string; cta_secondary_label: string; cta_secondary_url: string; bg_image_url: string; }
export interface CMSStat { label: string; value: number; suffix: string; sort_order: number; is_active: boolean; }
export interface CMSService { id: number; title: string; subtitle: string; description: string; icon: string; image_url: string; sort_order: number; is_active: boolean; is_featured: boolean; }
export interface CMSPortfolio { id: number; title: string; category: string; client: string; location: string; description: string; image_url: string; award: string; is_featured: boolean; is_active: boolean; sort_order: number; }
export interface CMSTeam { id: number; name: string; role: string; bio: string; image_url: string; email: string; linkedin_url: string; sort_order: number; is_active: boolean; }
export interface CMSTestimonial { id: number; author_name: string; author_role: string; company: string; quote: string; rating: number; image_url: string; is_active: boolean; }
export interface CMSAbout { section: string; title: string; content: string; image_url: string; }
export interface CMSPageContent { id: number; page: string; section: string; field: string; value_en: string; value_ar: string; }
export interface CMSPageImage { id: number; page: string; section: string; image_key: string; image_url: string; alt_text_en: string; alt_text_ar: string; }

export interface CMSData {
  settings: Record<string, string>;
  socials: CMSSocialLink[];
  headerLogo: CMSLogo | null;
  footerLogo: CMSLogo | null;
  faviconLogo: CMSLogo | null;
  heroes: Record<string, CMSHero>;
  stats: CMSStat[];
  services: CMSService[];
  portfolio: CMSPortfolio[];
  team: CMSTeam[];
  testimonials: CMSTestimonial[];
  about: Record<string, CMSAbout>;
  pageContent: CMSPageContent[];
  pageImages: CMSPageImage[];
  loading: boolean;
}

const DEFAULT_LOGO = '/images/mopi_logo_20260101_112924.png';

// ─── Main Hook ────────────────────────────────────────────────────────────────
export function useCMS(): CMSData {
  const [loading, setLoading] = useState(true);
const [settings, setSettings] = useState<Record<string, string>>({
    company_name: 'MOPi Production',
    tagline: 'Creating Extraordinary Events',
    email: 'info@mopiproduction.com',
    email_main: 'info@mopiproduction.com',
    email_projects: 'projects@mopiproduction.com',
    phone_1: '+20 100 000 0000',
    phone_2: '',
    address: 'Cairo, Egypt',
    whatsapp_number: '201000000000',
    footer_tagline: 'Cairo\'s leading exhibition booth design and event production company.',
    footer_description: 'Cairo\'s leading exhibition booth design and event production company.',
  });
const [socials, setSocials] = useState<CMSSocialLink[]>([]);
  const [headerLogo, setHeaderLogo] = useState<CMSLogo | null>(null);
  const [footerLogo, setFooterLogo] = useState<CMSLogo | null>(null);
  const [faviconLogo, setFaviconLogo] = useState<CMSLogo | null>(null);
  const [heroes, setHeroes] = useState<Record<string, CMSHero>>({});
  const [stats, setStats] = useState<CMSStat[]>([]);
  const [services, setServices] = useState<CMSService[]>([]);
  const [portfolio, setPortfolio] = useState<CMSPortfolio[]>([]);
  const [team, setTeam] = useState<CMSTeam[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [about, setAbout] = useState<Record<string, CMSAbout>>({});
  const [pageContent, setPageContent] = useState<CMSPageContent[]>([]);
  const [pageImages, setPageImages] = useState<CMSPageImage[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          settingsRes, socialsRes, logosRes, heroesRes,
          statsRes, servicesRes, portfolioRes, teamRes,
          testimonialsRes, aboutRes, pageContentRes, pageImagesRes,
        ] = await Promise.all([
          supabase.from('cms_site_settings_2026_04_21').select('key, value'),
          supabase.from('cms_social_links_2026_04_21').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('cms_logos_2026_04_21').select('*').eq('is_active', true),
          supabase.from('cms_hero_sections_2026_04_21').select('*'),
          supabase.from('cms_stats_2026_04_21').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('cms_services_2026_04_21').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('cms_portfolio_2026_04_21').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('cms_team_2026_04_21').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('cms_testimonials_2026_04_21').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('cms_about_content_2026_04_21').select('*'),
          supabase.from('cms_page_content_2026_06_01').select('*'),
          supabase.from('cms_page_images_2026_06_01').select('*'),
        ]);

// Settings → key:value map
        if (settingsRes.data) {
          const map: Record<string, string> = {};
          settingsRes.data.forEach((s: CMSSetting) => { map[s.key] = s.value; });
          // Aliases: map DB keys → keys used by pages
          if (map['email_main'] && !map['email']) map['email'] = map['email_main'];
          if (map['email_projects'] && !map['email_2']) map['email_2'] = map['email_projects'];
          if (map['footer_description'] && !map['footer_tagline']) map['footer_tagline'] = map['footer_description'];
          setSettings(prev => ({ ...prev, ...map }));
        }

        // Socials
        if (socialsRes.data) setSocials(socialsRes.data);

// Logos
        if (logosRes.data) {
          const header = logosRes.data.find((l: CMSLogo) => l.placement === 'header');
          const footer = logosRes.data.find((l: CMSLogo) => l.placement === 'footer');
          const favicon = logosRes.data.find((l: CMSLogo) => l.placement === 'favicon');
          setHeaderLogo(header || null);
          setFooterLogo(footer || null);
          setFaviconLogo(favicon || null);
        }

        // Heroes → page:hero map
        if (heroesRes.data) {
          const map: Record<string, CMSHero> = {};
          heroesRes.data.forEach((h: CMSHero) => { map[h.page] = h; });
          setHeroes(map);
        }

        // Stats
        if (statsRes.data) setStats(statsRes.data);

        // Services
        if (servicesRes.data) setServices(servicesRes.data);

        // Portfolio
        if (portfolioRes.data) setPortfolio(portfolioRes.data);

        // Team
        if (teamRes.data) setTeam(teamRes.data);

        // Testimonials
        if (testimonialsRes.data) setTestimonials(testimonialsRes.data);

        // About → section:content map
        if (aboutRes.data) {
          const map: Record<string, CMSAbout> = {};
          aboutRes.data.forEach((a: CMSAbout) => { map[a.section] = a; });
          setAbout(map);
        }
        // Page Content
        if (pageContentRes.data) setPageContent(pageContentRes.data);
        // Page Images
        if (pageImagesRes.data) setPageImages(pageImagesRes.data);
      } catch (err) {
        console.error('CMS fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return {
    settings,
    socials,
    headerLogo,
    footerLogo,
    faviconLogo,
    heroes,
    stats,
    services,
    portfolio,
    team,
    testimonials,
    about,
    pageContent,
    pageImages,
    loading,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function getLogoUrl(logo: CMSLogo | null): string {
  if (!logo || !logo.url) return DEFAULT_LOGO;
  return logo.url;
}

export function getSocialUrl(socials: CMSSocialLink[], platform: string): string {
  const s = socials.find(s => s.platform.toLowerCase() === platform.toLowerCase());
  return s?.url || '';
}

// ─── Page Content Helpers ────────────────────────────────────────────────────
export function getCMSText(
  items: CMSPageContent[],
  page: string,
  section: string,
  field: string,
  lang: 'en' | 'ar',
  fallback: string
): string {
  const item = items.find(i => i.page === page && i.section === section && i.field === field);
  if (!item) return fallback;
  return (lang === 'ar' ? item.value_ar : item.value_en) || fallback;
}

export function getCMSImage(
  items: CMSPageImage[],
  page: string,
  section: string,
  key: string,
  fallback: string
): string {
  const item = items.find(i => i.page === page && i.section === section && i.image_key === key);
  if (!item || !item.image_url) return fallback;
  return item.image_url;
}