'use client';

import { Calendar, CalendarSelectEvent } from 'primereact/calendar';
import { ItemValue, ColumnData, ItemData, GroupData, SubItemData } from '@/utils/types/views';
import { useBoardDataStore } from '@/stores/boardDataStore';
import { Nullable } from 'primereact/ts-helpers';
import { useState } from 'react';
import { updateDefinedDateValue } from './actions';

type Props = {
    value: ItemValue | undefined;
    column: ColumnData;
    item: ItemData | SubItemData;
    isSubItem?: boolean;
};

export const DefinedDate = ({ value, column, item, isSubItem }: Props) => {
    const { groups, setGroups } = useBoardDataStore();
    const [dateValue, setDateValue] = useState<Nullable<Date>>(value ? new Date(value.value.replaceAll('"', '')) : null);

    const handleSubmitDate = async (dateEvent: CalendarSelectEvent) => {
        const parsedDate = (dateEvent.value! as Date).toISOString();
        try {
            const itemResult = await updateDefinedDateValue(item, column, {
                ...value,
                value: parsedDate,
            }, value?.value);

            if (isSubItem) return;

            const itemValueIndex = item.values.findIndex(val => val.id === itemResult.id);

            if (itemValueIndex !== -1) {
                item.values[itemValueIndex] = itemResult;
            } else {
                item.values.push(itemResult);
            }

            //This only execute when is an Item
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
        } catch {
            return false;
        }
    };

    return (
        <Calendar
            dateFormat='dd/M/y'
            inputStyle={{ borderRadius: '0', border: 'none', fontSize: '1.3rem', textAlign: 'center' }}
            style={{ width: '100%', height: '100%' }}
            value={dateValue}
            onChange={(e) => {
                setDateValue(e.value);
            }}
            onSelect={handleSubmitDate}
        />
    );
};
