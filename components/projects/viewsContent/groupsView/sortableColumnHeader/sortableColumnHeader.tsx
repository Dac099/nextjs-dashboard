'use client';
import styles from './sortableColumnHeader.module.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UniqueIdentifier } from '@dnd-kit/core';
import type { ColumnData } from '@/utils/types/views';
import React, { useRef, useEffect } from 'react';
import { useBoardConfigurationStore } from '@/stores/boardConfiguration';
import { useParams } from 'next/navigation';
import { updateColumnWidth } from './actions';

type Props = {
    columnData: ColumnData;
    id: UniqueIdentifier;
    isThisColumnActive: boolean;
};

export function SortableColumnHeader({ columnData, id, isThisColumnActive }: Props) {
    const params = useParams();
    const boardId = params.id as string;
    const columnRef = useRef<HTMLTableCellElement>(null);

    const { columnsWidth, setColumnWidth } = useBoardConfigurationStore();

    const {
        listeners,
        attributes,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: id,
        data: { type: 'column', columnData }
    });

    const getColumnSizeByType = (type: string): string => {
        // Si hay un ancho guardado para esta columna, úsalo
        const columnWidth = columnsWidth[columnData.id]
            ? columnsWidth[columnData.id]
            : columnData.columnWidth;

        if (columnWidth && columnWidth > 0) {
            return `${columnWidth}px`;
        }

        // Si no, usa el ancho predeterminado según el tipo
        switch (type) {
            case 'number':
            case 'percentage':
            case 'date':
            case 'text': return '120px';
            case 'status': return '160px';
            case 'timeline': return '380px';
            default: return '120px';
        }
    }

    // Detectar cambios en el ancho de la columna
    useEffect(() => {
        if (!columnRef.current) return;

        // Bandera para controlar si estamos desmontando el componente
        let isUnmounting = false;

        const resizeObserver = new ResizeObserver((entries) => {
            // No actualizar si estamos desmontando el componente
            if (isUnmounting) return;
            
            for (const entry of entries) {
                const newWidth = entry.contentRect.width;
                // Solo guardar cuando el cambio sea significativo y mayor que cero
                // Esto evita actualizaciones constantes y valores de cero al desmontar
                if (newWidth > 0 && Math.abs(newWidth - (columnsWidth[columnData.id] || 0)) > 5) {
                    setColumnWidth(id as string, Math.round(newWidth));
                    updateColumnWidth(columnData.id, Math.round(newWidth))
                        .catch(error => {
                            console.error('No se actualizó el ancho de la columna: ', error);
                        })
                }
            }
        });

        resizeObserver.observe(columnRef.current);

        return () => {
            // Marcar que estamos desmontando para evitar actualizaciones
            isUnmounting = true;
            resizeObserver.disconnect();
        };
    }, [boardId, id, columnsWidth, setColumnWidth, columnData.id]);

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isThisColumnActive ? 0.5 : 1,
        cursor: isThisColumnActive ? 'grabbing' : 'default',
        resize: 'horizontal',
        overflow: 'auto',
        width: getColumnSizeByType(columnData.type),
    };

    return (
        <th
            ref={(element) => {
                // Necesitamos mantener tanto la referencia para DnD como para ResizeObserver
                setNodeRef(element);
                columnRef.current = element;
            }}
            style={style}
            className={styles.cell}
        >
            <i
                {...attributes}
                {...listeners}
                style={{ cursor: isThisColumnActive ? 'grabbing' : 'grab' }}
            >
                {columnData.name}
            </i>
        </th>
    );
}
