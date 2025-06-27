'use client';
import styles from './rowValue.module.css';
import type { ColumnData, ItemData } from '@/utils/types/views';
import { NumberColumn } from '@/components/common/properties/numberColumn/numberColumn';
import { TextColumn } from '@/components/common/properties/textColumn/textColumn';
import { DefinedDate } from '@/components/common/properties/definedDate/definedDate';

type Props = {
  column: ColumnData;
  itemData: ItemData;
};

export function RowValue({ column, itemData }: Props) {
  const renderValueByColumnType = () => {
    const itemValue = itemData.values.find(value => value.columnId === column.id);

    switch(column.type){
      case 'date':
        return <DefinedDate value={itemValue} column={column} item={itemData} />;
      case 'number':
        return <NumberColumn value={itemValue} item={itemData} column={column} />;
      case 'status':
        return <p>{itemValue ? itemValue.value : 'sin valor'}</p>;
      case 'percentage':
        return <p>{itemValue ? itemValue.value : 'sin valor'}</p>;
      case 'text':
        return <TextColumn value={itemValue} item={itemData} column={column} />;
      case 'timeline':
        return <p>{itemValue ? itemValue.value : 'sin valor'}</p>;
    }
  };

  return (
    <article className={styles.container}>
      {renderValueByColumnType()}
    </article>
  );
}