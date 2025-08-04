'use client';
import styles from './rowName.module.css';
import type { ItemData, SubItemData } from '@/utils/types/views';
import React, { useState, useRef } from 'react';
import { ProgressDial } from '@/components/common/progressDial/progressDial';
import { useRouter } from 'next/navigation';
import { ContextMenu } from 'primereact/contextmenu';
import { updateItemName, deleteItem, getSubItems } from './actions';
import { useBoardDataStore } from '@/stores/boardDataStore';
import { LuListMinus as SubItemIcon } from "react-icons/lu";
import { useSearchParams } from 'next/navigation';

type Props = {
  itemData: ItemData | SubItemData;
  setShowSubItems?: React.Dispatch<React.SetStateAction<boolean>>;
  showSubItems?: boolean;
  subItems?: SubItemData[];
  setSubItems?: React.Dispatch<React.SetStateAction<SubItemData[]>>;
  isSubItem: boolean;
};

export function RowName({ itemData, setShowSubItems, showSubItems, setSubItems, subItems, isSubItem = false }: Props) {
  const router = useRouter();
  const menuRef = useRef<ContextMenu>(null);
  const [editMode, setEditMode] = useState(false);
  const [itemName, setItemName] = useState(itemData.name);
  const { groups, setGroups } = useBoardDataStore();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query');

    const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className={styles.highlight}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const contextMenuItem = [
    { label: 'Editar', icon: 'pi pi-pencil', command: () => setEditMode(true) },
    { label: 'Eliminar', icon: 'pi pi-trash', command: () => handleDeleteItem() },
  ];

  const handleShowSubItems = () => {
    setShowSubItems!(!showSubItems);
  };

  const handleShowItemDetail = () => {
    router.push(`?itemId=${itemData.id}`);
  };

  const handleSubmitNewValue = async (e: React.FocusEvent | React.KeyboardEvent) => {
    if (e.type === 'blur' || (e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter')) {
      try {
        if (itemName.length < 1 || itemName === itemData.name) {
          setEditMode(false);
          return;
        }

        await updateItemName(itemData.id, itemName, itemData.name, isSubItem);
        setEditMode(false);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleDeleteItem = async () => {
    setEditMode(false);
    try {
      await deleteItem(itemData.id, isSubItem);

      if (isSubItem) {
        const newSubItems = [...subItems!];
        const subItemIndex = newSubItems.findIndex(subItem => subItem.id === itemData.id);
        newSubItems.splice(subItemIndex, 1);
        setSubItems!(newSubItems);
        return;
      }

      const newGroups = [...groups];
      const groupIndex = newGroups.findIndex(group => group.items.some(item => item.id === itemData.id));
      const itemIndex = newGroups[groupIndex].items.findIndex(item => item.id === itemData.id);
      newGroups[groupIndex].items.splice(itemIndex, 1);
      setGroups(newGroups);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSubItems = async () => {
    if (showSubItems) return;
    try {
      const subItemsRes = await getSubItems(itemData.id);
      setSubItems!(subItemsRes);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section
      className={styles.container}
      onContextMenu={e => {
        menuRef.current?.show(e);
      }}
    >
      {!isSubItem
        ?
        <i
          className={`${styles.icon} pi pi-angle-${showSubItems ? 'down' : 'right'}`}
          onClick={handleShowSubItems}
          title='Mostrar/Ocultar subitems'
          onMouseOver={handleGetSubItems}
        ></i>
        :
        <SubItemIcon
          size={18}
          style={{
            marginLeft: '12px'
          }}
        />
      }

      {editMode
        ?
        <input
          className={styles.editInput}
          type='text'
          value={itemName}
          placeholder={itemName}
          onChange={e => setItemName(e.target.value)}
          onBlur={handleSubmitNewValue}
          onKeyDown={handleSubmitNewValue}
          autoFocus
        />
        :
        <p
          className={styles.itemName}
          title={itemName}
        >
          {getHighlightedText(itemName, queryParam || '')}
        </p>
      }

      {!isSubItem &&
        <article className={styles.chatData}>
          {showSubItems &&
            <p className={styles.infoMsg}>Mostrando SubItems</p>
          }
          <ProgressDial total={10} completed={5} />
          <i
            className={`${styles.chatIcon} pi pi-comments`}
            onClick={handleShowItemDetail}
          ></i>
        </article>
      }

      <ContextMenu ref={menuRef} model={contextMenuItem} />
    </section>
  );
}
