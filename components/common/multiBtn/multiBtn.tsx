'use client';

import styles from './styles.module.css';
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineGroup } from "react-icons/ai";
import { useState, useRef, RefObject } from 'react';
import { createGroup, createFirstItem } from '@/actions/groups';
import { useParams } from 'next/navigation';
import useClickOutside from '@/hooks/useClickOutside';

export const MultiBtn = () => {
  const params = useParams();
  const pageId = params['page_id'] as string;
  const viewId = params['view_id'] as string;
  const [ showOptions, setShowOptions ] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef as RefObject<HTMLDivElement>, () => setShowOptions(false));
  
  return (
    <article className={styles['multiBtn-main']}>
      <article className={styles['multiBtn-container']}>
        <button 
          type="button"
          className={styles['multiBtn-container__btn']}
          onClick={() => createFirstItem(pageId, viewId)}
        >
          Nuevo item
        </button>
        <section 
          onClick={() => setShowOptions(!showOptions)}
          className={styles['multiBtn-container__arrow']}
        >
          <MdKeyboardArrowDown/>
        </section>
      </article>
      
      {showOptions && (
        <section className={styles.options} ref={containerRef}>
          <button 
            className={styles.options__btn}
            onClick={() => createGroup(pageId, viewId)}
          >
            <AiOutlineGroup/>
            <span>Nuevo grupo de items</span>
          </button>
        </section>
      )}      
    </article>
  );
}