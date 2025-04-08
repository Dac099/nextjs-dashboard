'use client';
import styles from './itemValue.module.css';
import { SubItem, TableValue } from "@/utils/types/groups";
import { DefinedDate } from "@/components/common/properties/definedDate/definedDate";
import { Primitive } from "@/components/common/properties/primitive/primitive";
import { Status } from "@/components/common/properties/status/status";
import { TimeLine } from '@/components/common/properties/timeLine/timeLine';
import { Percentage } from '../properties/percentage/percentage';
import { ResumedStatus } from '../properties/resumedStatus/resumedStatus';
import { useItemStore } from "@/stores/useItemStore";
import { useState, useEffect } from "react";
import { ResumedNumber } from '../properties/resumedNumber/resumedNumber';
import { findParentKeyBySubItemId } from '@/utils/helpers';

type Props = {
    type: string;
    value: TableValue;
    itemId: string;
    columnId: string;
};

export function ItemValue({
    type,
    value,
    itemId,
    columnId,
}: Props) {
    const [isRowParent, setIsRowParent] = useState<boolean>(false);
    const [subItemsRow, setSubItemsRow] = useState<SubItem[]>([]);
    const subItemsMap = useItemStore(state => state.subItemsMap);

    useEffect(() => {
        console.log('Actualizando.....')
        const subItems = subItemsMap.get(itemId);

        if (subItems && subItems.length > 0) {
            setIsRowParent(true);
        }

        setSubItemsRow(subItems || []);
    }, [subItemsMap, itemId]);

    if (type === 'number' || type === 'text') {
        if (type === 'number' && isRowParent && subItemsRow.length > 0) {
            const subItemsValues = subItemsRow
                .map(item => item.values)
                .flat(1)
                .filter(value => value.columnId === columnId)
                .map(value => value.value);

            return (
                <ResumedNumber
                    values={subItemsValues}
                />
            );
        }

        if (type === 'text' && isRowParent && subItemsRow.length > 0) {
            return <div className={styles.emptyField}></div>
        }

        return (
            <Primitive
                value={value}
                type={type}
                itemId={itemId}
                columnId={columnId}
            />
        );
    }

    if (type === 'status') {
        if (isRowParent && subItemsRow.length > 0) {
            const subItemsValues = subItemsRow
                .map(item => item.values)
                .flat(1)
                .filter(value => value.columnId === columnId)
                .map(value => value.value);

            return (
                <ResumedStatus
                    totalItems={subItemsRow.length || 0}
                    values={subItemsValues || []}
                />
            );
        }

        return (
            <Status
                value={value}
                itemId={itemId}
                columnId={columnId}
            />
        );
    }

    if (type === 'date') {
        if (isRowParent && subItemsRow.length > 0) {
            return <div className={styles.emptyField}></div>
        }

        return (
            <DefinedDate
                value={value}
                itemId={itemId}
                columnId={columnId}
            />
        );
    }

    if (type === 'timeline') {
        if (isRowParent && subItemsRow.length > 0) {
            return <div className={styles.emptyField}></div>
        }

        return (
            <TimeLine
                value={value}
                columnId={columnId}
                itemId={itemId}
            />
        );
    }

    if (type === 'percentage') {
        if (isRowParent && subItemsRow.length > 0) {
            return <div className={styles.emptyField}></div>
        }

        const itemStore = useItemStore.getState();
        const parentKey = findParentKeyBySubItemId(itemStore.subItemsMap, itemId);

        if (parentKey) {
            return <div className={styles.emptyField}></div>
        }

        return (
            <Percentage
                value={value}
                columnId={columnId}
                itemId={itemId}
            />
        );
    }

    if (type === 'person') {
        return (
            <p>Componente Person no implementado</p>
        );
    }

    return null;
}
