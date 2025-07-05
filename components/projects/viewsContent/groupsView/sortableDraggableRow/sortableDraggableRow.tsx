'use client';
import styles from './sortableDraggableRow.module.css';
import React, { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UniqueIdentifier } from '@dnd-kit/core';
import type { ColumnData, ItemData as RowData, SubItemData } from '@/utils/types/views';
import { RowName } from './values/rowName/rowName';
import { RowValue } from './values/rowValue/rowValue';
import { createSubItem } from './actions';

type Props = {
  itemData: RowData;
  id: UniqueIdentifier;
  boardColumns: ColumnData[];
  isThisRowActive: boolean;
  parentGroupId: UniqueIdentifier;
};

export function SortableDraggableRow({ itemData, id, boardColumns, isThisRowActive, parentGroupId }: Props) {
  const [showSubItems, setShowSubItems] = useState(false);
  const [subItems, setSubItems] = useState<SubItemData[]>([]);
  const [showSubItemName, setShowSubItemName] = useState(false);
  const [subItemName, setSubItemName] = useState<string>('');

  useEffect(() => {
    setShowSubItems(false);
  }, [isThisRowActive]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: id,
    data: {
      type: 'row',
      rowData: itemData,
      parentGroupId: parentGroupId,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isThisRowActive ? 0.5 : 1,
    cursor: isThisRowActive ? 'grabbing' : 'default',
    boxShadow: isThisRowActive ? '0px 2px 4px rgba(0,0,0,0.1)' : 'none',
  };

  const handleAddSubItem = async (e: React.FocusEvent | React.KeyboardEvent) => {
    if (subItemName.length < 1) return;

    if (e.type === 'blur' || e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter') {
      try {
        const newSubItem = await createSubItem(subItemName, itemData.id);
        const newSubItems = [...subItems, newSubItem];
        setSubItems(newSubItems);
        setSubItemName('');
      } catch (error) {
        console.log(error);
      }
      setShowSubItemName(false);
    }
  };

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <td className={styles.cell}>
          <RowName
            itemData={itemData}
            showSubItems={showSubItems}
            setShowSubItems={setShowSubItems}
            setSubItems={setSubItems}
            subItems={subItems}
            isSubItem={false}
          />
        </td>

        {boardColumns.map((column) => {
          return (
            <td key={column.id} className={styles.cell}>
              <RowValue column={column} itemData={itemData} isSubItem={false} />
            </td>
          );
        })}
      </tr>
      {showSubItems &&
        <>
          {subItems.map(subItem => (
            <tr
              className={styles.subItemRow}
              key={subItem.id}
            >
              <td className={styles.cell}>
                <RowName
                  itemData={subItem}
                  isSubItem={true}
                  subItems={subItems}
                  setSubItems={setSubItems}
                />
              </td>

              {boardColumns.map((column) => {
                return (
                  <td key={column.id} className={styles.cell}>
                    <RowValue column={column} itemData={subItem} isSubItem={true} />
                  </td>
                );
              })}
            </tr>
          ))
          }
          <tr>
            <td
              className={styles.addSubItemBtn}
              colSpan={boardColumns.length + 1}
              onClick={() => setShowSubItemName(true)}
            >
              {showSubItemName
                ?
                <input
                  type="text"
                  value={subItemName}
                  onChange={e => setSubItemName(e.target.value)}
                  onBlur={handleAddSubItem}
                  onKeyDown={handleAddSubItem}
                  className={styles.addSubItemInput}
                  autoFocus
                />
                :
                <p><i className='pi pi-plus'></i> Nuevo SubItem</p>
              }
            </td>
          </tr>
        </>
      }
    </>
  );
}
