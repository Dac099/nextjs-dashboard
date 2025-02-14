import styles from './styles.module.css';
import { IoIosArrowDown } from "react-icons/io";
import {RowItem} from "@/components/common/groupItem/rowItem/rowItem";
import { 
  getGroupItems, 
  getGroupProperties, 
  getItemData 
} from '@/actions/groups';
import type { 
  ItemData, 
  PropertyData, 
  GroupData, 
  ItemDetail 
} from '@/utils/common/types';

type Props = {
  group: GroupData;
};

type HeaderProperty = {
  userTitle: string;
  propertyTitle: string;
};

export async function GroupItemTable({ group }: Props){
  const items = await getGroupItems(group.id) as ItemData[];
  let groupProperties: PropertyData[][] = []
  let textProperties: HeaderProperty[] = [];
  let numberProperties: HeaderProperty[] = [];
  let statusProperties: HeaderProperty[] = [];
  let timelineProperties: HeaderProperty[] = [];
  let itemsDetail: ItemDetail[] = [];

  if(items.length > 0){
    groupProperties = await getGroupProperties(items[0].id) as PropertyData[][];
    textProperties = groupProperties[0];
    numberProperties = groupProperties[1];
    statusProperties = groupProperties[2];
    timelineProperties = groupProperties[3];
    const promiseDetails = items.map(item => getItemData(item.id));
    itemsDetail = await Promise.all(promiseDetails) as ItemDetail[];
  }

  console.log(1, items);
  console.log(2, groupProperties);
  console.log(3, itemsDetail);
  console.log(4, textProperties);
  console.log(5, numberProperties);
  console.log(6, statusProperties);
  console.log(7, timelineProperties);

  if(items.length === 0){
    return (
      <article 
        className={`${styles.container} ${styles['container--closed']}`} 
        style={{borderLeft: `8px solid ${group.color}`}}
      >
        <section className={styles['header--closed']}>
          
          <section className={styles.header}>
            <IoIosArrowDown
              className={`${styles.icon} ${styles['icon--closed']}`}
              style={{color: group.color}}              
            />
            <p style={{color: group.color}}>{group.title}</p>
          </section>

          <span>
            0 elementos
          </span>

        </section>

        <section className={styles['properties--closed']}></section>
      </article>
    );
  }

  return (
    <article>
      <section className={`${styles.header} ${styles['header--open']}`} style={{color: group.color}}>
        <IoIosArrowDown 
          className={styles.icon}
        />
        <p>{group.title}</p>
      </section>

      <section 
        className={`${styles.container} ${styles['container--open']}`}
        style={{borderLeft: `8px solid ${group.color}`}}
      >
        <article
          className={styles.row}
        >
          <div className={styles.checkbox}>
            <input 
              type="checkbox" 
              name="" 
              id="" 
            />
          </div>

          <div className={styles['row-header']}>
            <p>Proyecto</p>
          </div>

          {/* Table's head rendering */}
          {
            textProperties.map(property => (
              <div key={property.propertyTitle} className={styles['row-header']}>
                <p>{property.userTitle || property.propertyTitle}</p>
              </div>
            ))
          }
          {
            numberProperties.map(property => (
              <div key={property.propertyTitle} className={styles['row-header']}>
                <p>{property.userTitle || property.propertyTitle}</p>
              </div>
            ))
          }
          {
            statusProperties.map(property => (
              <div key={property.propertyTitle} className={styles['row-header']}>
                <p>{property.userTitle || property.propertyTitle}</p>
              </div>
            ))
          }
          {
            timelineProperties.map(property => (
              <div key={property.propertyTitle} className={styles['row-header']}>
                <p>{property.userTitle || property.propertyTitle}</p>
              </div>
            ))
          }
        </article>

        {/* Table items rendering */}
        {
          items.map(item => {
            const detail = itemsDetail.find(detail => detail.itemId === item.id) as ItemDetail;
            return (
              <RowItem 
                key={item.id}
                detail={detail}
                item={item}
              />
            );
          })
        }
      </section>

    </article>
  );
}