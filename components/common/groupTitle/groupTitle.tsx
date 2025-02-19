'use client';
import styles from './groupTitle.module.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import type { Group } from '@/utils/types/groups';
import { useState, useRef, RefObject, useEffect } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

type Props = {
  group: Group;
};

export function GroupTitle({ group }: Props)
{
  const containerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const inputTitleRef: RefObject<HTMLInputElement | null> = useRef(null);
  const [ showMenu, setShowMenu ] = useState<boolean>(false);
  const [ showSubMenu, setShowSubMenu ] = useState<boolean>(false);
  const [ updateTitle, setUpdateTitle ] = useState<boolean>(false);

  useClickOutside(containerRef as RefObject<HTMLDivElement>, () => {
    setShowMenu(false);
    setShowSubMenu(false);
  });

  function handleChangeTitle(): void
  {
    setUpdateTitle(true);
    setShowMenu(false);
    setShowSubMenu(false);
  }

  function handleUpdateTitle(e: React.KeyboardEvent<HTMLInputElement>): void
  {
    if(e.key === 'Enter')
    {
      setUpdateTitle(false);
    }
  }

  useEffect(() => {
    if(updateTitle)
    {
      inputTitleRef.current!.focus();
      inputTitleRef.current!.select();
    }
  }, [updateTitle]);

  return (
    <section 
      className={styles.control}
      ref={containerRef}
    >
      <BsThreeDotsVertical 
        size={20}
        onClick={() => setShowMenu(!showMenu)}
        style={{ color: group.color }}
      />
      {updateTitle
        ? <input 
            type="text" 
            ref={inputTitleRef}
            defaultValue={group.name}
            onBlur={() => setUpdateTitle(false)}
            className={styles.inputTitle}
            style={{ color: group.color }}
            onKeyUp={(e) => handleUpdateTitle(e)}
          />
        : <p style={{ color: group.color }}>
            {group.name}
          </p>
      }
      {showMenu &&
        <ul className={styles.groupMenu}>
          <li onClick={() => handleChangeTitle()}>Renombrar</li>
          <li onClick={() => setShowSubMenu(!showSubMenu)}>Nueva Columna</li>
          {showSubMenu &&
            <ul>
              <li>Estatus</li>
              <li>Línea de tiempo</li>
              <li>Texto</li>
              <li>Número</li>
              <li>Fecha</li>
              <li>Persona</li>
            </ul>
          }
          <li>Nuevo Item</li>
        </ul>
      }
    </section>
  );
}