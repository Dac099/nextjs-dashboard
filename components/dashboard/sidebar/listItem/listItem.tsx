'use client';

import styles from './styles.module.css';
import { useState } from 'react';
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { IoClipboardSharp } from "react-icons/io5";
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import type { PageWithViews } from '@/utils/dashboard/types';

type Props = {
  pages: PageWithViews[], 
  mainTitle: string,
  mainUrl?: string
};

export function ListItem({ pages, mainTitle, mainUrl='' }: Props) {
  const params = useParams();
  const [ listOpen, setListOpen ] = useState(true);
  const pathname = usePathname();
  const pageId = params.page_id as string;

  if(mainUrl.length > 0) {
    return (
      <li className={`${styles.mainLink} ${pathname === mainUrl ? styles.selected : ''}`}>
        <Link href={ mainUrl }>  { mainTitle } </Link>
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
              <li key={page.name} className={pageId === page.id ? styles.selected : ''}>
                <Link href={`/projects/${page.id}/${page.views[0]}`} className={styles.link}>
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