// GroupContainerWrapper.tsx
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
        data: { // <-- Añadido el tipo 'group'
            type: 'group',
            groupData: groupData,
        },
    });

    const {
        setNodeRef: setDroppableNodeRef,
        isOver,
    } = useDroppable({
        id: id,
        data: { // <-- Añadido el tipo 'group' para que los elementos droppable de grupo se identifiquen
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
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
        opacity: isThisGroupActive ? 0 : 1, // Opacidad para el grupo original
    };

    return (
        <div
            ref={combinedRef}
            style={style}
            {...sortableListeners}
            {...sortableAttributes}
        >
            <GroupContainer
                groupData={groupData}
                boardColumns={boardColumns}
                activeDndId={activeDndId}
            />
        </div>
    );
}