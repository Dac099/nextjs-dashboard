'use client';
import styles from './rowName.module.css';
import type { ItemData } from '@/utils/types/views';
import { useState, useRef } from 'react';
import { ProgressDial } from '@/components/common/progressDial/progressDial';
import { useRouter } from 'next/navigation';
import { ContextMenu } from 'primereact/contextmenu';

type Props = {
  itemData: ItemData;
};

export function RowName({ itemData }: Props) {
  const router = useRouter();
  const menuRef = useRef<ContextMenu>(null);
  const [showSubItems, setShowSubItems] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [itemName, setItemName] = useState(itemData.name);
  const contextMenuItem = [
    { label: 'Editar', icon: 'pi pi-pencil', command: () => setEditMode(true) },
    {
      label: 'Eliminar', icon: 'pi pi-trash', command: () => {
        // Set operation to deleteItem
      }
    }
  ];

  const handleShowSubItems = () => {
    setShowSubItems(!showSubItems);
  };

  const handleShowItemDetail = () => {
    router.push(`?itemId=${itemData.id}`)
  };

  return (
    <section
      className={styles.container}
      onContextMenu={e => {
        menuRef.current?.show(e);
      }}
    >
      <i
        className={`${styles.icon} pi pi-angle-${showSubItems ? 'down' : 'right'}`}
        onClick={handleShowSubItems}
        title='Mostrar/Ocultar subitems'
      ></i>

      {editMode
        ?
        <input
          className={styles.editInput}
          type='text'
          value={itemName}
          placeholder={itemName}
          onChange={e => setItemName(e.target.value)}
          onBlur={() => setEditMode(false)}
          autoFocus
        />
        :
        <p
          className={styles.itemName}
          title={itemData.name}
        >
          {itemData.name}
        </p>
      }

      <article className={styles.chatData}>
        <ProgressDial total={10} completed={5} />
        <i
          className={`${styles.chatIcon} pi pi-comments`}
          onClick={handleShowItemDetail}
        ></i>
      </article>

      <ContextMenu ref={menuRef} model={contextMenuItem} />
    </section>
  );
}
