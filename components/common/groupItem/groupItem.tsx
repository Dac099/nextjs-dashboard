import styles from './groupItem.module.css';
import type { Group } from '@/utils/types/groups';
import { GroupTitle } from '../groupTitle/groupTitle';

type Props = {
    group: Group;
};

export function GroupItem({ group }: Props)
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
        <section className={styles.groupHeader}>

        </section>
      </section>
    </article>
  );
}