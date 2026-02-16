import { useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { getThemeByType } from './themeConfig';

export default function ThemeController() {
  const { tenant } = useTenant();

  useEffect(() => {
    if (!tenant) return;

    const resolveThemeType = () => {
      const rawValue =
        tenant?.theme ??
        tenant?.theme_mode ??
        tenant?.theme_type ??
        (tenant as { is_dark?: unknown } | null)?.is_dark;

      if (rawValue === undefined || rawValue === null) return 'light';

      if (typeof rawValue === 'boolean') return rawValue ? 'dark' : 'light';

      if (typeof rawValue === 'number') return rawValue === 1 ? 'dark' : 'light';

      const normalized = String(rawValue).trim().toLowerCase();
      if (['dark', 'true', '1', 'yes', 'y', 'on'].includes(normalized)) return 'dark';
      if (['light', 'false', '0', 'no', 'n', 'off'].includes(normalized)) return 'light';

      return 'light';
    };

    const themeType = resolveThemeType();
    console.log(`[ThemeController] Applying theme for tenant "${tenant.name}": ${themeType}`);

    const theme = getThemeByType(themeType);
    const root = document.documentElement;
    const colors = theme.colors;

    // 1. Branding Colors
    root.style.setProperty('--primary-color', tenant?.primary_color || colors.primary);
    root.style.setProperty('--secondary-color', tenant?.secondary_color || colors.secondary);

    // 2. Structural Colors (Light vs Dark)
    root.style.setProperty('--bg-body', colors.bgBody);
    root.style.setProperty('--bg-card', colors.bgCard);
    root.style.setProperty('--text-main', colors.textMain);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--border-color', colors.border);

    // 3. Optional: Set a class on the body if you need specific overrides
    // e.g., to handle that specific gradient background on the light theme
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme.type);
  }, [tenant]);

  return null;
}