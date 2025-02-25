import styles from './itemValue.module.css';
import {TableValue} from "@/utils/types/groups";
import {DefinedDate} from "@/components/common/properties/definedDate/definedDate";
import {Person} from "@/components/common/properties/person/person";
import {Primitive} from "@/components/common/properties/primitive/primitive";
import {Status} from "@/components/common/properties/status/status";
import {TimeLine} from '@/components/common/properties/timeLine/timeLine';

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
            // <TimeLine
            //     startDate={new Date().toLocaleDateString('en-GB')}
            //     endDate={new Date().toLocaleDateString('en-GB')}
            // />
            <p>Pending</p>
        );
    }

    if(type === 'person'){
        return (
            // <Person value={value?.value}/>
            <p>Pending</p>
        );
    }
}