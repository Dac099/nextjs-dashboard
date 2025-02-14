'use client';
import styles from './styles.module.css';
import { useParams } from 'next/navigation';
import { SlOptions } from "react-icons/sl";
import { RiInsertRowTop, RiInsertColumnLeft } from "react-icons/ri";
import { BsCardText } from "react-icons/bs";
import { MdNumbers, MdOutlineViewTimeline, MdDelete } from "react-icons/md";
import { IoPricetagsOutline } from "react-icons/io5";
import { IoIosColorPalette } from "react-icons/io";
import { useState, useRef, RefObject, useEffect } from 'react';
import { BiRename } from "react-icons/bi";
import useClickOutside from '@/hooks/useClickOutside';
import { HexColorPicker } from 'react-colorful';
import { 
  updateGroupColor, 
  updateGroupTitle, 
  createItem,
  deleteGroup,
  createGroupColumn
} from '@/actions/groups';

type Props = {
  title: string;
  color: string;
  groupId: string;
  totalItems: number;
};

export const TitleControl = ({ title, color, groupId, totalItems }: Props) => {
  const params = useParams();
  const pageId = params.page_id as string;
  const viewId = params.view_id as string;
  const refContainer = useRef<HTMLDivElement>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [newColor, setNewColor] = useState<string>(color);
  const [changeTitle, setChangeTitle] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(title);
  const [showProperties, setShowProperties] = useState<boolean>(false);

  useClickOutside(refContainer as RefObject<HTMLDivElement>, onCloseMenu);
  useEffect(() => {
    async function updateData(){
      const updates = [];
      if(!showColorPicker && newColor !== color){
        updates.push(updateGroupColor(groupId, newColor, pageId, viewId));
      }
      if(!changeTitle && newTitle !== title){
        updates.push(updateGroupTitle(groupId, newTitle, pageId, viewId));
      }
      
      await Promise.all(updates);
    }

    updateData()
  }, [showColorPicker, newColor, color, groupId, pageId, viewId, newTitle, title, changeTitle])

  function onCloseMenu() {  
    setShowOptions(false);
    setShowColorPicker(false);
    setChangeTitle(false);
    setShowProperties(false);
  }

  return (
    <section className={styles.container} style={{color: newColor}}>
      {changeTitle
        ? 
          <input 
            type="text" 
            defaultValue={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            autoFocus={true}
            onFocus={(e) => e.target.select()}
            className={styles.inputTitle}
          />
        : 
          <p>{newTitle}</p>
      }
      <SlOptions 
        size={15} 
        cursor={'pointer'} 
        className={styles.btn}
        onClick={() => setShowOptions(!showOptions)}
      />
      {showOptions &&
        <article className={styles.options} ref={refContainer}>
          <div 
            className={styles.option}
            onClick={() => createItem(groupId, pageId, viewId)}
          >
            <RiInsertRowTop size={20}/>
            <p>Nuevo item</p>
          </div>

          {totalItems > 0 &&        
            <div className={styles.option}>
              <RiInsertColumnLeft size={20}/>
              <p onClick={() => setShowProperties(!showProperties)}>Nueva columna</p>
              {showProperties &&
                <section className={styles.properties}>
                  <p
                    onClick={() => createGroupColumn(pageId, viewId, 'Text')}
                  >
                    <BsCardText size={15}/> Tipo texto
                  </p>
                  <p
                    onClick={() => createGroupColumn(pageId, viewId, 'Number')}
                  >
                    <MdNumbers size={15}/> Tipo numérica
                  </p>
                  <p
                    onClick={() => createGroupColumn(pageId, viewId, 'Status')}
                  >
                    <IoPricetagsOutline size={15}/> Tipo estatus
                  </p>
                  <p
                    onClick={() => createGroupColumn(pageId, viewId, 'TimeLine')}
                  >
                    <MdOutlineViewTimeline size={15}/> Tipo timeline
                  </p>
                </section>
              }
            </div>
          }

          <div className={styles.option}>
            <IoIosColorPalette size={20}/>
            <p onClick={() => setShowColorPicker(!showColorPicker)}>Cambiar color</p>
            {showColorPicker &&
              <HexColorPicker
                color={color}
                onChange={color => setNewColor(color)}
              />
            }
          </div>
          
          <div 
            className={styles.option}
            onClick={() => setChangeTitle(true)}
          >
            <BiRename size={20}/>
            <p>Cambiar nombre</p>
          </div>
          
          <div 
            className={styles.option}
            onClick={() => deleteGroup(groupId, pageId, viewId)}
          >
            <MdDelete size={20}/>
            <p>Eliminar Grupo</p>
          </div>

        </article>
      }
    </section>
  );
}