import { Tooltip } from '@/components/common/tooltip/tooltip';
import styles from './styles.module.css';
import { useState, useRef, RefObject } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import { useBoardStore } from '@/stores/boardStore';
import { deleteTagStatus } from '@/actions/items';

// Añadir tipos explícitos a las propiedades del componente TagListItem
type TagItem = {
    text: string;
    color: string;
    id: string;
};
interface TagListItemProps {
    item: TagItem;
    setTag: (tag: {
        text: string;
        color: string;
        id: string;
    }) => void;
    openEditor: () => void;
    handleSetValue: (item: TagItem) => void;
    columnId: string;
}

const TagListItem = ({ item, handleSetValue, setTag, openEditor, columnId }: TagListItemProps) => {
    const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const removeStatus = useBoardStore(state => state.removeStatus);

    useClickOutside(containerRef as RefObject<HTMLDivElement>, () => {
        setShowContextMenu(false);
    });

    const handleDeleteTag = async (item: TagItem) => {
        removeStatus(item.id, columnId);
        setShowContextMenu(false);
        const itemsAffected = await deleteTagStatus(item.id, JSON.stringify({ color: item.color, text: item.text }), columnId);
        if (itemsAffected > 0) {
            window.location.reload();
        }
    }

    return (
        <article className={styles.tagItemListContainer} ref={containerRef}>
            <Tooltip text={item.text} key={`${item.color}-${item.text}`}>
                <article
                    className={styles.listItem}
                    key={`${item.color}-${item.text}`}
                >
                    <article
                        style={{ backgroundColor: item.color }}
                        onClick={() => handleSetValue(item)}
                        onContextMenu={e => {
                            e.preventDefault();
                            setShowContextMenu(true);
                        }}
                    >
                        <p>{item.text}</p>
                    </article>
                </article>
            </Tooltip>
            {showContextMenu &&
                <article className={styles.contextMenu}>
                    <p
                        onClick={() => {
                            setShowContextMenu(false);
                            setTag(item);
                            openEditor();
                        }}
                    >
                        Editar
                    </p>
                    <p
                        onClick={() => {handleDeleteTag(item)}}
                    >
                        Eliminar
                    </p>
                </article>
            }
        </article>
    );
}

export default TagListItem; 