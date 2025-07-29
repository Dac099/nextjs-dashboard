'use client';
import styles from './progressProyects.module.css';
import { getRFQsData, getTotalItemsFromRequisition } from './actions';
import { useEffect, useState, useMemo, useRef } from 'react';
import { ItemReport } from '@/utils/types/requisitionsTracking';
import { CommonLoader } from '@/components/common/commonLoader/commonLoader';
import { groupItemsReportByRFQ } from '@/utils/helpers';
import { RowItem } from './rowItem/rowItem';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { AdvanceFilter } from './advanceFilter/advanceFilter';

const ITEMS_PER_PAGE = 100;

export function ProgressProyects() {
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const [rfqsItemsFetched, setRfqsItemsFetched] = useState<ItemReport[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const debounceQuery = useDebounce(globalFilter, 300);
  const [ expandAllResults, setExpandAllResults ] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const skip = currentPage * ITEMS_PER_PAGE;
        const [rfqsData, totalItemsCount] = await Promise.all([ 
          getRFQsData(skip, ITEMS_PER_PAGE), 
          getTotalItemsFromRequisition(), 
        ]);

        setRfqsItemsFetched(rfqsData.items);        
        setTotalItems(totalItemsCount);
      } catch (error) {
        console.error('Fetching RFQs data BAD RESULT: ', error);
      }finally {
        setLoading(false);
      }
    } 

    if (!debounceQuery) {
      fetchData();
    }
  }, [currentPage, debounceQuery]);

  useEffect(() => {
    if(!debounceQuery) {
      setExpandAllResults(false);
      if (currentPage !== 0) {
        setCurrentPage(0);
      }
      return;
    }

    async function getData() {
      try {
        setLoading(true);
        
        const [rfqsData, totalItemsCount] = await Promise.all([ 
          getRFQsData(0, ITEMS_PER_PAGE, debounceQuery), 
          getTotalItemsFromRequisition(debounceQuery),
        ]);

        setTotalItems(totalItemsCount);
        setRfqsItemsFetched(rfqsData.items);

        if( rfqsData.items.length > 0) {
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
  }, [debounceQuery, currentPage]);

  const groupedItems = useMemo(() => {
    if (!rfqsItemsFetched) return [];
    return groupItemsReportByRFQ(rfqsItemsFetched);
  }, [rfqsItemsFetched]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const isNextButtonDisabled = useMemo(() => {
    if (debounceQuery) return true;
    return (currentPage + 1) * ITEMS_PER_PAGE >= totalItems;
  }, [currentPage, totalItems, debounceQuery]);

  const isPreviousButtonDisabled = useMemo(() => {
    if (debounceQuery) return true;
    return currentPage === 0;
  }, [currentPage, debounceQuery]);

  return (
    <article className={styles.mainContainer}>
      <section className={styles.header}>
        <h2 className={styles.headerTitle}>Seguimiento de compras</h2>
        <div className={styles.filtersContainer}>
          <article className={styles.advancedFilter}>
            <Button 
              label='Filtro avanzado'
              icon='pi pi-filter'
              style={{
                fontSize: '1.3rem',
              }}
              onClick={e => overlayPanelRef.current?.toggle(e)}
            />          
          </article>

          <article className={styles.globalFilter}>
            <input 
              type="text" 
              placeholder='Filtro global'
              className={styles.globalFilterInput}
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value.trimEnd().trimStart())}
            />           
            
             <Button 
              outlined
              icon='pi pi-trash'
              severity='danger'
              disabled={!globalFilter}
              onClick={() => {
                setGlobalFilter('');
                setExpandAllResults(false);
                setCurrentPage(0);
              }}
              title='Limpiar filtro global'
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
                    <th>Estado General</th>
                    <th>Estado RFQ</th>
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
              <section>
                <Button 
                  label={`Total de RFQs: ${totalItems}`} 
                  text
                  raised
                  severity='help'
                  disabled={true}
                />
                <Button 
                  label={`Pág. ${currentPage + 1} de ${Math.ceil(totalItems / ITEMS_PER_PAGE)}`}
                  text
                  raised
                  severity='help'
                  disabled
                />
              </section>
              <section>
                <Button 
                  icon='pi pi-angle-left'
                  outlined                  
                  onClick={handlePreviousPage}
                  disabled={isPreviousButtonDisabled}
                  title='Página Anterior'
                />

                <Button 
                  icon='pi pi-angle-right'
                  outlined
                  onClick={handleNextPage}
                  disabled={isNextButtonDisabled}
                  title='Página Siguiente'
                />
              </section>
            </div>
          </>
        }
      </section>
        <OverlayPanel
          ref={overlayPanelRef}
          className={styles.overlayPanel}
          showCloseIcon
          draggable={false}          
        >
          <AdvanceFilter />
        </OverlayPanel>
    </article>
  );
}