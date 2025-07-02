'use client';
import styles from './sortableColumnHeader.module.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UniqueIdentifier } from '@dnd-kit/core';
import type { ColumnData } from '@/utils/types/views';
import React from 'react';

type Props = {
    columnData: ColumnData;
    id: UniqueIdentifier;
    isThisColumnActive: boolean;
};

export function SortableColumnHeader({ columnData, id, isThisColumnActive }: Props) {
    const {
        listeners,
        attributes,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: id,
        data: { type: 'column', columnData } // Asegurarse de que el tipo esté aquí
    });

    const getColumnSizebyType = (type: string) : string => {
        switch(type){
            case 'number':
            case 'percentage':
            case 'date':
            case 'text': return '120px';
            case 'status': return '160px';
            case 'timeline': return '380px';
            default: return '120px';
        }
    }

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        // Opacidad 0 para el original si es el que se está arrastrando
        opacity: isThisColumnActive ? 0.5 : 1, // CORREGIDO
        cursor: isThisColumnActive ? 'grabbing' : 'default', // Indicar que es arrastrable
        resize: 'horizontal',
        overflow: 'auto',
        width: getColumnSizebyType(columnData.type),
    };

    return (
        <th
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={styles.cell}
        >
            {columnData.name}
        </th>
    );
}