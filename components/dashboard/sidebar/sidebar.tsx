'use client';

import styles from './styles.module.css';
import { TiHome } from "react-icons/ti";
import { MdWorkspacesFilled } from "react-icons/md";
import Link from 'next/link';
import { ListItem } from './listItem/listItem';
import { usePathname } from 'next/navigation';
import { Result } from '@/utils/dashboard/types';
import { getAllPages } from '@/services/projectsService';
import { useEffect, useState } from 'react';

export function SideBar() {
  const pathname = usePathname();
  const [pages, setPages] = useState<Result>({});

  useEffect(() => {
    const fetchPages = async () => {
      const result = await getAllPages() as Result;
      setPages(result);
    }
    fetchPages();
  }, []);

  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          <li className={pathname === '/' ? styles.selected : ''}>
            <Link href={'/'}>
              <TiHome /> Inicio
            </Link>
          </li>
        </ul>
        <section>
          <p className={styles.sidebar__workspace__title}> <span><MdWorkspacesFilled /></span> Espacios de trabajo</p>
          <ul>
            {Object.keys(pages).map((category) => (
              <ListItem key={category} mainTitle={category} pages={pages[category]}/>
            ))}
          </ul>
        </section>
      </nav>
    </aside>
  );
}