'use client';
import styles from './collapsedGroup.module.css';
import type { Group, Column, Item, ItemValues } from "@/utils/types/groups";
import { LuChevronDown as Arrow } from "react-icons/lu";
import { Tooltip } from '../tooltip/tooltip';
import { GroupTitle } from '../groupTitle/groupTitle';
import { ResumedNumber } from '../properties/resumedNumber/resumedNumber';
import { ResumedStatus } from '../properties/resumedStatus/resumedStatus';

type Props = {
  group: Group;
  columns: Column[];
  items: Item[];
  values: ItemValues;
  setIsCollapsed: (collapsed: boolean) => void;
  isCollapsed: boolean;
};

export function CollapsedGroup({group, columns, items, values, setIsCollapsed, isCollapsed}: Props){
  const itemsId: string[] = items?.map(item => item.id) || [];
  
  function getValuesByColumnId(itemsArray: string[], valuesMap: ItemValues, targetColumnId: string) {
    return itemsArray
      .map(itemId => {
        const itemValues = valuesMap.get(itemId) || [];
        
        const matchingValue = itemValues.find(v => v.columnId === targetColumnId);
        
        return matchingValue ? matchingValue.value : null;
      })
      .filter(value => value !== null); 
  }

  return (
    <article 
      className={styles.container}
      style={{ borderLeftColor: group.color }}
    >
      <section className={styles.groupHeader}>
        <div className={styles.groupTitle}>
          <Arrow 
            size={20}
            style={{
              color: group.color,
              cursor: 'pointer'
            }}
            className={isCollapsed ? styles.collapsedBtn : ''}
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
          {/* <p style={{color: group.color}}>{group.name}</p> */}
          <GroupTitle group={group}/>
        </div>
        <p 
          className={styles.itemsCount}
          style={{
            backgroundColor: group.color
          }}
        >
          {items?.length || 0} {items && items.length === 1 ? 'Item'  : 'Items'}
        </p>
      </section>

      {columns.map(column => (
        <div key={column.id} className={styles.columnContainer}>
          <Tooltip text={column.name}>
            {column.type === 'status' && 
              <ResumedStatus 
                values={getValuesByColumnId(itemsId, values, column.id)} 
                totalItems={items?.length || 0}
              />
            }
            {column.type === 'number' && <ResumedNumber values={getValuesByColumnId(itemsId, values, column.id)} />}
            {
              ['date', 'timeline', 'text'].some(type => type === column.type) && 
              <article className={styles.emptyResume}></article>
            }
          </Tooltip>
        </div>
      ))}
    </article>
  );
}