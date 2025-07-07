'use client';
import styles from './textColumn.module.css';
import { ColumnData, GroupData, ItemData, ItemValue, SubItemData } from '@/utils/types/views';
import React, { useState } from 'react';
import { updateTextColumnValue } from './action';
import { useBoardDataStore } from '@/stores/boardDataStore';

type Props = {
  value: ItemValue | undefined;
  item: ItemData | SubItemData;
  column: ColumnData;
  isSubItem?: boolean;
};

export function TextColumn({ value, item, column, isSubItem }: Props) {
  const { setGroups, groups } = useBoardDataStore(state => state);
  const parsedValue = value ? value.value.replaceAll('"', '') : '';
  const [inputValue, setInputValue] = useState<string>(parsedValue);

  const handleSubmitValue = async (e: React.FocusEvent | React.KeyboardEvent) => {
    if (e.type === 'blur' || (e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter')) {
      if (inputValue.length > 0) {
        try {
          const newItem = await updateTextColumnValue(item, column, {
            ...value,
            value: inputValue
          }, value?.value);

          const valueIndex = item.values.findIndex(v => v.id === newItem.id);

          if (valueIndex !== -1) {
            item.values[valueIndex] = newItem;
          } else {
            item.values.push(newItem);
          }

          if (isSubItem) return;

          const newGroupsBoard: GroupData[] = groups.map(group => {
            return {
              ...group,
              items: group.items.map(itemInGroup => {
                if (itemInGroup.id === item.id) {
                  return item as ItemData;
                }
                return itemInGroup;
              })
            }
          }
          )
          setGroups(newGroupsBoard);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  return (
    <input
      type="text"
      className={styles.inputText}
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      onBlur={handleSubmitValue}
      placeholder='...'
      onKeyDown={handleSubmitValue}
    />
  );
}
