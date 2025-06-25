import styles from './groupContainer.module.css';
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { GroupContainer } from "./groupContainer";
import { ColumnData, GroupData } from "@/utils/types/views";
import { CSS } from "@dnd-kit/utilities";

type Props = {
    groupData: GroupData;
    boardColumns: ColumnData[];
    id: string;
    isThisGroupActive: boolean;
    activeDndId: string | null;
};

export function GroupContainerWrapper({ groupData, boardColumns, id, isThisGroupActive, activeDndId }: Props) {
    const {
        attributes: sortableAttributes,
        listeners: sortableListeners,
        setNodeRef: setSortableNodeRef,
        transform,
        transition,
    } = useSortable({
        id: id,
        data: { 
            type: 'group',
            groupData: groupData,
        },
    });

    const {
        setNodeRef: setDroppableNodeRef,
        isOver,
    } = useDroppable({
        id: id,
        data: { 
            type: 'group',
            groupData: groupData,
        },
    });


    const combinedRef = (node: HTMLElement | null) => {
        setSortableNodeRef(node);
        setDroppableNodeRef(node);
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
        opacity: isThisGroupActive ? 0 : 1, // Opacidad para el grupo original
    };

    return (
        <div
            ref={combinedRef}
            style={style}
            {...sortableListeners}
            {...sortableAttributes}
        >
            <section 
                className={styles.groupContainerTitle}
                style={{ color: groupData.color}}
            >
                <section className={styles.groupContainerControls}>
                    <i 
                        className={`pi pi-ellipsis-v ${styles.iconControl}`}
                        style={{ cursor: 'pointer' }}
                    ></i>
                    <i 
                        className={`pi pi-bars ${styles.iconControl}`}
                        style={{ cursor: 'grab' }}
                    ></i>
                </section>
                <p className={styles.groupContainerText}>{groupData.name}</p>
            </section>
            <GroupContainer
                groupData={groupData}
                boardColumns={boardColumns}
                activeDndId={activeDndId}
            />
        </div>
    );
}