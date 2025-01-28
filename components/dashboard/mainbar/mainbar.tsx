'use client';

import styles from './styles.module.css';
import Image from 'next/image';
import LogoYne from '@/public/logo_yne.png';
import { FaUser } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { ThemeButton } from '../themeButton/themeButton';

export function MainBar() {
  return (
    <article className={styles.mainbar}>
      <section>
        <Image 
          src={LogoYne} 
          alt="Logo de la empresa YNE Automatización Internacional" 
          />
        <p>YNE Automatización</p>
        <ThemeButton />
      </section>
      <section>
        <IoNotifications />
        <FaUser />
      </section>
    </article>
  );
}