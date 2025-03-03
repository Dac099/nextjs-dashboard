'use client';
import styles from './login.module.css';
import { useState } from 'react';
import { loginAction } from '@/actions/auth';

export function Login()
{
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [onError, setOnError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData): Promise<void>
  {
    const result = await loginAction(formData);
    
    if (result?.error) {
      setOnError(result.error);
    }
  }

  return (
    <form action={handleSubmit} className={styles.formLogin}>
      <section>
        {onError &&
          <p className={styles.errorTitle}>{onError}</p>
        }

        <label htmlFor="username">Nombre de usuario</label>
        <input 
          type="text" 
          name="username" 
          id="username" 
          placeholder='Nombre de usuario'
          onChange={(e) => {
            setUsername(e.target.value);
            setOnError(null);
          }}
        />
      </section>

      <section>
        <label htmlFor="password">Contraseña</label>
        <input 
          type="password" 
          name="password" 
          id="password" 
          onChange={e => {
            setPassword(e.target.value);
            setOnError(null);
          }}
        />
      </section>

      <button type="submit">Iniciar</button>
    </form>
  );
}