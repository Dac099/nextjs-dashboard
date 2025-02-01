'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { BiSolidSearchAlt2 } from "react-icons/bi";

export const SearchInput = () => {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles['container-item']} onClick={() => setIsEditing(true)}>
      {isEditing ? (
        <div className={styles['input-container']}>
          <BiSolidSearchAlt2 className={styles['input-icon']} />
          <input 
            type="text" 
            placeholder="Busca en este tablero" 
            className={styles['search-input']}
            autoFocus
          />
        </div>
      ) : (
        <article className={styles['single-item']}>
          <BiSolidSearchAlt2 />
          <p>Búsqueda</p>
        </article>
      )}
    </div>
  );
};