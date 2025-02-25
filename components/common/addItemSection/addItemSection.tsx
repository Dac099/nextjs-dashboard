'use client';

import styles from './addItemSection.module.css';
import {
    useState,
    useRef,
    KeyboardEvent
} from "react";
import {Tooltip} from "@/components/common/tooltip/tooltip";
import {Column} from "@/utils/types/groups";
import { useParams } from 'next/navigation';
import {GroupHeaderColumn} from "@/components/common/groupHeaderColumn/groupHeaderColumn";
import {addItemBoard} from "@/actions/groups";

type Props = {
    columns: Column[];
    groupId: string;
};

export function AddItemSection({ columns, groupId }: Props)
{
    const { id: boardId, viewId } = useParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const [ showItemInput, setShowItemInput ] = useState<boolean>(false);

    async function handleAddItem(e: KeyboardEvent<HTMLInputElement>){
        if(e.code === 'Escape'){
            setShowItemInput(false);
            return;
        }

        if(e.code === 'Enter'){
            const inputValue: string = inputRef.current!.value;
            if(inputValue.length > 0){
                await addItemBoard(groupId, viewId as string, boardId as string, inputValue);
            }
        }
    }

    return (
        <div className={styles.container}>
            {showItemInput
                ?
                <div className={styles.containerRow}>
                    <div>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Nombre del item ..."
                            className={styles.inputTitle}
                            autoFocus={true}
                            onBlur={() => setShowItemInput(false)}
                            onKeyUp={(e) => handleAddItem(e)}
                        />
                    </div>
                    {
                        columns.map(column => (
                            <GroupHeaderColumn key={column.id} column={column} />
                        ))
                    }
                </div>
                :
                <span
                    className={styles.addBtn}
                    onClick={() => setShowItemInput(!showItemInput)}
                >
                    <Tooltip text={'Agregar un nuevo item'}>
                        +
                    </Tooltip>
                </span>
            }
        </div>
    );
}
