'use client';

// Theme provider component for managing multiple themes
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { themesApi } from '@/lib/api/client';

interface Theme {
  id: string;
  name: string;
  slug: string;
  config: Record<string, any>;
  customCss?: string;
  customJs?: string;
}

interface ThemeContextType {
  currentTheme: Theme | null;
  themes: Theme[];
  setTheme: (themeId: string) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentThemeId, setCurrentThemeId] = useState<string | null>(null);

  // Type for theme - must match Theme interface
  type ThemeData = Theme;

  const { data: themes = [], isLoading } = useQuery<ThemeData[]>({
    queryKey: ['themes'],
    queryFn: async () => {
      // Disabled theme fetching as it's been repurposed to Site Settings
      return [];
    },
    enabled: false,
  });

  const { data: activeTheme } = useQuery<ThemeData>({
    queryKey: ['active-theme'],
    queryFn: async () => {
      // Disabled theme fetching
      return null as any;
    },
    enabled: false,
  });

  // Use useEffect to handle theme loading (onSuccess is deprecated in React Query v5)
  useEffect(() => {
    if (activeTheme?.id) {
      setCurrentThemeId(activeTheme.id);
    }
  }, [activeTheme]);

  const currentTheme = themes.find((t) => t.id === currentThemeId) || activeTheme || null;

  useEffect(() => {
    if (currentTheme) {
      // Apply custom CSS
      if (currentTheme.customCss) {
        const styleId = `theme-${currentTheme.id}`;
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.id = styleId;
          document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = currentTheme.customCss;
      }

      // Apply theme config CSS variables
      if (currentTheme.config && currentTheme.config.cssVariables) {
        const root = document.documentElement;
        Object.entries(currentTheme.config.cssVariables).forEach(([key, value]) => {
          root.style.setProperty(key, value as string);
        });
      }
    }
  }, [currentTheme]);

  const setTheme = async (themeId: string) => {
    try {
      await themesApi.activate(themeId);
      setCurrentThemeId(themeId);
    } catch (error) {
      console.error('Failed to activate theme:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themes,
        setTheme,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

