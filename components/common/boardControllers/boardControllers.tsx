'use client';
import styles from './boardControllers.module.css';
import { useState } from 'react';
import { Columns } from '@/utils/types/groups';
import { useParams } from 'next/navigation';
import { GroupTemplate } from '../groupTemplate/groupTemplate';
import { useBoardConfigurationStore } from '@/stores/boardConfiguration';

type Props = {
  boardId: string;
  columns: Columns;
  groupsCount: number;
};

export function BoardControllers({ boardId, columns, groupsCount }: Props) {
  const { viewId } = useParams() as { viewId: string };
  const setExpandedGroups = useBoardConfigurationStore((state) => state.setExpandedGroups);
  const expandedGroups = useBoardConfigurationStore((state) => state.expandedGroups);
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

        <button 
          type="button"
          className={styles.actionBtn}
          onClick={() => setExpandedGroups(!expandedGroups)}
        >
          <i className={`pi pi-expand ${styles.btnIcon}`}></i>
          <p>{expandedGroups ? 'Colapsar grupos' : 'Expandir grupos'}</p>
        </button>
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
