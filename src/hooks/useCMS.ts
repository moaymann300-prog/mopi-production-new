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

export interface CMSData {
  settings: Record<string, string>;
  socials: CMSSocialLink[];
  headerLogo: CMSLogo | null;
  footerLogo: CMSLogo | null;
  heroes: Record<string, CMSHero>;
  stats: CMSStat[];
  services: CMSService[];
  portfolio: CMSPortfolio[];
  team: CMSTeam[];
  testimonials: CMSTestimonial[];
  about: Record<string, CMSAbout>;
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
    phone: '+966 50 000 0000',
    address: 'Riyadh, Saudi Arabia',
  });
  const [socials, setSocials] = useState<CMSSocialLink[]>([]);
  const [headerLogo, setHeaderLogo] = useState<CMSLogo | null>(null);
  const [footerLogo, setFooterLogo] = useState<CMSLogo | null>(null);
  const [heroes, setHeroes] = useState<Record<string, CMSHero>>({});
  const [stats, setStats] = useState<CMSStat[]>([]);
  const [services, setServices] = useState<CMSService[]>([]);
  const [portfolio, setPortfolio] = useState<CMSPortfolio[]>([]);
  const [team, setTeam] = useState<CMSTeam[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [about, setAbout] = useState<Record<string, CMSAbout>>({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          settingsRes, socialsRes, logosRes, heroesRes,
          statsRes, servicesRes, portfolioRes, teamRes,
          testimonialsRes, aboutRes,
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
        ]);

        // Settings → key:value map
        if (settingsRes.data) {
          const map: Record<string, string> = {};
          settingsRes.data.forEach((s: CMSSetting) => { map[s.key] = s.value; });
          setSettings(prev => ({ ...prev, ...map }));
        }

        // Socials
        if (socialsRes.data) setSocials(socialsRes.data);

        // Logos
        if (logosRes.data) {
          const header = logosRes.data.find((l: CMSLogo) => l.placement === 'header');
          const footer = logosRes.data.find((l: CMSLogo) => l.placement === 'footer');
          setHeaderLogo(header || null);
          setFooterLogo(footer || null);
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
    heroes,
    stats,
    services,
    portfolio,
    team,
    testimonials,
    about,
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
