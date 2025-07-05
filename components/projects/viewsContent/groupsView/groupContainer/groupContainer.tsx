'use client';
import css from './groupContainer.module.css';
import { GroupData, ItemData as RowData } from '@/utils/types/views';
import { SortableColumnHeader } from '../sortableColumnHeader/sortableColumnHeader';
import { SortableDraggableRow } from '../sortableDraggableRow/sortableDraggableRow';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addEmptyItem } from './actions';
import { Toast } from 'primereact/toast';
import { useBoardDataStore } from '@/stores/boardDataStore';
import {
    SortableContext,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CustomError } from '@/utils/customError';

type Props = {
    groupData: GroupData;
    activeDndId: string | null;
};

export function GroupContainer({ groupData, activeDndId }: Props) {
    const {
        columns: boardColumns,
        addItemToGroup
    } = useBoardDataStore(state => state);
    const panelRef = useRef<OverlayPanel>(null);
    const toastRef = useRef<Toast>(null);
    const columnIds = boardColumns.map(col => col.id);
    const rowIds = groupData.items.map(item => item.id);
    const router = useRouter();
    const [showInputItem, setShowInputItem] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    // useClickOutside();

    //Function to handle showing the project form for proyect items
    const handleShowProjectForm = () => {
        router.push(`?newProject=true&groupId=${groupData.id}`);
        panelRef.current?.hide();
    };

    const handleShowInputItem = () => {
        setShowInputItem(true);
        panelRef.current?.hide();
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            try {
                const newItemRecord = await addEmptyItem(groupData.id, newItemName);
                setNewItemName('');
                addItemToGroup(groupData.id, newItemRecord);
            } catch (error) {
                toastRef.current?.show({
                    severity: 'error',
                    summary: (error as CustomError).message,
                    detail: (error as CustomError).details,
                })
            }
        }

        if (e.key === 'Escape') {
            setShowInputItem(false);
        }
    };

    return (
        <>
            <table
                className={css.groupContainer}
                style={{
                    borderLeft: `5px solid ${groupData.color}`,
                }}
            >
                <thead>
                    <tr>
                        <th
                            className={`${css.cell} ${css.cellHeader}`}
                            draggable={false}
                            style={{ width: '800px' }}
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
                            {showInputItem
                                ?
                                <input
                                    type="text"
                                    placeholder='Nombre del item'
                                    className={css.addItemInput}
                                    autoFocus
                                    onBlur={() => setShowInputItem(false)}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    value={newItemName}
                                />
                                :
                                <p>
                                    <i className={`pi pi-plus`} /> Nuevo item
                                </p>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
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
            <Toast ref={toastRef} />
        </>
    );
}
