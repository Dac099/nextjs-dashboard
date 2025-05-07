'use client';
import styles from './styles.module.css';
import Image from 'next/image';
import LogoYne from '@/public/logo_yne.png';
import { FaUser } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { ThemeButton } from './themeButton/themeButton'
import { useState, useRef, RefObject } from 'react';
import { IoLogOut as LogoutIcon } from "react-icons/io5";
import { logoutAction } from '@/actions/auth';
import useClickOutside from '@/hooks/useClickOutside';

export function MainBar() {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async() => {
    await logoutAction();
  }

  useClickOutside(menuRef as RefObject<HTMLDivElement>, () => {
    setShowUserMenu(false);
  });

  return (
    <article className={styles.mainbar}>
      <section>
        <Image 
          src={LogoYne} 
          alt="Logo de la empresa YNE Automatización Internacional" 
          />
        <p>WorkMonitor</p>
        <ThemeButton />
      </section>
      <section className={styles.userData} ref={menuRef}>
        <IoNotifications />
        <FaUser 
          onClick={() => setShowUserMenu(!showUserMenu)}
        />
        {showUserMenu &&
          <article className={styles.userMenu}>
            <div 
              className={styles.menuOption}
              onClick={() => handleSignOut()}
            > 
              <span className={styles.iconOption}><LogoutIcon /></span> 
              Logout
            </div>
          </article>
        }
      </section>
    </article>
  );
}