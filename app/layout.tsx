'use client';

import './global.css';
import { Poppins } from 'next/font/google';
import useThemeStore from '@/stores/themeStore';
import { useEffect } from 'react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200' ,'400', '700', '900'],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <html lang="es" className={`${poppins.className} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  );
}
