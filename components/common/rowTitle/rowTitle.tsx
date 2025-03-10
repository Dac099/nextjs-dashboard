'use client';
import { useEffect, useState } from 'react';
import styles from './rowTitle.module.css';
import {useRouter} from "next/navigation";
import {updateItemName} from "@/actions/items";
import { Actions } from '@/utils/types/roles';
import { roleAccess } from '@/utils/userAccess';
import { useParams } from 'next/navigation';

type Props = {
    title: string;
    itemId: string;
};

export function RowTitle({title, itemId}: Props) {
    const {id: boardId} = useParams();
    const router = useRouter();
    const [itemName, setItemName] = useState<string>(title);
    const [userActions, setUserActions] = useState<Actions[]>([]);

    function handleDoubleClick(e){
        e.target.blur();
        router.push(`?itemId=${itemId}`);
    }

    async function submit(){
        if(itemName !== title){
            await updateItemName(itemId, itemName);
        }
    }

    useEffect(() => {
        async function fetchData(){
            const actions = await roleAccess(boardId as string);
            setUserActions(actions);
        }

        fetchData();
    }, [boardId]);

    return (
        <input
            className={styles.itemText}
            onDoubleClick={e => handleDoubleClick(e)}
            onClick={e => {
                const target = e.target as HTMLInputElement;
                target.select()
            }}
            onBlur={submit}
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            disabled={!userActions.includes('update')}
        />
    );
}