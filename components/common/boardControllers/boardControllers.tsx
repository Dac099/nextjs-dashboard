'use client';
import styles from './boardControllers.module.css';
import { useState } from 'react';
import { CiViewTable } from "react-icons/ci";
import { Columns } from '@/utils/types/groups';
import { useParams } from 'next/navigation';
import { GroupTemplate } from '../groupTemplate/groupTemplate';
import { FaFileExport } from "react-icons/fa";

type Props = {
  boardId: string;
  columns: Columns;
  groupsCount: number;
};

export function BoardControllers({ boardId, columns, groupsCount }: Props) {
  const { viewId } = useParams() as { viewId: string };
  const [showGroupTemplate, setShowGroupTemplate] = useState<boolean>(false);
  const columnsArray = Array.from(columns.values());

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
          <span className={styles.btnIcon}>
            <CiViewTable size={20} />
          </span>
          <p>Agregar grupo</p>
        </button>

        <a
          href={`/board/${boardId}/view/${viewId}/api`}
          className={styles.actionBtn}
        >
          <span className={styles.btnIcon}>
            <FaFileExport size={15} />
          </span>
          <p>Exportar tablero</p>
        </a>
      </section>

      {showGroupTemplate &&
        <GroupTemplate
          boardId={boardId}
          columns={columnsArray}
          onClose={handleShowGroupTemplate}
          viewId={viewId}
        />
      }

      {!showGroupTemplate && groupsCount === 0 &&
        <p className={styles.emptyGroupsTitle}>Intenta Agregando un nuevo grupo</p>
      }
    </article>
  );
}
