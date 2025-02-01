'use client';

import styles from './styles.module.css';
import { useState } from 'react';
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { IoClipboardSharp } from "react-icons/io5";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Page {
  id: string;
  name: string;
  category: string;
}

export function ListItem({ pages, mainTitle, mainUrl='' }: 
  { 
    pages: Page[], 
    mainTitle: string,
    mainUrl?: string
  }
) {
  const [ listOpen, setListOpen ] = useState(true);
  const pathname = usePathname();

  if(mainUrl.length > 0) {
    return (
      <li className={`${styles.mainLink} ${pathname === mainUrl ? styles.selected : ''}`}>
        <Link href={ mainUrl }>  <CiViewTimeline/> { mainTitle } </Link>
      </li>
    );
  }

  return (
    <article>
      <li className={styles.listItem}  onClick={() => setListOpen(!listOpen)}>

        <p>
          {listOpen ? <IoMdArrowDropdownCircle/> : <IoMdArrowDroprightCircle/>}
          {mainTitle}
        </p>
      </li>      
        {
          pages.length > 0 && listOpen &&
          <ul>
            {pages.map((page) => (
              <li key={page.name} className={pathname === `/projects/${page.id}` ? styles.selected : ''}>
                <Link href={`/projects/${page.id}`} className={styles.link}>
                  <IoClipboardSharp />
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        }
    </article>
  );
}