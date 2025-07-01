"use client";

import styles from "./styles.module.css";
import { useBoardStore } from "@/stores/boardStore";
import { ColumnData, ItemData, ItemValue } from '@/utils/types/views';
import { useState, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { TabMenu } from 'primereact/tabmenu';
import { StatusValue } from '@/utils/types/groups';
import { setStatusValue, addNewStatusValue, deleteStatusValue } from './actions';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ColorPicker } from 'primereact/colorpicker';
import { ContextMenu } from 'primereact/contextmenu';

type Props = {
  value: ItemValue | undefined;
  item: ItemData;
  column: ColumnData;
};

type Tag = {
  color: string;
  text: string;
};

export function Status({ value, item, column }: Props) {
  const defaultValue = value?.value === undefined 
    ? {color: 'rgba(0,0,0,0.2)', text: 'Sin valor'} as Tag
    : JSON.parse(value.value) as Tag;

  const overlayPanelRef = useRef<OverlayPanel>(null);
  const conexteMenuRef = useRef<ContextMenu>(null);
  const boardStatus = useBoardStore((state) => state.boardStatus);
  const addBoardStatus = useBoardStore((state) => state.addStatus);
  const deleteBoardStatus = useBoardStore(state => state.removeStatus);
  const [ tagLabel, setTagLabel ] = useState<Tag>(defaultValue);
  const [ menuLabelSelected, setMenuLabelSelected ] = useState<string>('Tags');
  const [ newValue, setNewValue ] = useState<{ color: string; text: string } | null>(null);
  const [ valueToDelete, setValueToDelete ] = useState<StatusValue | null>(null);

  const itemsListMenu = [
    {label: 'Tags', icon: 'pi pi-list', command: () => setMenuLabelSelected('Tags')},
    {label: 'Nuevo', icon: 'pi pi-plus', command: () => setMenuLabelSelected('New')},
  ];

  const handleSelectStatus = async(tag: StatusValue) => {
    overlayPanelRef.current?.hide();
    await setStatusValue(tag, item, column);
    const parsedValue = JSON.parse(tag.value) as Tag;
    setTagLabel(parsedValue);    
  };

  const handleAddStatus = async() => {
    if(!newValue || !newValue.text || !newValue.color) return;
    const newStatusValue = await addNewStatusValue(item, column, newValue);
    addBoardStatus(newStatusValue);
    setMenuLabelSelected('Tags');
    setNewValue(null);
  };

  const handleDeleteValue = async() => {
    deleteBoardStatus(valueToDelete!.id, column.id);
    await deleteStatusValue(valueToDelete!);
  }; 

  return (
    <>
      <article
        className={styles.container}
        style={{ backgroundColor: tagLabel.color }}
        onClick={e => overlayPanelRef.current?.toggle(e)}
      >
        {tagLabel.text}  
      </article>
      <OverlayPanel
        ref={overlayPanelRef}
        showCloseIcon
        onHide={() => overlayPanelRef.current?.hide()}
      >
        <TabMenu 
          model={itemsListMenu}
        />
        {menuLabelSelected === 'Tags' && 
          <section className={styles.tagContainer}>
            {boardStatus.get(column.id)?.map(value => (
              <div
                key={value.id}
                className={styles.tagItem}
                style={{ backgroundColor: JSON.parse(value.value).color }}
                onClick={() => handleSelectStatus(value)}
                onContextMenu={e => {
                  setValueToDelete(value);
                  conexteMenuRef.current?.show(e);
                }}
              >
                {JSON.parse(value.value).text}
              </div>
            ))}
          </section>
        }

        {menuLabelSelected === 'New' &&
          <section className={styles.newContainer}>
            <InputText 
              placeholder='Nombre del tag'
              style={{ width: '200px', fontSize: '1.2rem', marginBottom: '1rem', display: 'block' }}
              value={newValue?.text || ''}
              onChange={e => setNewValue({ 
                  ...newValue, 
                  text: e.target.value 
                } as { color: string; text: string })
              }
            />
            <ColorPicker 
              inline
              style={{ width: '200px', marginBottom: '1rem', display: 'block' }}
              onChange={e => setNewValue({ 
                  ...newValue, 
                  color: `#${e.value}` 
                } as { color: string; text: string })
              }
            />
            <Button 
              label='Agregar'
              icon='pi pi-plus'
              style={{ width: '200px' }}
              onClick={handleAddStatus}
            />
          </section>
        }
      </OverlayPanel>  
      <ContextMenu 
        ref={conexteMenuRef}
        model={[{
          label: 'Eliminar',
          icon: 'pi pi-trash',
          command: handleDeleteValue
        }]}
      />
    </>
  );
}
