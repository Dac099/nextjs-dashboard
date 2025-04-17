'use client';
import styles from './billingContainer.module.css';
import { useState, useEffect } from "react";
import { addGroupToBillingBoard, addItemToGroup, getItemsForBilling } from "@/actions/projectDetail";
import { Skeleton } from "@/components/common/skeleton/skeleton";
import type { Item } from '@/utils/types/projectDetail';
import { BillingItemRow } from "@/components/common/billinItemRow/billingItemRow";

type Props = {
    idProject: string;
    projectName: string;
};

export function BillingContainer({ idProject, projectName }: Props) {
    const [items, setItems] = useState<Item[]>([]);
    const [groupId, setGroupId] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData(): Promise<void> {
            const id: string = await addGroupToBillingBoard(`${idProject} | ${projectName}`);
            const itemsRes: Item[] = await getItemsForBilling(id);
            setGroupId(id);
            setItems(itemsRes);
            console.log(itemsRes)
        }

        fetchData()
            .finally(() => setIsLoading(false));
    }, [idProject, projectName]);

    async function handleAddBillingItem(): Promise<void> {
        const itemId: string = await addItemToGroup(groupId as string);

        const newItem: Item = {
            id: itemId,
            name: 'Sin nombre',
            invoice: 0,
            invoiceNumber: 'Sin definir',
            paid: 0,
            lastUpdate: new Date(),
            paymentDate: new Date(),
            status: {
                color: 'rgba(0,0,0,0.3)',
                text: 'Sin Definir'
            },
            total: 0
        };

        setItems([...items, newItem]);
    }

    if (isLoading) {
        return (
            <article className={styles.container}>
                <Skeleton width={'500px'} height={'35px'} rounded={'5px'} />
                <Skeleton width={'100%'} height={'150px'} rounded={'5px'} />
            </article>
        );
    }

    return (
        <article className={styles.container}>
            <p
                className={styles.projectTitle}
            >
                {`${idProject} | ${projectName}`}
            </p>

            <article className={styles.table}>
                <section className={`${styles.row} ${styles.rowHeader}`}>
                    <p>Item</p>
                    <p>Total</p>
                    <p>Invoice</p>
                    <p>Payment Date</p>
                    <p>Paid</p>
                    <p>Invoice Number</p>
                    <p>Status</p>
                    <p>Last Updated</p>
                </section>

                <section
                    className={styles.rowHeaderBtn}
                    onClick={() => handleAddBillingItem()}
                >
                    +
                </section>

                {
                    items.map((item: Item, index: number) => (
                        <section className={styles.row} key={index} >
                            <BillingItemRow item={item} />
                        </section>
                    ))
                }
            </article>
        </article>
    );
}
