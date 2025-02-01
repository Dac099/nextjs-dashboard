'use client';

import styles from './styles.module.css';
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineGroup } from "react-icons/ai";
import { useState, useEffect, useRef } from 'react';

export const MultiBtn = () => {
  const [ showOptions, setShowOptions ] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <article className={styles['multiBtn-main']}>
      <article className={styles['multiBtn-container']}>
        <button 
          type="button"
          className={styles['multiBtn-container__btn']}
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
          <button className={styles.options__btn}>
            <AiOutlineGroup/>
            <span>Nuevo grupo de items</span>
          </button>
        </section>
      )}      
    </article>
  );
}