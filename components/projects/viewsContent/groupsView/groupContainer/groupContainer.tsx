'use client';
import css from './groupContainer.module.css';
import { ColumnData, GroupData, ItemData as RowData } from '@/utils/types/views'; 
import {
    SortableContext,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableColumnHeader } from '../sortableColumnHeader/sortableColumnHeader';
import { SortableDraggableRow } from '../sortableDraggableRow/sortableDraggableRow'; 
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
    groupData: GroupData;
    boardColumns: ColumnData[];
    activeDndId: string | null; 
};

export function GroupContainer({ groupData, boardColumns, activeDndId }: Props) {
    const columnIds = boardColumns.map(col => col.id);
    const rowIds = groupData.items.map(item => item.id); 
    const panelRef = useRef<OverlayPanel>(null);
    const router = useRouter();

    //Function to handle showing the project form for proyect items
    const handleShowProjectForm = () => {
        router.push(`?newProject=true&groupId=${groupData.id}`);
        panelRef.current?.hide();
    };

    const handleShowInputItem = async() => {
        
    };

    return (
        <table
            className={css.groupContainer}
            style={{
                borderLeft: `5px solid ${groupData.color}`,
            }}
        >
            <thead>
                <tr>
                    <th
                        className={css.cell}
                        draggable={false}
                    >
                        Item
                    </th>
                    {/* Corrección: items={columnIds} */}
                    <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                        {boardColumns.map((column) => (
                            <SortableColumnHeader
                                key={column.id}
                                columnData={column}
                                id={column.id}
                                isThisColumnActive={activeDndId === column.id}
                            />
                        ))}
                    </SortableContext>
                </tr>
            </thead>
            <tbody>
                {/* SortableContext para las filas (vertical) */}
                <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
                    {groupData.items.map((item: RowData) => (
                        <SortableDraggableRow
                            key={item.id}
                            id={item.id}
                            itemData={item}
                            boardColumns={boardColumns}
                            isThisRowActive={activeDndId === item.id} 
                            parentGroupId={groupData.id} 
                        />
                    ))}
                </SortableContext>
                <tr>
                    <td
                        colSpan={boardColumns.length + 1}
                        className={css.addRowBtn}
                        onClick={(e) => panelRef.current?.toggle(e)}
                    >
                        <p>
                            <i className={`pi pi-plus`} /> Agregar nuevo item
                        </p>
                    </td>
                </tr>
            </tbody>
            <OverlayPanel ref={panelRef}>
                <button 
                    className={css.addItemBtn}
                    onClick={handleShowInputItem}
                >
                    Item simple
                </button>
                <button 
                    className={css.addItemBtn}
                    onClick={handleShowProjectForm}
                >
                    Item de proyecto
                </button>
            </OverlayPanel>
        </table>
    );
}