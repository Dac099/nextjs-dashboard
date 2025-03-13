'use client';
import {TableValue} from "@/utils/types/groups";
import {DefinedDate} from "@/components/common/properties/definedDate/definedDate";
import {Primitive} from "@/components/common/properties/primitive/primitive";
import {Status} from "@/components/common/properties/status/status";
import {TimeLine} from '@/components/common/properties/timeLine/timeLine';
import { Percentage } from '../properties/percentage/percentage';

type Props = {
    type: string;
    value: TableValue;
    itemId: string;
    columnId: string;
};

export function ItemValue({ type, value, itemId, columnId }: Props){
    if(type === 'number' || type === 'text'){
        return (
            <Primitive
                value={value}
                type={type}
                itemId={itemId}
                columnId={columnId}
            />
        );
    }

    if(type === 'status'){
        return (
            <Status
                value={value}
                itemId={itemId}
                columnId={columnId}
            />
        );
    }

    if(type === 'date'){
        return (
            <DefinedDate
                value={value}
                itemId={itemId}
                columnId={columnId}
            />
        );
    }

    if(type === 'timeline'){
        return (
            <TimeLine
                value={value}
                columnId={columnId}
                itemId={itemId}
            />
        );
    }

    if(type === 'percentage'){
        return (
            <Percentage 
                value={value}
                columnId={columnId}
                itemId={itemId}
            />
        );
    }

    if(type === 'person'){
        return (
            // <Person value={value?.value}/>
            <p>Pending</p>
        );
    }
}