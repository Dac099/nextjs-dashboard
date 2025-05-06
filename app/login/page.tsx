import styles from './page.module.css';
import { loginUser } from '@/actions/auth';

type Props = {
  searchParams: Promise<{ badCredentials: string, error: string }>
}

export default async function Page({ searchParams }: Props) {
  const badCredentials = (await searchParams).badCredentials;
  const error = (await searchParams).error;

  return (
    <article className={styles.loginContainer}>
      <h2>SYS Proyectos</h2>

      {badCredentials === 'true' &&
        <p className={styles.msgError}>
          Usuario o contraseña incorrectos
        </p>
      }

      {error && typeof error === 'string' &&
        <section>
          <p className={styles.msgError}>Error al validar credenciales</p>
          <p className={styles.msgDescription}>{error}</p>
        </section>
      }

      <form action={loginUser}>
        <section className={styles.inputField}>
          <label htmlFor="username">Nombre de usuario</label>
          <input type="text" name="username" id="username" required />
        </section>
        <section className={styles.inputField}>
          <label htmlFor="password">Contraseña</label>
          <input type="password" name="password" id="password" required />
        </section>
        <button type="submit" className={styles.submitBtn}>Iniciar</button>
      </form>
    </article>
  );
}
