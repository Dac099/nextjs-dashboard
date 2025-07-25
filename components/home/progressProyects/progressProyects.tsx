'use client';
import styles from './progressProyects.module.css';
import { getRFQsData } from './actions';
import { useEffect, useState, useMemo } from 'react';
import { ItemReport, SapRecord } from '@/utils/types/requisitionsTracking';
import { CommonLoader } from '@/components/common/commonLoader/commonLoader';
import { groupItemsReportByRFQ } from '@/utils/helpers';
import { RowItem } from './rowItem/rowItem';
import { useDebounce } from '@/hooks/useDebounce';

export function ProgressProyects() {
  const [rfqsItemsFetched, setRfqsItemsFetched] = useState<ItemReport[] | null>(null);
  const [unmatchedSapItems, setUnmatchedSapItems] = useState<SapRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const debounceQuery = useDebounce(globalFilter, 300);
  const [ expandAllResults, setExpandAllResults ] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const rfqsData = await getRFQsData(0, 100);
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

  useEffect(() => {
    if(!debounceQuery) {
      setExpandAllResults(false);
      return;
    }

    async function getData() {
      try {
        setLoading(true);
        const data = await getRFQsData(0, 100, debounceQuery);
        setRfqsItemsFetched(data.items);
        setUnmatchedSapItems(data.unmatchedSapItems);

        if( data.items.length > 0) {
          setExpandAllResults(true);
        }

      } catch (error) {
        console.error('Error fetching RFQs data with global filter: ', error);
        setExpandAllResults(false);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [debounceQuery]);

  const groupedItems = useMemo(() => {
    if (!rfqsItemsFetched) return [];
    return groupItemsReportByRFQ(rfqsItemsFetched);
  }, [rfqsItemsFetched]);

  return (
    <article className={styles.mainContainer}>
      <section className={styles.header}>
        <h2 className={styles.headerTitle}>Seguimiento de compras</h2>
        <div className={styles.filtersContainer}>
          <article className={styles.globalFilter}>
            <input 
              type="text" 
              placeholder='Filtro global'
              className={styles.globalFilterInput}
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value.trimEnd().trimStart())}
            />
          </article>
        </div>
      </section>

      <section className={styles.dataContainer}>
        {loading  
          ? <CommonLoader />
          : <>          
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
                    <RowItem key={item.number} item={item} expandAll={expandAllResults} globalFilterValue={globalFilter} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.dataTablePaginator}>
              <button><i className='pi pi-caret-left'/></button>
              <button><i className='pi pi-caret-right'/></button>
            </div>
          </>
        }
      </section>
    </article>
  );
}