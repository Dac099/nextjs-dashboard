'use client';

import styles from './styles.module.css';
import {PropertyData} from "@/utils/common/types";
import Calendar from 'react-calendar';
import { useState } from "react";

type Props = {
    startDate: string;
    endDate: string;
};

export const TimeLine = ({ startDate, endDate }: Props) => {
    const [ showCalendar, setShowCalendar ] = useState<boolean>(false);
    const startDateFormatead = new Date(startDate as string).toLocaleDateString('en-GB');
    const endDateFormatead = new Date(endDate as string).toLocaleDateString('en-GB');
    const [ startDay, startMonth, startYear ] = startDateFormatead?.split('-') as string[];
    const [ endDay, endMonth, endYear ] = endDateFormatead?.split('-') as string[];

    const currentDate = new Date();
    const startDateTime = new Date(`${startYear}/${startMonth}/${startDay}`);
    const endDateTime = new Date(`${endYear}/${endMonth}/${endDay}`);
    const totalTime = endDateTime.getTime() - startDateTime.getTime();
    const completedTime = currentDate.getTime() - startDateTime.getTime();
    const percentage = Math.round(100 * (completedTime / totalTime));

    return (
        <article className={styles.container}>
            { showCalendar &&
                <section className={styles['calendar-container']}>
                    <Calendar selectRange={true}/>
                </section>
            }

            <section className={styles['time-line']} onClick={ () => setShowCalendar(!showCalendar) }>
                <p>{startDateFormatead} - {endDateFormatead}</p>
                <div className={styles['progress-bg']}></div>
                <div
                    className={styles['progress-bar']}
                    style={{ width: `${percentage}%`, borderRadius: percentage < 94 ? '15px 0 0 15px' : '15px'}}
                ></div>
            </section>
        </article>
    );
}
