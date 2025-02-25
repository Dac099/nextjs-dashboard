'use client';

import styles from './styles.module.css';
import Calendar from 'react-calendar';
import { useEffect, useState } from "react";
import { TableValue } from '@/utils/types/groups';
import { useParams } from 'next/navigation';
import { setTableValue } from '@/actions/groups';

type Props = {
    value: TableValue;
    columnId: string;
    itemId: string;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const TimeLine = ({ value, columnId, itemId }: Props) => {
    const {id: boardId, viewId} = useParams();
    const [ showCalendar, setShowCalendar ] = useState<boolean>(false);

    const defaultValue: [ValuePiece, ValuePiece]  = value.value
        ? JSON.parse(value.value).map(date => new Date(date))
        : [new Date(), new Date(new Date().setMonth(new Date().getMonth() + 2))];

    const [ dates, setDates ] = useState<Value>(defaultValue);
    

    const currentDate = new Date();
    const startDateTime = new Date(dates[0]!.toString());
    const endDateTime = new Date(dates[1]!.toString());
    const totalTime = endDateTime.getTime() - startDateTime.getTime();
    const completedTime = currentDate.getTime() - startDateTime.getTime();
    const percentage = Math.round(100 * (completedTime / totalTime));

    useEffect(() => {
        setTableValue(
            boardId as string,
            viewId as string,
            itemId,
            columnId,
            JSON.stringify(dates),
            value.id
        );
        setShowCalendar(false);
    }, [dates]);

    function formatDate(date: Value): string
    {
        const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const jsDate = new Date(date!.toString());
        const month = months[jsDate.getMonth()];
        const year = jsDate.getFullYear();

        return `${month}/${year}`;
    }

    return (
        <article className={styles.container}>
            { showCalendar &&
                <section className={styles['calendar-container']}>
                    <Calendar selectRange={true} onChange={setDates} value={dates}/>
                </section>
            }

            <section className={styles['time-line']} onClick={ () => setShowCalendar(!showCalendar) }>
                <p>{formatDate(dates[0])} - {formatDate(dates[1])}</p>
                <div className={styles['progress-bg']}></div>
                <div
                    className={styles['progress-bar']}
                    style={{ 
                        width: `${percentage}%`, 
                        borderRadius: percentage < 94 ? '15px 0 0 15px' : '15px', 
                        maxWidth: '100%'
                    }}
                ></div>
            </section>
        </article>
    );
}
