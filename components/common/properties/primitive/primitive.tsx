'use client';

import styles from './styles.module.css';
import { TableValue } from "@/utils/types/groups";
import { useState, KeyboardEvent, useRef } from "react";
import { useParams } from "next/navigation";
import { setTableValue } from "@/actions/groups";
import { useRoleUserActions } from '@/stores/roleUserActions';
import { useItemStore } from '@/stores/useItemStore';
import { findParentKeyBySubItemId } from '@/utils/helpers';

type Props = {
    value: TableValue;
    type: string;
    itemId: string;
    columnId: string;
};

export const Primitive = ({ value, type, itemId, columnId }: Props) => {
    const userActions = useRoleUserActions(state => state.userActions);
    const { id: boardId, viewId } = useParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const defaultValue: string | number = value.value
        ? JSON.parse(value.value)
        : (type === 'number' ? 0 : '...');
    const [definedValue, setDefinedValue] = useState<string | number>(defaultValue);


    async function handleSubmit(e: KeyboardEvent<HTMLInputElement>) {
        if (e.code === 'Escape') {
            setDefinedValue(defaultValue);
            inputRef.current?.blur();
            return;
        }


        if (e.code === 'Enter') {
            if (definedValue === defaultValue) {
                setDefinedValue(defaultValue);
                return;
            }

            const valueString = JSON.stringify(definedValue);

            const wasCreated = await setTableValue(
                boardId as string,
                viewId as string,
                itemId,
                columnId,
                valueString
            );

            const itemStore = useItemStore.getState();
            const parentKey = findParentKeyBySubItemId(itemStore.subItemsMap, itemId);

            if (parentKey) {
                if (!wasCreated) {
                    itemStore.updateSubItemValue(parentKey, itemId, columnId, valueString);
                    return;
                }

                itemStore.addSubItemValue(parentKey, itemId, {
                    id: value.id,
                    itemId: itemId,
                    groupId: '',
                    value: valueString,
                    columnId: columnId
                })
            }

            inputRef.current?.blur();
            return;
        }
    }

    return (
        <input
            className={styles.inputValue}
            type={type}
            value={definedValue}
            onFocus={e => e.target.select()}
            ref={inputRef}
            onChange={e => setDefinedValue(e.target.value)}
            onKeyUp={e => handleSubmit(e)}
            disabled={!userActions.includes('update')}
        />
    );
}
