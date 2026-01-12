import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

// Default color values (same as in index.css)
export const DEFAULT_COLORS = {
  primaryColor: '220 60% 20%',
  accentColor: '38 92% 50%',
};

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const { branding } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply primary color
    if (branding.primaryColor) {
      root.style.setProperty('--primary', branding.primaryColor);
      root.style.setProperty('--ring', branding.primaryColor);
    }
    
    // Apply accent color
    if (branding.accentColor) {
      root.style.setProperty('--accent', branding.accentColor);
    }
    
    return () => {
      // Cleanup - reset to CSS defaults
      root.style.removeProperty('--primary');
      root.style.removeProperty('--ring');
      root.style.removeProperty('--accent');
    };
  }, [branding.primaryColor, branding.accentColor]);

  return <>{children}</>;
}
