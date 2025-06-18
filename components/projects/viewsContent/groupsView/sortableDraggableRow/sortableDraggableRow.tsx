// components/SortableDraggableRow/SortableDraggableRow.tsx
'use client';
import styles from './sortableDraggableRow.module.css'; 
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UniqueIdentifier } from '@dnd-kit/core';
import type { ColumnData, ItemData as RowData } from '@/utils/types/views'; 

type Props = {
  itemData: RowData;
  id: UniqueIdentifier;
  boardColumns: ColumnData[]; 
  isThisRowActive: boolean; 
  parentGroupId: UniqueIdentifier; 
};

export function SortableDraggableRow({ itemData, id, boardColumns, isThisRowActive, parentGroupId }: Props) {
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

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <td className={styles.cell}>{itemData.name}</td>

      {boardColumns.map((column) => {
        return (
          <td key={column.id} className={styles.cell}>
            {column.name}
          </td>
        );
      })}
    </tr>
  );
}