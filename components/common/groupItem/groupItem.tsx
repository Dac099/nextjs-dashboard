import styles from './groupItem.module.css';
import type { Group, Column, Item, ItemValues } from '@/utils/types/groups';
import { GroupTitle } from '../groupTitle/groupTitle';
import { GroupHeaderColumn } from '../groupHeaderColumn/groupHeaderColumn';

type Props = {
    group: Group;
    columns: Column[];
    items: Item[];
    values: ItemValues;
};

export function GroupItem({ group, columns, items, values }: Props)
{
  return (
    <article
      className={styles.groupItem}
    >
      
      <GroupTitle group={group} />

      <section 
        className={styles.groupBody}
        style={{ borderLeftColor: group.color }}
      >
        <section className={`${styles.groupRow} ${styles.groupHeader}`}>
          <div className={styles.groupHeaderProyect}>
            <p>Proyecto</p>
          </div>
          {
            columns.map(column => (
              <GroupHeaderColumn 
                key={column.id} 
                column={column}
              />
            ))
          }
        </section>
      </section>
    </article>
  );
}