import {TableValue} from "@/utils/types/groups";
import {DefinedDate} from "@/components/common/properties/definedDate/definedDate";
import {Person} from "@/components/common/properties/person/person";
import {Primitive} from "@/components/common/properties/primitive/primitive";
import {Status} from "@/components/common/properties/status/status";
import {TimeLine} from '@/components/common/properties/timeLine/timeLine';
import { getBoardStatusList } from '@/actions/groups';

type Props = {
    type: string;
    value: TableValue;
    itemId: string;
    columnId: string;
};

export async function ItemValue({ type, value, itemId, columnId }: Props){
    const statusList: {color: string, text: string, id: string}[] = await getBoardStatusList(columnId);
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
                status={statusList}
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

    if(type === 'person'){
        return (
            // <Person value={value?.value}/>
            <p>Pending</p>
        );
    }
}