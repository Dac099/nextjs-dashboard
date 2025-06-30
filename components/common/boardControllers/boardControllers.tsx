'use client';
import styles from './boardControllers.module.css';
import { useState } from 'react';
import { useParams } from 'next/navigation';

type Props = {
  boardId: string;
};

export function BoardControllers({ boardId }: Props) {
  const { viewId } = useParams() as { viewId: string };
  const [showGroupTemplate, setShowGroupTemplate] = useState<boolean>(false);

  function handleShowGroupTemplate() {
    setShowGroupTemplate(!showGroupTemplate);
  }

  return (
    <article className={styles.container}>
      <section className={styles.buttonsContainer}>
        <button
          type='button'
          onClick={handleShowGroupTemplate}
          className={styles.actionBtn}
        >
          <i className={`pi pi-plus ${styles.btnIcon}`}></i>
          <p>Agregar grupo</p>
        </button>

        <a
          href={`/board/${boardId}/view/${viewId}/api`}
          className={styles.actionBtn}
        >
          <i className={`pi pi-file-export ${styles.btnIcon}`}></i>
          <p>Exportar tablero</p>
        </a>
      </section>

      {showGroupTemplate &&
        <p>daswdaw</p>
      }
    </article>
  );
}
