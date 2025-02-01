'use client';

import { ItemData } from '@/utils/common/types';
import styles from './styles.module.css';
import { Tooltip } from '@/components/common/tooltip/tooltip';

type Props = {
  items: ItemData[];
};

export const ResumeStatus = ({ items }: Props) => {
  const statusProperties = items.map((item) => item.properties).flat().filter((property) => property.type === 'Status');
  console.log(statusProperties);

  return (
    <article className={styles.container}>
      <p>{statusProperties[0].userTitle || statusProperties[0].propertyTitle}</p>

      <section>
        
      </section>
    </article>
  );
}