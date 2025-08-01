'use client';
import styles from './rowItem.module.css';
import { getRFQStatusText, transformDateObjectToLocalString, RFQTypeMap } from '@/utils/helpers';
import { ItemReport, Requisition } from '@/utils/types/requisitionsTracking';
import { useState, useMemo } from 'react';
import { CollapsibleItems } from '../collapsibleItems/collapsibleItems';
import { Tag } from 'primereact/tag';

type Props = {
  item: Requisition
  expandAll: boolean;
  globalFilterValue: string;
};

export function RowItem({ item, expandAll, globalFilterValue }: Props){
  const [ showItems, setShowItems ] = useState<boolean>(false);

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className={styles.highlight}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const itemsSapRegistered = useMemo(() => {
    return item.purchaseItems.filter(({ sapPartNumber, sapRfq }: ItemReport) => sapPartNumber && sapRfq);
  }, [item.purchaseItems]);

  const itemsWithoutRFQ = useMemo(() => {
    return item.purchaseItems.filter(({ sapRfq, sapPartNumber }: ItemReport) => sapPartNumber && !sapRfq);
  }, [item.purchaseItems]);

  const itemsWithoutSap = useMemo(() => {
    return item.purchaseItems.filter(({ sapRfq, sapPartNumber }: ItemReport) => !sapRfq && !sapPartNumber);
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
          <i className={`pi ${showItems || expandAll ? 'pi-chevron-down' : 'pi-chevron-right'}`}/>
        </td>
        <td>{getHighlightedText(item.number, globalFilterValue)}</td>
        <td>
          <Tag 
            value={RFQTypeMap[item.type.trim()] || item.type.trim()}
            severity='info'
            style={{ width: '100%', fontSize: '1.2rem' }}
          />
        </td>
        <td>{transformDateObjectToLocalString(item.createdAt)}</td>
        <td>{getHighlightedText(item.createdBy, globalFilterValue)}</td>     
        <td>{getRFQStatusText(item)}</td> 
        <td>{item.sysStatusText}</td>            
      </tr>
      {(showItems || expandAll) && (
        <tr>
          <td colSpan={7} className={styles.collapsibleContainer}>
            <CollapsibleItems title='Registrados en SAP' items={itemsSapRegistered} expandAll={expandAll} globalFilterValue={globalFilterValue} />
            <CollapsibleItems title='Coincidentes sin RFQ' items={itemsWithoutRFQ} expandAll={expandAll} globalFilterValue={globalFilterValue} />
            <CollapsibleItems title='Items sin registro en SAP' items={itemsWithoutSap} expandAll={expandAll} globalFilterValue={globalFilterValue} />
          </td>
        </tr>
      )}
    </>
  );
}