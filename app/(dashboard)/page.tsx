import React from 'react';
import styles from './page.module.css';
import { ProgressProyects } from '@/components/home/progressProyects/progressProyects';

export default async function Page() {

  return (
    <article className={styles.mainContainer}>
      <ProgressProyects />
    </article>
  );
}

