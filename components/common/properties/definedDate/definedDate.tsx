'use client';

import styles from './styles.module.css';
import { LuCalendarClock } from "react-icons/lu";
import Calendar from 'react-calendar';
import {useState} from "react";
import {TableValue} from "@/utils/types/groups";

type Props = {
    value: TableValue;
    columnId: string;
    itemId: string;
};

export const DefinedDate = ({ value, columnId, itemId }: Props) => {
    const [ showCalendar, setShowCalendar ] = useState<boolean>(false);
    let defaultValue: string;

    return (
        <article className={styles.container}>
            <span>
                <LuCalendarClock
                    size={20}
                    onClick={() => {setShowCalendar(!showCalendar)}}
                />
            </span>
            <p>dating</p>

            {showCalendar &&
                <section className={styles['calendar-container']}>
                    <Calendar />
                </section>
            }
        </article>
    );
}