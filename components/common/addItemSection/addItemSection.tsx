'use client';

import styles from './addItemSection.module.css';
import {
    useState,
    useRef,
    useEffect,
    RefObject
} from "react";
import useClickOutside from "@/hooks/useClickOutside";
import {Tooltip} from "@/components/common/tooltip/tooltip";
import {Column} from "@/utils/types/groups";

type Props = {
    columns: Column[];
};

export function AddItemSection({ columns }: Props)
{
    const [ showItemInput, setShowItemInput ] = useState<boolean>(false);
    return (
        <article className={styles.container}>
            <span
                className={styles.addBtn}
                onClick={() => setShowItemInput(!showItemInput)}
            >
                +
            </span>
            {showItemInput &&
                <section className={styles.containerRow}>
                    <div>
                        <input
                            type="text"
                            placeholder="Nombre del item"
                        />
                    </div>
                    {
                        columns.map(column => (
                            <div key={column.id}>
                                {column.name}
                            </div>
                        ))
                    }
                </section>
            }
        </article>
    );
}
