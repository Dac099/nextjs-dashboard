'use client';

import styles from './numberColumn.module.css';
import { useState } from "react";
import type { ColumnData, GroupData, ItemData, ItemValue, SubItemData } from '@/utils/types/views';
import { updateNumberColumn } from './actions';
import { useBoardDataStore } from '@/stores/boardDataStore';

type Props = {
    value: ItemValue | undefined;
    item: ItemData | SubItemData;
    column: ColumnData;
    isSubItem?: boolean;
};

export const NumberColumn = ({ value, item, column, isSubItem }: Props) => {
    const { setGroups, groups } = useBoardDataStore(state => state);
    const parsedValue = (value !== undefined) ? Math.round(parseFloat(JSON.parse(value.value))) : undefined;
    const [inputValue, setInputValue] = useState<number>(parsedValue || 0);

    const handleSubmitValue = async (e: React.KeyboardEvent | React.FocusEvent) => {
        if (e.type === 'blur' || (e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter')) {
            if (!isNaN(inputValue)) {
                try {
                    const newItemValue: Partial<ItemValue> = {
                        ...value,
                        value: inputValue.toString(),
                    };

                    const itemToShow = await updateNumberColumn(item, column, newItemValue, value?.value);

                    //Find the value in the itemData.values array and update it if not exists then push it
                    const existingValueIndex = item.values.findIndex(v => v.id === itemToShow.id);
                    if (existingValueIndex !== -1) {
                        item.values[existingValueIndex] = itemToShow;
                    } else {
                        item.values.push(itemToShow);
                    }

                    if (isSubItem) return;

                    // Update the store with the new item values
                    const newGroupsBoard: GroupData[] = groups.map(group => {
                        return {
                            ...group,
                            items: group.items.map(itemInGroup => {
                                if (itemInGroup.id === item.id) {
                                    return item as ItemData;
                                }
                                return itemInGroup;
                            })
                        }
                    }
                    )
                    setGroups(newGroupsBoard);
                } catch (error) {
                    console.error('Error updating number column:', error);
                }
            }
        }
    };

    return (
        <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value))}
            className={styles.input}
            onBlur={handleSubmitValue}
            onKeyDown={handleSubmitValue}
            min={0}
        />
    );
}
