import styles from './page.module.css';
import { Login } from './login';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page()
{
  return (
    <article className={styles.container}>
      <section className={styles.title}>
        <h1>YNE Automatización</h1>
        <p>Monday</p>
      </section>

      <Login />
    </article>
  );
}