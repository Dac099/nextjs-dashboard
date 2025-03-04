import styles from './itemRow.module.css';
import {Column, Item, TableValue} from "@/utils/types/groups";
import {ItemValue} from "@/components/common/itemValue/itemValue";
import { ProgressDial } from '../progressDial/progressDial';
import { ChatRing } from '../chatRing/chatRing';
import { ResponseChats } from '@/utils/types/items';
import { getItemChats } from '@/actions/items';
import {RowTitle} from "@/components/common/rowTitle/rowTitle";
import { AiOutlineDeleteRow } from "react-icons/ai";
import { DeleteRowBtn } from '../deleteRowBtn/deleteRowBtn';

type Props = {
    item: Item;
    values: TableValue[] | undefined;
    columns: Column[];
};

export async function ItemRow({ item, values, columns }: Props) {
    const chatData: ResponseChats = await getItemChats(item.id);
    const valuesByColumn = new Map<Column, TableValue>();

    columns.forEach((column) => {
        const value: TableValue = values?.find(value => value.columnId === column.id) || {} as TableValue;
        valuesByColumn.set(column, value);
    });

    return (
        <>
            <div className={styles.itemTitle}>
                <div className={styles.deleteRow}>
                    <DeleteRowBtn itemId={item.id}/>
                </div>
                <RowTitle itemId={item.id} title={item.name}/>
                <article
                    className={styles.tasksContainer}
                >
                    <ProgressDial completed={0} total={10}/>
                </article>

                <article
                    className={styles.chatContainer}
                >
                    <ChatRing chatData={chatData} />
                </article>
            </div>
            {
                columns.map((column) => (
                    <div key={column.id}>
                        <ItemValue
                            value={valuesByColumn.get(column) as TableValue}
                            type={column.type}
                            columnId={column.id}
                            itemId={item.id}
                        />
                    </div>
                ))
            }
        </>
    );
}