import { GroupItemTable } from "@/components/common/groupItem/groupItem";
import { GroupData, PageProperties } from "@/utils/common/types";
import styles from './styles.module.css';

type Props = {
  groups: GroupData[];
  pageProperties: PageProperties[];
};

export function Groups({ groups, pageProperties }: Props) {
  return (
    <article className={styles.container}>
      {groups.map((group: GroupData) => (
        <GroupItemTable key={group.id} group={group}/>
      ))}
    </article>
  );
};
