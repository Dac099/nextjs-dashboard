'use client';
import styles from './resumedNumber.module.css';

type Props = {
  values: string[];
}

export function ResumedNumber({values}: Props){
  const total: number = values.reduce((sum, value) => sum + parseFloat(JSON.parse(value)), 0);
  return (
    <article className={styles.container}>
      <p>{total}</p>
      <p>suma</p>
    </article>
  );
}