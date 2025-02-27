'use client';

import styles from './styles.module.css';
import Calendar from 'react-calendar';
import { useEffect, useState, useRef } from "react";
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

    const defaultValue: [ValuePiece, ValuePiece] = value.value
        ? JSON.parse(value.value).map(date => new Date(date))
        : [new Date(), new Date(new Date().setMonth(new Date().getMonth() + 2))];

    const [ dates, setDates ] = useState<Value>(defaultValue);
    const prevDatesRef = useRef<Value>(defaultValue);
    const isInitialMount = useRef(true);
    
    // Memoizar estos cálculos para evitar recálculos innecesarios
    const currentDate = new Date();
    const startDateTime = dates[0] ? new Date(dates[0].toString()).getTime() : 0;
    const endDateTime = dates[1] ? new Date(dates[1].toString()).getTime() : 0;
    const totalTime = endDateTime - startDateTime;
    const completedTime = currentDate.getTime() - startDateTime;
    const percentage = Math.max(0, Math.min(100, Math.round(100 * (completedTime / totalTime))));

    // Este efecto maneja la actualización solo cuando las fechas cambian realmente
    useEffect(() => {
        // Ignorar el primer render
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Solo actualizar si las fechas han cambiado y el calendario no está visible
        if (!showCalendar && JSON.stringify(dates) !== JSON.stringify(prevDatesRef.current)) {
            // Actualizar la referencia para evitar actualizaciones innecesarias
            prevDatesRef.current = dates;
            
            setTableValue(
                boardId as string,
                viewId as string,
                itemId,
                columnId,
                JSON.stringify(dates),
                value.id
            );
        }
    }, [dates, showCalendar, boardId, viewId, itemId, columnId, value.id]);

    const handleCalendarToggle = () => {
        setShowCalendar(!showCalendar);
    };

    const handleDatesChange = (newDates: Value) => {
        setDates(newDates);
        // Al seleccionar fechas, cerramos el calendario
        setShowCalendar(false);
    };

    function formatDate(date: Value): string {
        if (!date) return '';
        
        const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const jsDate = new Date(date.toString());
        const month = months[jsDate.getMonth()];
        const year = jsDate.getFullYear();

        return `${month}/${year}`;
    }

    return (
        <article className={styles.container}>
            { showCalendar &&
                <section className={styles['calendar-container']}>
                    <Calendar selectRange={true} onChange={handleDatesChange} value={dates}/>
                </section>
            }

            <section className={styles['time-line']} onClick={handleCalendarToggle}>
                <p>{dates[0] && dates[1] ? `${formatDate(dates[0])} - ${formatDate(dates[1])}` : ''}</p>
                <div className={styles['progress-bg']}></div>
                <div
                    className={styles['progress-bar']}
                    style={{ 
                        width: `${percentage}%`, 
                        borderRadius: percentage < 94 ? '15px 0 0 15px' : '15px', 
                        maxWidth: '100%',
                        display: `${percentage <= 0 ? 'none' : 'block'}`
                    }}
                ></div>
            </section>
        </article>
    );
}