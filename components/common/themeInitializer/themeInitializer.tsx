'use client'; 

import { useEffect } from 'react';
import useThemeStore from '@/stores/themeStore'; 

export function ThemeInitializer() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Establecer el tema en el atributo data-theme del body
    document.body.setAttribute('data-theme', theme);
    
    // Agregar una clase al elemento html para facilitar estilos condicionales
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  return null;
}