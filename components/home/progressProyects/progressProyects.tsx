'use client';
import styles from './progressProyects.module.css';
import { getRFQsData } from './actions';
import { useEffect, useState, useMemo } from 'react';
import { ItemReport, SapRecord } from '@/utils/types/requisitionsTracking';
import { CommonLoader } from '@/components/common/commonLoader/commonLoader';
import { 
  groupItemsReportByRFQ,
} from '@/utils/helpers';
import { RowItem } from './rowItem/rowItem';

export function ProgressProyects() {
  const [rfqsItemsFetched, setRfqsItemsFetched] = useState<ItemReport[] | null>(null);
  const [unmatchedSapItems, setUnmatchedSapItems] = useState<SapRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const rfqsData = await getRFQsData(0, 300);
        setRfqsItemsFetched(rfqsData.items);        
        setUnmatchedSapItems(rfqsData.unmatchedSapItems);
      } catch (error) {
        console.error('Fetching RFQs data BAD RESULT: ', error);
      }finally {
        setLoading(false);
      }
    } 

    fetchData();
  }, []);

  const groupedItems = useMemo(() => {
    if (!rfqsItemsFetched) return [];
    return groupItemsReportByRFQ(rfqsItemsFetched);
  }, [rfqsItemsFetched]);

  if(loading){
    return <article className={styles.loadContainer}><CommonLoader /></article>;
  }

  return (
    <article className={styles.mainContainer}>
      <section className={styles.header}>
        <h2 className={styles.headerTitle}>Seguimiento de compras</h2>
      </section>

      <section className={styles.dataContainer}>

        <div className={styles.datTableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th></th>
                <th>RFQ</th>
                <th>Tipo</th>
                <th>Fecha Creación</th>
                <th>Creador Por</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {groupedItems.map((item) => (
                <RowItem key={item.number} item={item} />
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.dataTablePaginator}>
          <button><i className='pi pi-caret-left'/></button>
          <button><i className='pi pi-caret-right'/></button>
        </div>
      </section>
    </article>
  );
}