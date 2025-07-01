'use client';
import styles from './rowName.module.css';
import type { ItemData, SubItemData } from '@/utils/types/views';
import { useState } from 'react';
import { ProgressDial } from '@/components/common/progressDial/progressDial';
import { useRouter } from 'next/navigation';

type Props = {
  itemData: ItemData;
};

export function RowName({ itemData }: Props) {
  const router = useRouter();
  const [ subItems, setSubItems ] = useState<SubItemData[]>([]);
  const [ showSubItems, setShowSubItems ] = useState(false);
 
  const handleShowSubItems = () => {
    setShowSubItems(!showSubItems);
  };

  const handleShowItemDetail = () => {
    router.push(`?itemId=${itemData.id}`)
  };

  return (
    <section className={styles.container}>
      <i 
        className={`${styles.icon} pi pi-angle-${showSubItems ? 'down' : 'right'}`}
        onClick={handleShowSubItems}
        title='Mostrar/Ocultar subitems'
      ></i>
      <p 
        className={styles.itemName}
        title={itemData.name}
      >
        {itemData.name}
      </p>
      <article className={styles.chatData}>
        <ProgressDial total={10} completed={5}/>
        <i 
          className={`${styles.chatIcon} pi pi-comments`} 
          onClick={handleShowItemDetail}
        ></i>
      </article>
    </section>
  );
}