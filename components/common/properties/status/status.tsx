'use client';

import styles from './styles.module.css'
import {TableValue} from "@/utils/types/groups";
import {
    useState,
    useEffect,
    useRef,
    RefObject,
    MouseEvent
} from "react";
import {
    getBoardStatusList,
    setTableValue,
    deleteStatusColumn,
    addStatusColumn,
} from "@/actions/groups";
import {TbTrashXFilled} from "react-icons/tb";
import {HexColorPicker} from "react-colorful";
import {FaAngleDown} from "react-icons/fa";
import useClickOutside from "@/hooks/useClickOutside";
import {useParams} from "next/navigation";

type Props = {
    value: TableValue;
    itemId: string;
    columnId: string;
};

type Tag = {
    color: string;
    text: string;
    id: string;
}

export function Status({value, itemId, columnId}: Props) {
    let defaultValue: Tag;
    const {id: boardId, viewId} = useParams();
    const containerListRef = useRef<HTMLDivElement | null>(null);
    const [showStatusList, setShowStatusList] = useState<boolean>(false);
    const [statusList, setStatusList] = useState<Tag[]>([]);
    const [showInputTag, setShowInputTag] = useState<boolean>(false);
    const [newInputName, setNewInputName] = useState<string>("");
    const [newInputColor, setNewInputColor] = useState<string>("");

    useEffect(() => {
        getBoardStatusList(columnId)
            .then(result => setStatusList(result));
    }, [columnId]);

    useClickOutside(containerListRef as RefObject<HTMLDivElement>, () => {
        setShowStatusList(false);
        setShowInputTag(false);
    });

    if (value.value) {
        defaultValue = {...JSON.parse(value.value), id: value.id};
    } else {
        defaultValue = {color: 'rgba(0,0,0,0.4)', text: 'Sin confirmar', id: ''}
    }

    function handleShowStatusList(e) {
        if (e.target.classList.contains(styles.container)) {
            setShowStatusList(!showStatusList);
        }
    }

    async function handleAddStatus() {
        if (newInputName.length > 0) {
            const tags = [...statusList];

            const valueId: string = await addStatusColumn(columnId, JSON.stringify({
                color: newInputColor,
                text: newInputName
            }));

            tags.push({
                color: newInputColor,
                text: newInputName,
                id: valueId,
            });

            setStatusList(tags);
            setShowInputTag(false);
        }
    }

    async function handleDeleteTag(indexTag: number) {
        const tags = [...statusList];
        const tagId: string = tags[indexTag].id as string;
        tags.splice(indexTag, 1);
        setStatusList(tags);
        await deleteStatusColumn(tagId);
    }

    async function handleAddValue(e, item:Tag){
        if(!(e.target.classList.contains(styles.icon)))
        {
            setShowStatusList(false);
            await setTableValue(
                boardId as string,
                viewId as string,
                itemId,
                columnId,
                JSON.stringify({
                    color: item.color,
                    text: item.text
                }),
                value.id
            );
        }
    }

    return (
        <article
            className={styles.container}
            style={{backgroundColor: defaultValue.color}}
            onClick={(e) => handleShowStatusList(e)}
        >
            {defaultValue.text}
            <span className={styles.corner}></span>

            {showStatusList &&
                <section
                    className={styles.listPreview}
                    ref={containerListRef}
                >
                    <p
                        className={styles.showInput}
                        onClick={() => setShowInputTag(!showInputTag)}
                    >
                        <FaAngleDown size={10}/>
                    </p>
                    {showInputTag &&
                        <>
                            <section className={styles.newInput}>
                                <input
                                    type="text"
                                    onChange={(e) => setNewInputName(e.target.value)}
                                    placeholder={'Nombre de Tag'}
                                />
                                <button
                                    onClick={handleAddStatus}
                                >
                                    +
                                </button>
                            </section>
                            <HexColorPicker  onChange={setNewInputColor}/>
                        </>
                    }
                    {!showInputTag &&
                        <section className={styles.tagsContainer}>
                            {
                                statusList.map((item, index) => (
                                    <article
                                        className={styles.listItem}
                                        key={`${item.color}-${item.text}`}
                                        style={{backgroundColor: item.color}}
                                        onClick={e => handleAddValue(e, item)}
                                    >
                                        {item.text}
                                        <TbTrashXFilled
                                            className={styles.icon}
                                            size={18}
                                            onClick={() => handleDeleteTag(index)}
                                        />
                                    </article>
                                ))
                            }
                        </section>
                    }
                </section>
            }
        </article>
    );
}