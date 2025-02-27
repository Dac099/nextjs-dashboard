'use client';
import { useState } from 'react';
import styles from './rowTitle.module.css';
import {useRouter} from "next/navigation";
import {updateItemName} from "@/actions/items";

type Props = {
    title: string;
    itemId: string;
};

export function RowTitle({title, itemId}: Props) {
    const router = useRouter();
    const [itemName, setItemName] = useState<string>(title);

    function handleDoubleClick(e){
        e.target.blur();
        router.push(`?itemId=${itemId}`);
    }

    async function submit(){
        if(itemName !== title){
            await updateItemName(itemId, itemName);
        }
    }

    return (
        <input
            className={styles.itemText}
            onDoubleClick={e => handleDoubleClick(e)}
            onClick={e => {
                e.target.select()
            }}
            onBlur={submit}
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
        />
    );
}