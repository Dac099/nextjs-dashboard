'use client';
import styles from './groupHeaderColumn.module.css';
import { useState, useRef, ReactNode, useEffect } from 'react';
import { deleteColumn, updateColumnName } from '@/actions/groups';
import type { Column } from '@/utils/types/groups';
import { LuTags as TagIcon} from "react-icons/lu";
import { FaTimeline as TimeLineIcon} from "react-icons/fa6";
import { LuText as TextIcon} from "react-icons/lu";
import { IoCalendarNumberSharp as DateIcon} from "react-icons/io5";
import { GoNumber as NumberIcon} from "react-icons/go";
import { IoPerson as PersonIcon} from "react-icons/io5";
import { useParams } from 'next/navigation';
import { AiOutlineDeleteColumn } from "react-icons/ai";

type Props = {
  column: Column
};

export function GroupHeaderColumn({ column }: Props)
{
  const {id: boardId, viewId} = useParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [ showInput, setShowInput ] = useState<boolean>(false);
  const [ columnName, setColumnName ] = useState<string>(column.name);

  useEffect(() => {
    setColumnName(column.name);
  }, [column.name]);
  
  useEffect(() => {
    if(showInput)
    {
      inputRef.current!.select();
    }
  }, [showInput])

  function getIconByType(type: string): ReactNode
  {
    return type === 'status' 
      ? <TagIcon /> 
      : type === 'timeline'
      ? <TimeLineIcon />
      : type === 'text'
      ? <TextIcon />
      : type === 'date'
      ? <DateIcon />
      : type === 'number'
      ? <NumberIcon />
      : type === 'person'
      ? <PersonIcon />
      : <></>;
  }

  async function handleUpdateColumn(e: React.KeyboardEvent<HTMLInputElement> | null = null): Promise<void>{
    if(e && e.key === 'Escape')
    {
      setShowInput(false);
      return;
    }

    if(!e || e.key === 'Enter')
    {
      const inputValue: string = inputRef.current!.value;
      setShowInput(false);
      
      if(inputValue !== column.name)
      {
        await updateColumnName(column.id, inputValue, boardId as string, viewId as string);
        setColumnName(column.name);
      }
    }
  }

  async function handleDeleteColumn(columnId: string){
    await deleteColumn(columnId, boardId as string, viewId as string);
  }

  return (
    <div className={styles.item}>
      <AiOutlineDeleteColumn 
        size={20}
        className={styles.deleteColBtn}
        onClick={() => handleDeleteColumn(column.id)}
      />
      {showInput
        ? 
          <input 
            type="text"
            onBlur={() => handleUpdateColumn(null)}
            onKeyUp={(e) => handleUpdateColumn(e)}
            ref={inputRef}
            defaultValue={columnName}
            autoFocus={true}
          />
        :
          <>
            {getIconByType(column.type)}          
            <p
              onClick={() => setShowInput(true)}
            >
              {columnName}
            </p>
          </>
      }
    </div>
  );
}
