import styles from './commonLoader.module.css';

export function CommonLoader() {
  return (
    <section className={styles.mainContainer}>
      <div className={styles.loader}></div>
    </section>
  );
}