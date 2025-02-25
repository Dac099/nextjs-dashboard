import styles from './itemRow.module.css';
import {Column, Item, TableValue} from "@/utils/types/groups";
import {ItemValue} from "@/components/common/itemValue/itemValue";

type Props = {
    item: Item;
    values: TableValue[] | undefined;
    columns: Column[];
};

export function ItemRow({ item, values, columns }: Props) {
    const valuesByColumn = new Map<Column, TableValue>();

    columns.forEach((column) => {
        const value: TableValue = values?.find(value => value.columnId === column.id) || {} as TableValue;
        valuesByColumn.set(column, value);
    });

    return (
        <>
            <div className={styles.itemTitle}>
                {item.name}
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