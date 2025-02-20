'use client';
import styles from './groupTitle.module.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import type { Group } from '@/utils/types/groups';
import { useState, useRef, RefObject, useEffect } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import { LuTags as TagIcon} from "react-icons/lu";
import { FaTimeline as TimeLineIcon} from "react-icons/fa6";
import { LuText as TextIcon} from "react-icons/lu";
import { IoCalendarNumberSharp as DateIcon} from "react-icons/io5";
import { GoNumber as NumberIcon} from "react-icons/go";
import { IoPerson as PersonIcon} from "react-icons/io5";
import { useParams } from 'next/navigation';
import { addBoardColumn } from '@/actions/groups';

type Props = {
  group: Group;
};

export function GroupTitle({ group }: Props)
{
  const {id: boardId, viewId} = useParams();
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

  async function handleInsertColumn(columnType: string): Promise<void>
  {
    setShowMenu(false);
    setShowSubMenu(false);
    await addBoardColumn(boardId as string, viewId as string, columnType);
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
            <ul className={styles.subMenu}>
              <li
                onClick={() => handleInsertColumn('status')}
              >
                <TagIcon size={15}/>
                Estatus
              </li>
              
              <li
                onClick={() => handleInsertColumn('timeline')}
              >
                <TimeLineIcon size={15}/>
                Línea de tiempo
              </li>
              
              <li
                onClick={() => handleInsertColumn('text')}
              >
                <TextIcon size={15}/>
                Texto
              </li>
              
              <li
                onClick={() => handleInsertColumn('number')}
              >
                <NumberIcon size={15}/>
                Número
              </li>
              
              <li
                onClick={() => handleInsertColumn('date')}
              >
                <DateIcon size={15}/>
                Fecha
              </li>
              
              <li
                onClick={() => handleInsertColumn('person')}
              >
                <PersonIcon />
                Persona
              </li>
            </ul>
          }
          <li>Nuevo Item</li>
          <li>Cambiar color</li>
          <li>Eliminar</li>
        </ul>
      }
    </section>
  );
}