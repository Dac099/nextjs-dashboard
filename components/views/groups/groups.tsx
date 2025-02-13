import { GroupItemTable } from "@/components/common/groupItem/groupItem";
import { GroupData } from "@/utils/common/types";
import styles from './styles.module.css';

type Props = {
  groups: GroupData[];
};

export function Groups({ groups }: Props) {


  if(groups.length === 0) {
    return (
      <article className={styles.container}>
        <p className={styles.emptyGroupsText}>Empieza creando un grupo</p>
      </article>
    );
  }

  return (
    <article className={styles.container}>
      {groups.map((group: GroupData) => (
        <GroupItemTable key={group.id} group={group}/>
      ))}
    </article>
  );
};
