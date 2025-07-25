'use client';
import styles from './rowItem.module.css';
import { getRFQStatusText, transformDateObjectToLocalString } from '@/utils/helpers';
import { Requisition } from '@/utils/types/requisitionsTracking';
import { useState, useMemo } from 'react';
import { CollapsibleItems } from '../collapsibleItems/collapsibleItems';

type Props = {
  item: Requisition
};

export function RowItem({ item }: Props){
  const [ showItems, setShowItems ] = useState<boolean>(false);

  const itemsSapRegistered = useMemo(() => {
    return item.purchaseItems.filter(purchase => purchase.registerSap === 2);
  }, [item.purchaseItems]);

  const itemsWithoutRFQ = useMemo(() => {
    return item.purchaseItems.filter(purchase => purchase.registerSap === 1);
  }, [item.purchaseItems]);

  const itemsWithoutSap = useMemo(() => {
    return item.purchaseItems.filter(purchase => purchase.registerSap === 0);
  }, [item.purchaseItems]);

  return (
    <>
      <tr
        className={`${styles.rowItem} ${showItems ? styles.rowExpanded : ''}`}
      >
        <td 
          className={styles.expanderIcon}
          onClick={() => setShowItems(!showItems)}
        >
          <i className={`pi ${showItems ? 'pi-chevron-down' : 'pi-chevron-right'}`}/>
        </td>
        <td>{item.number}</td>
        <td>{item.type}</td>
        <td>{transformDateObjectToLocalString(item.createdAt)}</td>
        <td>{item.createdBy}</td>     
        <td>{getRFQStatusText(item)}</td>             
      </tr>
      {showItems && (
        <tr>
          <td colSpan={6} className={styles.collapsibleContainer}>
            <CollapsibleItems title='Registrados en SAP' items={itemsSapRegistered} />
            <CollapsibleItems title='Coincidentes sin RFQ' items={itemsWithoutRFQ} />
            <CollapsibleItems title='Items sin registro en SAP' items={itemsWithoutSap} />
          </td>
        </tr>
      )}
    </>
  );
}