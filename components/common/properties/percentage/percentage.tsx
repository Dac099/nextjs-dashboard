'use client';
import styles from './percentage.module.css';
import { ItemData, ItemValue, ColumnData } from '@/utils/types/views';
import { useBoardDataStore } from '@/stores/boardDataStore';
import { useState, FocusEvent, KeyboardEvent } from 'react';
import { setPercentageValue } from './actions';

type Props = {
  value: ItemValue | undefined;
  item: ItemData;
  column: ColumnData;
};

export function Percentage({ item, column, value }: Props) {
  const [ inputValue, setInputValue ] = useState<string>(value?.value || '0');
  const { groups, setGroups } = useBoardDataStore();
  
  const handleSubmitValue = async(e: FocusEvent | KeyboardEvent) => {
    if(e.type === 'blur' || (e.type === 'keydown' && (e as KeyboardEvent).key === 'Enter')) {
      try {
        const [itemValue, itemGroup]: [ItemValue, ItemData] = await setPercentageValue(item, column, {
          ...value,
          value: inputValue,
        });                

        if(value?.id === undefined){
          item.values.push(itemValue);          
        }else{
          const valueIndex = item.values.findIndex(v => v.id === value.id);
          item.values[valueIndex] = itemValue;
        }

        const newGroups = [...groups];

        if(itemGroup.groupId === item.groupId) {
          const groupIndex = groups.findIndex(g => g.id === item.groupId);

          if (groupIndex !== -1) {
            const itemIndex = newGroups[groupIndex].items.findIndex(i => i.id === item.id);
            if (itemIndex !== -1) {
              newGroups[groupIndex].items[itemIndex] = item;
            }
            setGroups(newGroups);
            return;
          }
        }

        const currentGroupIndex = newGroups.findIndex(g => g.id === item.groupId);
        if (currentGroupIndex !== -1) {
          const itemIndex = newGroups[currentGroupIndex].items.findIndex(i => i.id === item.id);
          if (itemIndex !== -1) {
            newGroups[currentGroupIndex].items.splice(itemIndex, 1);
          }
        }
        const nextGroupIndex = newGroups.findIndex(g => g.id === itemGroup.groupId);
        if (nextGroupIndex !== -1) {
          newGroups[nextGroupIndex].items.unshift(item);
        }
        setGroups(newGroups);

      } catch (error) {
        console.log('Error al actualizar el valor de porcentaje:', error);
      }
    }
  };

  return (
    <input 
      type="number" 
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className={styles.inputValue}
      max={100}
      min={0}
      onBlur={handleSubmitValue}
      onKeyDown={handleSubmitValue}
    />
  );
}