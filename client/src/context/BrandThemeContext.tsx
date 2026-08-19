import React, { createContext, useContext, useEffect, useState } from 'react';

export type BrandTheme = 'emerald-pure' | 'corporate-brand';

interface BrandThemeContextType {
  theme: BrandTheme;
  setTheme: (theme: BrandTheme) => void;
  toggleTheme: () => void;
}

const BrandThemeContext = createContext<BrandThemeContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'alianza_brand_theme';

export function BrandThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<BrandTheme>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as BrandTheme | null;
    return saved === 'corporate-brand' ? 'corporate-brand' : 'emerald-pure';
  });

  const setTheme = (newTheme: BrandTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(LOCAL_STORAGE_KEY, newTheme);
    document.documentElement.setAttribute('data-brand-theme', newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'emerald-pure' ? 'corporate-brand' : 'emerald-pure';
    setTheme(nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-brand-theme', theme);
  }, [theme]);

  return (
    <BrandThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </BrandThemeContext.Provider>
  );
}

export function useBrandTheme() {
  const context = useContext(BrandThemeContext);
  if (!context) {
    throw new Error('useBrandTheme debe ser utilizado dentro de un BrandThemeProvider');
  }
  return context;
}
