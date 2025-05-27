'use client'; 

import { useEffect } from 'react';
import useThemeStore from '@/stores/themeStore'; 

export function ThemeInitializer() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return null;
}