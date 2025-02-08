'use client';

import styles from './styles.module.css';
import { MdGridView } from "react-icons/md";
import { BsList } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useState } from 'react';

type ViewSelected = 'grid' | 'list';
type Props = {
  itemId: string | undefined;
};

export const Files = ({ itemId }: Props) => {
  const [ viewSelected, setViewSelected ] = useState<ViewSelected>('grid');
  const files = [];
  return (
    <article className={styles.container}>
      <section className={styles.header}>
        <section>
          <button 
            type="button"
            className={styles['add-file--btn']}
          >
            <FaPlus size={15} />
            Agregar Archivo
          </button>

          <article className={styles.search}>
            <CiSearch size={18} />
            <input type="text" placeholder='Buscar archivos'/>
          </article>

        </section>

        <section className={styles['view-options']}>
          <MdGridView
            className={`${styles.option} ${viewSelected === 'grid' ? styles['option--selected'] : ''}`}
            onClick={() => setViewSelected('grid')}
          />
          <BsList 
            className={`${styles.option} ${viewSelected === 'list' ? styles['option--selected'] : ''}`}
            onClick={() => setViewSelected('list')}
          />
        </section>
      </section>
      <section className={styles.content}>
        
      </section>
    </article>
  );
}