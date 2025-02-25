'use client';

import styles from './styles.module.css';
import {TableValue} from "@/utils/types/groups";
import {useState, KeyboardEvent, useRef} from "react";
import {useParams} from "next/navigation";
import {setTableValue} from "@/actions/groups";

type Props = {
    value: TableValue;
    type: string;
    itemId: string;
    columnId: string;
};

export const Primitive = ({ value, type, itemId, columnId }: Props) =>
{
    const {id: boardId, viewId} = useParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const defaultValue:string | number = JSON.parse(value.value) || (type === 'number' ? 0 : '...');
    const [definedValue, setDefinedValue] = useState<string | number>(defaultValue);

    async function handleSubmit(e: KeyboardEvent<HTMLInputElement> )
    {
        if(e.code === 'Escape') {
            setDefinedValue(defaultValue);
            inputRef.current?.blur();
            return;
        }


        if(e.code === 'Enter')
        {
            if(definedValue === defaultValue)
            {
                setDefinedValue(defaultValue);
                return;
            }
            await setTableValue(
                boardId as string,
                viewId as string,
                itemId,
                columnId,
                JSON.stringify(definedValue),
                value.id
            );
            inputRef.current?.blur();
            return;
        }
    }


    return (
        <input
            className={styles.inputValue}
            type={type}
            value={definedValue}
            onFocus={e => e.target.select()}
            ref={inputRef}
            onChange={e => setDefinedValue(e.target.value)}
            onKeyUp={e => handleSubmit(e)}
        />
    );
}