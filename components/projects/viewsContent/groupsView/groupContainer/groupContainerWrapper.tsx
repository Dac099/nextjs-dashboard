import styles from './groupContainer.module.css';
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { GroupContainer } from "./groupContainer";
import { GroupData } from "@/utils/types/views";
import { CSS } from "@dnd-kit/utilities";
import { GroupController } from './groupController';
import { useState } from 'react';
import { renameGroup } from './actions';

type Props = {
    groupData: GroupData;
    id: string;
    isThisGroupActive: boolean;
    activeDndId: string | null;
};

export function GroupContainerWrapper({ groupData, id, isThisGroupActive, activeDndId }: Props) {
    const [groupName, setGroupName] = useState(groupData.name);
    const [showInputName, setShowInputName] = useState(false);

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

    const handleRenameGroup = async (e: React.FocusEvent | React.KeyboardEvent) => {
        if (e.type === 'blur' || e.type === 'KeyboardEvent' && (e as React.KeyboardEvent).key === 'Enter') {
            if (groupName.length < 1 || groupName === groupData.name) {
                setShowInputName(false);
                setGroupName(groupData.name);
                return;
            }

            try {
                setShowInputName(false);
                await renameGroup(groupData.id, groupName, groupData.name);
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <div
            ref={combinedRef}
            style={style}
        >
            <section
                className={styles.groupContainerTitle}
                style={{ color: groupData.color }}
            >
                <section className={styles.groupContainerControls}>
                    <GroupController
                        groupData={groupData}
                        setShowInputName={setShowInputName}
                    />
                    <i
                        className={`pi pi-bars ${styles.iconControl}`}
                        style={{ cursor: 'grab' }}
                        {...sortableListeners}
                        {...sortableAttributes}
                    ></i>
                </section>

                {showInputName
                    ?
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        onKeyDown={handleRenameGroup}
                        onBlur={handleRenameGroup}
                        className={styles.groupNameInput}
                        style={{
                            color: groupData.color
                        }}
                        autoFocus
                    />
                    :
                    <p className={styles.groupContainerText}>{groupName}</p>
                }
            </section>
            <GroupContainer
                groupData={groupData}
                activeDndId={activeDndId}
            />
        </div>
    );

}
