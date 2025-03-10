'use client';

import styles from './styles.module.css';
import { LuCalendarClock } from "react-icons/lu";
import Calendar from 'react-calendar';
import {useState, useEffect, useRef} from "react";
import {TableValue} from "@/utils/types/groups";
import { setTableValue } from '@/actions/groups';
import { useParams } from 'next/navigation';
import { Actions } from '@/utils/types/roles';
import { roleAccess } from '@/utils/userAccess';

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
    const prevDateRef = useRef<Value>(defaultValue);
    const isInitialMount = useRef(true);
    const [userActions, setUserActions] = useState<Actions[]>([]);

    useEffect(() => {
        async function fetchData(){
            const actions = await roleAccess(boardId as string);
            setUserActions(actions);
        }

        fetchData();
    }, [boardId]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (!showCalendar && JSON.stringify(newDate) !== JSON.stringify(prevDateRef.current)) {
            // Actualizar la referencia para evitar actualizaciones innecesarias
            prevDateRef.current = newDate;
            
            setTableValue(
                boardId as string, 
                viewId as string, 
                itemId, 
                columnId, 
                JSON.stringify(newDate),
                value.id
            );
        }
    }, [newDate, showCalendar, boardId, viewId, itemId, columnId, value.id]);

    const handleCalendarToggle = () => {
        if(userActions.includes('update')){
            setShowCalendar(!showCalendar);
        }
    };

    const handleDateChange = (date: Value) => {
        setNewDate(date);
        // Al seleccionar una fecha, cerramos el calendario
        setShowCalendar(false);
    };

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
                    onClick={handleCalendarToggle}
                />
            </span>
            <p>{formatDate(newDate)}</p>

            {showCalendar &&
                <section className={styles['calendar-container']}>
                    <Calendar onChange={handleDateChange} value={newDate}/>
                </section>
            }
        </article>
    );
}