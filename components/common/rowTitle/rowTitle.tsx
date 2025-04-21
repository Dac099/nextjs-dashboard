'use client';
import { useState, MouseEvent } from 'react';
import styles from './rowTitle.module.css';
import { useRouter } from "next/navigation";
import { updateItemName, updateSubItemName } from "@/actions/items";
import { useRoleUserActions } from '@/stores/roleUserActions';

type Props = {
    title: string;
    itemId: string;
    isSubItem?: boolean;
};

export function RowTitle({ title, itemId, isSubItem = false }: Props) {
    const userActions = useRoleUserActions(state => state.userActions);
    const router = useRouter();
    const [itemName, setItemName] = useState<string>(title);

    function handleDoubleClick(e: MouseEvent<HTMLInputElement>) {
        if (isSubItem) return;
        const element = e.target as HTMLInputElement;
        element.blur();
        router.push(`?itemId=${itemId}`);
    }

    async function submit() {
        if (itemName === title) return;

        if (itemName !== title) {
            if (isSubItem) {
                await updateSubItemName(itemId, itemName);
                return;
            }

            await updateItemName(itemId, itemName);
        }
    }

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
            onKeyUp={e => {
                const target = e.target as HTMLInputElement;
                if (e.key === 'Enter') {
                    submit();
                    target.blur();
                }
            }}
        />
    );
}
