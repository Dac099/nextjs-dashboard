import { Tooltip } from '@/components/common/tooltip/tooltip';
import styles from './styles.module.css';
import { useState, useRef, RefObject } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

// Añadir tipos explícitos a las propiedades del componente TagListItem
interface TagListItemProps {
    item: {
        text: string;
        color: string;
        id: string;
    };
    setTag: (tag: {
        text: string;
        color: string;
        id: string;
    }) => void;
    openEditor: () => void;
    handleSetValue: (item: any) => void;
}

const TagListItem = ({ item, handleSetValue, setTag, openEditor }: TagListItemProps) => {
    const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerRef as RefObject<HTMLDivElement>, () => {
        setShowContextMenu(false);
    });

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
                    <p>Eliminar</p>
                </article>
            }
        </article>
    );
}

export default TagListItem; 