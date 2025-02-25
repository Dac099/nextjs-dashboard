'use client';
import styles from './groupTitle.module.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import type { Group } from '@/utils/types/groups';
import { 
  useState, 
  useRef, 
  RefObject, 
  useEffect 
} from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import { LuTags as TagIcon} from "react-icons/lu";
import { FaTimeline as TimeLineIcon} from "react-icons/fa6";
import { LuText as TextIcon} from "react-icons/lu";
import { IoCalendarNumberSharp as DateIcon} from "react-icons/io5";
import { GoNumber as NumberIcon} from "react-icons/go";
import { IoPerson as PersonIcon} from "react-icons/io5";
import { useParams } from 'next/navigation';
import { 
  addBoardColumn, 
  updateGroupTitle, 
  updateGroupColor,
  deleteGroup,
} from '@/actions/groups';
import { HexColorPicker } from 'react-colorful';

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
  const [ groupName, setGroupName ] = useState<string>(group.name);
  const [ showColorInput, setShowColorInput ] = useState<boolean>(false);
  const [ colorGroup, setColorGroup ] = useState<string>(group.color);

  useClickOutside(containerRef as RefObject<HTMLDivElement>, () => {
    setShowMenu(false);
    setShowSubMenu(false);
    setShowColorInput(false);
  });

  function handleChangeTitle(): void
  {
    setUpdateTitle(true);
    setShowMenu(false);
    setShowSubMenu(false);
  }

  async function handleUpdateTitle(e: React.KeyboardEvent<HTMLInputElement>): Promise<void>
  {
    if(e.key === 'Enter')
    {
      const inputValue: string = inputTitleRef.current!.value
      setGroupName(inputValue);
      setUpdateTitle(false);
      await updateGroupTitle(group.id, inputValue);      
    }
  }

  async function handleInsertColumn(columnType: string): Promise<void>
  {
    setShowMenu(false);
    setShowSubMenu(false);
    await addBoardColumn(boardId as string, viewId as string, columnType);
  } 

  async function handleChangeColor(): Promise<void>
  {
    setShowColorInput(false);
    setShowMenu(false);
    setShowSubMenu(false);

    if(group.color === colorGroup) return;
    
    await updateGroupColor(group.id, colorGroup, boardId as string, viewId as string );
  }

  async function handleDeleteGroup(): Promise<void>
  {
    setShowColorInput(false);
    setShowMenu(false);
    setShowSubMenu(false);
    await deleteGroup(group.id, boardId as string, viewId as string);
  }

  function handleShowColorInput(): void
  {
    setShowSubMenu(false);
    setShowColorInput(!showColorInput)
  }

  function handleShowSubMenu(): void
  {
    setShowColorInput(false);
    setShowSubMenu(!showSubMenu);
  }

  useEffect(() => {
    if(updateTitle)
    {
      inputTitleRef.current!.focus();
      inputTitleRef.current!.select();
    }
  }, [updateTitle]);

  useEffect(() => {
    setColorGroup(group.color);
  }, [group.color]);

  return (
    <section 
      className={styles.control}
      ref={containerRef}
    >
      <BsThreeDotsVertical 
        size={20}
        onClick={() => setShowMenu(!showMenu)}
        style={{ color: colorGroup }}
      />
      {updateTitle
        ? <input 
            type="text" 
            ref={inputTitleRef}
            defaultValue={groupName}
            onBlur={() => setUpdateTitle(false)}
            className={styles.inputTitle}
            style={{ color: colorGroup }}
            onKeyUp={(e) => handleUpdateTitle(e)}
          />
        : <p style={{ color: colorGroup }}>
            {groupName}
          </p>
      }
      {showMenu &&
        <ul className={styles.groupMenu}>
          <li onClick={() => handleChangeTitle()}>Renombrar</li>
          <li onClick={handleShowSubMenu}>Nueva Columna</li>          
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
              
              {/*<li*/}
              {/*  onClick={() => handleInsertColumn('person')}*/}
              {/*>*/}
              {/*  <PersonIcon />*/}
              {/*  Persona*/}
              {/*</li>*/}
            </ul>
          }
          <li onClick={handleShowColorInput}>Cambiar color</li>
            {showColorInput &&
              <div>
                <HexColorPicker 
                  color={group.color}
                  onChange={setColorGroup}
                />
                <button 
                  type="button"
                  className={styles.changeColorButton}
                  onClick={() => handleChangeColor()}
                >
                  Cambiar
                </button>
              </div>
            }
          <li onClick={handleDeleteGroup}>Eliminar</li>
        </ul>
      }
    </section>
  );
}