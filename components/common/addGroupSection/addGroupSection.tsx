'use client';
import styles from './addGroupSection.module.css';
import { useState, useRef, RefObject } from 'react';
import { addGroup } from '@/actions/groups';
import { CiViewTable } from "react-icons/ci";
import { faker } from '@faker-js/faker';
import { Columns } from '@/utils/types/groups';
import { HexColorPicker } from 'react-colorful';
import useClickOutside from '@/hooks/useClickOutside';
import { useParams } from 'next/navigation';


type Props = {
  boardId: string;
  columns: Columns;
  groupsCount: number;
};

export function AddGroupSection({ boardId, columns, groupsCount }: Props){
  const {viewId} = useParams() as {viewId: string};
  const colorContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const groupTitleRef: RefObject<HTMLInputElement | null> = useRef(null);
  const groupContainerRef: RefObject<HTMLDivElement | null> = useRef(null);

  const [ showGroupTemplate, setShowGroupTemplate ] = useState<boolean>(false);
  const [ showColorInput, setShowColorInput ] = useState<boolean>(false);
  const [ colorGroup, setColorGroup ] = useState<string>(faker.color.rgb());

  const columnsArray = Array.from(columns.values());

  function handleShowColorInput(e){
    if(e.target.classList.contains(styles.colorBtn)){
      setShowColorInput(!showColorInput);
    }
  }

  function handleShowGroupTemplate(){
    setShowGroupTemplate(!showGroupTemplate);
    if(showGroupTemplate)
    {
      setColorGroup(faker.color.rgb());
    }
  }

  async function handleSubmitGroup(){
    const groupTitle: string = groupTitleRef.current!.value;
    
    if(groupTitle.length === 0)
    {
      groupContainerRef.current!.classList.add(styles.shakeElement);
      
      setTimeout(() => {
        groupContainerRef.current!.classList.remove(styles.shakeElement);
      }, 1000);

      return;
    }

    await addGroup(boardId, groupTitle, viewId, colorGroup);
    setShowGroupTemplate(false);
  }

  useClickOutside(colorContainerRef as RefObject<HTMLDivElement>, () => {
    setShowColorInput(false);
  });

  return (
    <article 
      className={styles.container}
    >
      
      <button 
        type='button'
        onClick={handleShowGroupTemplate}
        className={styles.addGroupBtn}
      >
        <span className={styles.btnIcon}>
          <CiViewTable size={20}/>
        </span>
        <p>Agregar grupo</p>
      </button>
      
      { showGroupTemplate &&
        <article 
          className={styles.groupTemplate}
          ref={groupContainerRef}
        >

          <section 
            className={styles.groupInputSection}            
          >
            
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
                { showColorInput &&
                  <HexColorPicker color={colorGroup} onChange={setColorGroup}/>
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
            {
              columnsArray.map(column => (
                <div key={column.id}>
                  <p>{column.name}</p>
                </div>
              ))
            }
          </section>

        </article>
      }

      {!showGroupTemplate && groupsCount === 0 &&
        <p className={styles.emptyGroupsTitle}>Intenta Agregando un nuevo grupo</p>
      }

    </article>
  );
}
