'use client';

import styles from './styles.module.css';
import { LuCalendarClock } from "react-icons/lu";
import Calendar from 'react-calendar';
import {useState} from "react";

type Props = {
    date : string
};

export const DefinedDate = ({ date }: Props) => {
    const [ showCalendar, setShowCalendar ] = useState<boolean>(false);

    return (
        <article className={styles.container}>
            <span>
                <LuCalendarClock
                    size={20}
                    onClick={() => {setShowCalendar(!showCalendar)}}
                />
            </span>
            <p>{date}</p>

            {showCalendar &&
                <section className={styles['calendar-container']}>
                    <Calendar />
                </section>
            }
        </article>
    );
}