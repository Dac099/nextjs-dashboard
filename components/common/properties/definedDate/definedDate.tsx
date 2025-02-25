'use client';

import styles from './styles.module.css';
import { LuCalendarClock } from "react-icons/lu";
import Calendar from 'react-calendar';
import {useState, useEffect} from "react";
import {TableValue} from "@/utils/types/groups";
import { setTableValue } from '@/actions/groups';
import { useParams } from 'next/navigation';

type Props = {
    value: TableValue;
    columnId: string;
    itemId: string;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const DefinedDate = ({ value, columnId, itemId }: Props) => {
    const {id: boardId, viewId} = useParams();
    const [ showCalendar, setShowCalendar ] = useState<boolean>(false);
    
    const defaultValue: Date = value.value 
    ? new Date(JSON.parse(value.value))
    : new Date();

    const [ newDate, setNewDate ] = useState<Value>(defaultValue);

    useEffect(() => {
        setTableValue(
            boardId as string, 
            viewId as string, 
            itemId, 
            columnId, 
            JSON.stringify(newDate),
            value.id
        )
        setShowCalendar(false);
    }, [newDate]);

    function formatDate(date: Value): string
    {
        const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const jsDate = new Date(date!.toString());
        const day = jsDate.getDate();
        const month = months[jsDate.getMonth()];
        const year = jsDate.getFullYear();

        return `${day}/${month}/${year}`;
    }

    return (
        <article className={styles.container}>
            <span>
                <LuCalendarClock
                    size={20}
                    onClick={() => {setShowCalendar(!showCalendar)}}
                />
            </span>
            <p>{formatDate(newDate)}</p>

            {showCalendar &&
                <section className={styles['calendar-container']}>
                    <Calendar onChange={setNewDate} value={newDate}/>
                </section>
            }
        </article>
    );
}