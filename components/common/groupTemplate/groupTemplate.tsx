'use client';
import styles from './groupTemplate.module.css';
import { useState, useRef, RefObject, MouseEvent } from 'react';
import { addGroup } from '@/actions/groups';
import { HexColorPicker } from 'react-colorful';
import useClickOutside from '@/hooks/useClickOutside';
import { GroupHeaderColumn } from '../groupHeaderColumn/groupHeaderColumn';
import { faker } from '@faker-js/faker';
import { Column } from '@/utils/types/groups';

type Props = {
  boardId: string;
  columns: Column[];
  onClose: () => void;
  viewId: string;
};

export function GroupTemplate({ boardId, columns, onClose, viewId }: Props) {
  const colorContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const groupTitleRef: RefObject<HTMLInputElement | null> = useRef(null);
  const groupContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const [showColorInput, setShowColorInput] = useState<boolean>(false);
  const [colorGroup, setColorGroup] = useState<string>(faker.color.rgb());

  function handleShowColorInput(e: MouseEvent<HTMLButtonElement>) {
    const element = e.target as HTMLButtonElement;
    if (element.classList.contains(styles.colorBtn)) {
      setShowColorInput(!showColorInput);
    }
  }

  async function handleSubmitGroup() {
    const groupTitle: string = groupTitleRef.current!.value;

    if (groupTitle.length === 0) {
      groupContainerRef.current!.classList.add(styles.shakeElement);

      setTimeout(() => {
        groupContainerRef.current!.classList.remove(styles.shakeElement);
      }, 1000);

      return;
    }

    await addGroup(boardId, groupTitle, viewId, colorGroup);
    onClose();
  }

  useClickOutside(colorContainerRef as RefObject<HTMLDivElement>, () => {
    setShowColorInput(false);
  });

  return (
    <article
      className={styles.groupTemplate}
      ref={groupContainerRef}
    >
      <section className={styles.groupInputSection}>
        <input
          type="text"
          autoFocus={true}
          placeholder='Nombre del grupo'
          ref={groupTitleRef}
          className={styles.groupInput}
          style={{
            color: colorGroup,
            borderColor: colorGroup
          }}
        />

        <button
          type='button'
          onClick={(e) => handleShowColorInput(e)}
          className={styles.colorBtn}
        >
          Color
          <div className={styles.colorPicker} ref={colorContainerRef}>
            {showColorInput &&
              <HexColorPicker color={colorGroup} onChange={setColorGroup} />
            }
          </div>
        </button>

        <button
          type="button"
          className={styles.submitBtn}
          onClick={() => handleSubmitGroup()}
        >
          Agregar
        </button>
      </section>

      <section
        className={styles.groupTemplateHeader}
        style={{ borderLeftColor: colorGroup }}
      >
        <div>
          <p>Proyecto</p>
        </div>
        {columns.map(column => (
          <GroupHeaderColumn
            key={column.id}
            column={column}
          />
        ))}
      </section>
    </article>
  );
}
