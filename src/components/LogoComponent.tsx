import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LogoComponentProps {
  type: 'header' | 'footer';
  className?: string;
  alt?: string;
}

const LogoComponent = ({ type, className = '', alt }: LogoComponentProps) => {
  const [logoUrl, setLogoUrl] = useState('./images/mopi_logo_20260101_112924.png');
  const [logoAlt, setLogoAlt] = useState(alt || 'MOPi Production');

  useEffect(() => {
    loadLogo();
  }, [type]);

  const loadLogo = async () => {
    try {
      const { data: logoData } = await supabase
        .from('logo_settings_2026_01_01_13_00')
        .select('*')
        .eq('logo_type', type)
        .eq('is_active', true)
        .single();
      
      if (logoData) {
        setLogoUrl(logoData.logo_url);
        setLogoAlt(logoData.alt_text || alt || 'MOPi Production');
      }
    } catch (error) {
      console.error('Error loading logo:', error);
      // Keep default values if error
    }
  };

  return (
    <img 
      src={logoUrl} 
      alt={logoAlt}
      className={className}
    />
  );
};

export default LogoComponent;