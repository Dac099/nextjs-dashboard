'use client';
import { PrimeReactProvider as Provider, PrimeReactContext } from 'primereact/api';
import React, { useEffect, useState, useContext } from 'react';
import useThemeStore from '@/stores/themeStore';

export function PrimeReactProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Añadimos un elemento link al head para el tema claro en la carga inicial
    if (!document.getElementById('theme-link')) {
      const linkElement = document.createElement('link');
      linkElement.id = 'theme-link';
      linkElement.rel = 'stylesheet';
      linkElement.href = '/themes/lara-light-purple/theme.css'; // Tema predeterminado
      document.head.appendChild(linkElement);
    }
  }, []);

  useEffect(() => {
    // Solo cambiamos el tema cuando el componente está montado
    if (mounted) {
      const changeTheme = () => {
        const themeLink = document.getElementById('theme-link') as HTMLLinkElement;
        if (themeLink) {
          const newTheme = theme === 'light' ? 'lara-light-purple' : 'lara-dark-purple';
          themeLink.href = `/themes/${newTheme}/theme.css`;
        }
      };
      
      changeTheme();
    }
  }, [theme, mounted]);

  if (!mounted) {
    return <Provider>{children}</Provider>;
  }

  return (
    <Provider>
      {children}
    </Provider>
  );
}
