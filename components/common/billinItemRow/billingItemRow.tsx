'use client';
import styles from './billingItemRow.module.css';
import type {Item, Tag, Value} from '@/utils/types/projectDetail';
import {formatDate} from "@/utils/helpers";
import {Calendar} from "react-calendar";
import {useState, KeyboardEvent, MouseEvent} from "react";
import {StatusTagContainer} from "@/components/common/StatusTagContainer/statusTagContainer";
import {updateItemName} from "@/actions/items";

type Props = {
    item: Item;
};

export function BillingItemRow({item}: Props) {
    return(
        <>
            <p>
                <input
                    type="text"
                    placeholder={'Nombre del item'}
                    defaultValue={item.name}
                    onKeyUp={(e:KeyboardEvent<HTMLInputElement>) => {
                        const target = e.target as HTMLInputElement;
                        if(
                            e.key === 'Enter' &&
                            target.value.length > 0 &&
                            target.value !== item.name
                        )
                        {
                            updateItemName(item.id as string, target.value);
                        }
                    }}
                />
            </p>
            <p>
                <input
                    type="number"
                    min={0}
                    step={0.01}
                    defaultValue={item.total}
                    readOnly={true}
                />
            </p>
            <p>
                <input
                    type="number"
                    min={0}
                    step={0.01}
                    defaultValue={item.invoice}
                    readOnly={true}
                />
            </p>
            <p
                className={styles.dateValue}
            >
                {formatDate(item.paymentDate as Date)}
            </p>
            <p>
                <input
                    type="number"
                    min={0}
                    step={0.01}
                    defaultValue={item.paid}
                    readOnly={true}
                />
            </p>
            <p>
                <input
                    type="text"
                    placeholder={'...'}
                    defaultValue={item.invoiceNumber}
                    readOnly={true}
                />
            </p>
            <p
                style={{backgroundColor: item.status.color, cursor: 'pointer', color: 'var(--bg-color'}}
                className={styles.tagElement}
            >
                {item.status.text}
            </p>
            <p>
                {formatDate(item.lastUpdate as Date)}
            </p>
        </>
    );
}