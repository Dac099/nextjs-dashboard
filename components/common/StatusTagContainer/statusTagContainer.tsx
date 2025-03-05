'use client'
import styles from './statusTagContainer.module.css';
import type {Tag} from "@/utils/types/projectDetail";

type PropsStatus = {
    setSelected: (value: Tag) => void;
};

export function StatusTagContainer({setSelected}: PropsStatus) {
    const tags :Tag[] = [
        {
            color: '#4a86f8',
            text: 'Factura Solicitada',
        },
        {
            color: '#19e419',
            text: 'Pagado',
        },
        {
            color: '#eb3838',
            text: 'Fecha de pago vencida',
        },
        {
            color: '#a9a9a9',
            text: 'Pendiente de pago',
        },
        {
            color: 'black',
            text: 'Cancelado'
        }
    ];

    return (
        <article className={styles.statusTagContainer}>
            {
                tags.map((item: Tag, index: number) => (
                    <p
                        key={index}
                        style={{backgroundColor: item.color}}
                        onClick={() => setSelected(item)}
                        className={styles.tagOption}
                    >
                        {item.text}
                    </p>
                ))
            }
        </article>
    );
}