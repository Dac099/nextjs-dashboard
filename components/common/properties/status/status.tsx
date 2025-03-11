'use client';

import styles from './styles.module.css'
import {TableValue} from "@/utils/types/groups";
import {
    useState,
    useEffect,
    useRef,
    RefObject,
    MouseEvent,
    useMemo,
    useCallback,
} from "react";
import {
    setTableValue,
    addStatusColumn,
    getBoardStatusList
} from "@/actions/groups";
import {HexColorPicker} from "react-colorful";
import {FaAngleDown} from "react-icons/fa";
import useClickOutside from "@/hooks/useClickOutside";
import {useParams} from "next/navigation";
import {Tooltip} from "@/components/common/tooltip/tooltip";
import { Actions } from '@/utils/types/roles';
import { roleAccess } from '@/utils/userAccess';

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
    const defaultValue = useMemo(() => {
        if (value.value) {
            return {...JSON.parse(value.value), id: value.id};
        }
        return {color: 'rgba(0,0,0,0.4)', text: 'Sin confirmar', id: ''};
    }, [value]);
    const {id: boardId, viewId} = useParams();
    const containerListRef = useRef<HTMLDivElement | null>(null);
    const [showStatusList, setShowStatusList] = useState<boolean>(false);
    const [statusList, setStatusList] = useState<Tag[]>([]);
    const [showInputTag, setShowInputTag] = useState<boolean>(false);
    const [newInputName, setNewInputName] = useState<string>("");
    const [newInputColor, setNewInputColor] = useState<string>("");
    const [userActions, setUserActions] = useState<Actions[]>([]);

    useEffect(() => {
        async function fetchData()
        {
            const actions = await roleAccess(boardId as string);
            setUserActions(actions);
        }

        fetchData();
    }, [boardId]);

    useEffect(() => {
        if(showStatusList && !showInputTag){
            fetchData();            
        } 

        async function fetchData(){
            const resStatus = await getBoardStatusList(columnId);
            setStatusList(resStatus);
        }
    }, [columnId, showStatusList, showInputTag]);

    useClickOutside(containerListRef as RefObject<HTMLDivElement>, () => {
        setShowStatusList(false);
        setShowInputTag(false);
    });

    const handleShowStatusList = useCallback((e: MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains(styles.container)) {
            setShowStatusList(!showStatusList);
        }
    }, [showStatusList])

    const handleAddStatus= useCallback(async () => {
        if (newInputName.length > 0) {
            const tags = [...statusList];

            const valueId: string = await addStatusColumn(columnId, JSON.stringify({
                color: newInputColor,
                text: newInputName
            }),
            boardId as string, 
            viewId as string
            );

            tags.push({
                color: newInputColor,
                text: newInputName,
                id: valueId,
            });

            setStatusList(tags);
            setShowInputTag(false);
        }
    }, [boardId, columnId, newInputColor, newInputName, statusList, viewId]);

    const handleAddValue = useCallback(async (item:Tag) => {
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
    }, [boardId, columnId, itemId, value.id, viewId]);

    return (
        <article
            className={styles.container}
            style={{backgroundColor: defaultValue.color}}
            onClick={handleShowStatusList}
        >
            {defaultValue.text}
            <span className={styles.corner}></span>

            {showStatusList && (
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
                    
                    {showInputTag && (
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
                            <section className={styles.colorPicker}>
                                <HexColorPicker onChange={setNewInputColor}/>
                            </section>
                        </>
                    )}
                    
                    {!showInputTag && (
                        <section className={styles.tagsContainer}>
                            {statusList.map((item) => (
                                <Tooltip text={item.text} key={`${item.color}-${item.text}`}>
                                    <article
                                        className={styles.listItem}
                                        key={`${item.color}-${item.text}`}
                                    >
                                        <article
                                            style={{backgroundColor: item.color}}
                                            onClick={() => handleAddValue(item)}
                                        >
                                            <p>{item.text}</p>
                                        </article>
                                    </article>
                                </Tooltip>
                            ))}
                        </section>
                    )}
                </section>
            )}
        </article>
    );
}