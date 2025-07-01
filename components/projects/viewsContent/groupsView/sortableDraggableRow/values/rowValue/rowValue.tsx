'use client';
import styles from './rowValue.module.css';
import type { ColumnData, ItemData } from '@/utils/types/views';
import { NumberColumn } from '@/components/common/properties/numberColumn/numberColumn';
import { TextColumn } from '@/components/common/properties/textColumn/textColumn';
import { DefinedDate } from '@/components/common/properties/definedDate/definedDate';
import { Percentage } from '@/components/common/properties/percentage/percentage';
import { TimeLine } from '@/components/common/properties/timeLine/timeLine';
import { Status } from '@/components/common/properties/status/status';

type Props = {
  column: ColumnData;
  itemData: ItemData;
};

export function RowValue({ column, itemData }: Props) {
  const renderValueByColumnType = () => {
    const itemValue = itemData.values.find(value => value?.columnId === column.id);

    switch(column.type){
      case 'date':
        return <DefinedDate value={itemValue} column={column} item={itemData} />;
      case 'number':
        return <NumberColumn value={itemValue} item={itemData} column={column} />;
      case 'status':
        return <Status value={itemValue} item={itemData} column={column} />;
      case 'percentage':
        return <Percentage item={itemData} column={column} value={itemValue} />;
      case 'text':
        return <TextColumn value={itemValue} item={itemData} column={column} />;
      case 'timeline':
        return <TimeLine value={itemValue} column={column} item={itemData} />;
    }
  };

  return (
    <article className={styles.container}>
      {renderValueByColumnType()}
    </article>
  );
}