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
        const [itemValue, itemGroup]: ItemValue = await setPercentageValue(item, column, {
          ...value,
          value: inputValue,
        });
        
        const parsedValue = parseFloat(inputValue);
        const newGroups = [...groups];
        const groupIndex = newGroups.findIndex(group => group.id === item.groupId);
        const itemIndex = newGroups[groupIndex].items.findIndex(i => i.id === item.id);
        const lastGroupIndex = newGroups.length - 1;

        if(value?.id === undefined){
          newGroups[groupIndex].items[itemIndex].values.push(itemValue)
        }else{
          newGroups[groupIndex].items[itemIndex].values = item.values.map(val => {
            if(val.id === value.id) {
              return {
                ...val,
                value: inputValue,
              };
            }
            return val;
          });
        }

        if(parsedValue < 100){          
          setGroups(newGroups);
          return;
        }



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