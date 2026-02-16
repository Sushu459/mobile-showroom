// src/utils/themeConfig.ts

export interface Theme {
  name: string;
  type: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    bgBody: string;      // Page background
    bgCard: string;      // Card background (We will make this Grey)
    textMain: string;    // Main text (We will make this White)
    textMuted: string;   // Secondary text (Light Grey)
    border: string;      // Border color
  }
}

export const THEMES: Record<string, Theme> = {
  // --- THEME 1: Light Mode (No changes here) ---
  'localhost': {
    name: 'Classic Light',
    type: 'light',
    colors: {
      primary: '#2563EB',   // Blue
      secondary: '#1E40AF',
      bgBody: '#f9fafb',    
      bgCard: '#ffffff',    
      textMain: '#111827',  // Black/Gray 900
      textMuted: '#6b7280', 
      border: '#e5e7eb'     
    }
  },

  // --- THEME 2: Premium Dark Mode ---
  'dark-store.com': {
    name: 'Midnight Black',
    type: 'dark',
    colors: {
      primary: '#60a5fa',   // Lighter Blue (Pops better on dark)
      secondary: '#3b82f6',
      
      // 1. Background: Very dark (almost black) to contrast with the cards
      bgBody: '#020617',    // Slate-950
      
      // 2. Cards: Distinct Grey to stand out against the black background
      bgCard: '#1e293b',    // Slate-800 (A nice blue-grey)
      
      // 3. Text: Pure White for maximum readability
      textMain: '#ffffff',  
      
      // 4. Muted Text: Light Grey (so it doesn't disappear)
      textMuted: '#cbd5e1', // Slate-300
      
      // 5. Borders: Subtle dark grey to define edges
      border: '#334155'     // Slate-700
    }
  }
};

export const getThemeByType = (type?: string): Theme => {
  if (type === 'dark') {
    return THEMES['dark-store.com'];
  }
  return THEMES['localhost'];
};

export const getCurrentTheme = (): Theme => {
  const hostname = window.location.hostname;
  return THEMES[hostname] || THEMES['localhost'];
};