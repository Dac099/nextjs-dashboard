'use client';

import styles from './styles.module.css';
import {PropertyData} from "@/utils/common/types";
import { LuCalendarClock } from "react-icons/lu";
import Calendar from 'react-calendar';
import {useState} from "react";

type Props = {
    property : PropertyData
};

export const DefinedDate = ({ property }: Props) => {
    const [ showCalendar, setShowCalendar ] = useState<boolean>(false);

    return (
        <article className={styles.container}>
            <span>
                <LuCalendarClock
                    size={20}
                    onClick={() => {setShowCalendar(!showCalendar)}}
                />
            </span>
            <p>{property.value}</p>

            {showCalendar &&
                <section className={styles['calendar-container']}>
                    <Calendar />
                </section>
            }
        </article>
    );
}