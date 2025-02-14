'use client';

import styles from './styles.module.css';
import {PropertyData} from "@/utils/common/types";
import Calendar from 'react-calendar';
import { useState } from "react";

type Props = {
    property: PropertyData
};

export const TimeLine = ({ property }: Props) => {
    const [ showCalendar, setShowCalendar ] = useState<boolean>(false);
    const startDateFormatead = new Date(property.startDate as string).toLocaleDateString('en-GB');
    const endDateFormatead = new Date(property.endDate as string).toLocaleDateString('en-GB');
    const [ startDay, startMonth, startYear ] = startDateFormatead?.split('-') as string[];
    const [ endDay, endMonth, endYear ] = endDateFormatead?.split('-') as string[];

    const currentDate = new Date();
    const startDate = new Date(`${startYear}/${startMonth}/${startDay}`);
    const endDate = new Date(`${endYear}/${endMonth}/${endDay}`);
    const totalTime = endDate.getTime() - startDate.getTime();
    const completedTime = currentDate.getTime() - startDate.getTime();
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
