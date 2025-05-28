// PrimeReact imports
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';

import './global.css';
import { Poppins } from 'next/font/google';
import { PrimeReactProvider } from '@/providers/PrimeReactProvider';
import { ThemeInitializer } from '@/components/common/themeInitializer/themeInitializer';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '700', '900'],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="es" className={`${poppins.className} antialiased`}>
      <body>
        <PrimeReactProvider>
          <ThemeInitializer />
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}
