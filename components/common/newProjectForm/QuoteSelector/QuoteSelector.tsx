import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useDebounce } from '@/hooks/useDebounce';
import { getQuotesForProyect, getTotalQuotes } from '@/actions/projectDetail';
import type { QuoteItem } from '@/utils/types/projectDetail';
import styles from './QuoteSelector.module.css';

type Props = {
  onQuoteSelect: (quote: QuoteItem | null) => void;
  selectedQuote: QuoteItem | null;
  onNextStep: () => void;
  onCancel: () => void;
};

export function QuoteSelector({ onQuoteSelect, selectedQuote, onNextStep, onCancel }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 30,
    page: 0
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Función para cargar quotes con paginación
  const loadQuotes = async (page: number, pageSize: number, filterValue: string | null = null) => {
    try {
      setLoading(true);
      const offset = page * pageSize;
      const [quotesData, total] = await Promise.all([
        getQuotesForProyect(offset, pageSize, filterValue),
        getTotalQuotes(filterValue)
      ]);

      setQuotes(quotesData);
      setTotalRecords(total);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejador de eventos de paginación
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPage = (event: any) => {
    const page = event.page !== undefined ? event.page : Math.floor(event.first / event.rows);
    
    const newLazyState = { 
      ...lazyState, 
      first: event.first,
      rows: event.rows,
      page: page
    };
    setLazyState(newLazyState);
    
    loadQuotes(page, event.rows, debouncedSearchTerm || null);
  };

  useEffect(() => {
    loadQuotes(lazyState.page, lazyState.rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Efecto para filtrar cotizaciones cuando cambia el término de búsqueda debounced
  useEffect(() => {
    // Resetear la paginación al buscar
    const newLazyState = { ...lazyState, first: 0, page: 0 };
    setLazyState(newLazyState);
    
    loadQuotes(0, lazyState.rows, debouncedSearchTerm || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]); // Solo cuando cambie el término de búsqueda

  return (
    <article className={styles.formStep}>
      <div className={styles.searchContainer}>
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filtrar ..."
          className={styles.searchInput}
        />
        {searchTerm !== debouncedSearchTerm && 
          <i className={`pi pi-spinner pi-spin ${styles.spinner}`} />
        }
      </div>
      
      <DataTable
        value={quotes}
        lazy
        dataKey="id"
        paginator
        first={lazyState.first}
        rows={lazyState.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        selection={selectedQuote}
        onSelectionChange={(e) => onQuoteSelect(e.value as QuoteItem)}
        selectionMode="single"
        emptyMessage="No se encontraron cotizaciones"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
        size='large'
        tableClassName={styles.dataTable}
        stripedRows
      >
        <Column 
          field="quote" 
          sortable
          headerClassName={styles.tableHeader}
          header="Cotización"
        />
        <Column 
          field="proyectName" 
          header="Proyecto" 
          sortable 
          headerClassName={styles.tableHeader}
        />
        <Column 
          field="revision" 
          header="Revisión" 
          sortable 
          headerClassName={styles.tableHeader}
        />
        <Column 
          field="clientName" 
          header="Cliente" 
          sortable 
          headerClassName={styles.tableHeader}
        />
      </DataTable>
      
      <div className={styles.buttonContainer}>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          className={`p-button-text ${styles.actionBtn}`}
          onClick={onCancel}
        />          
        <Button
          label="Siguiente"
          icon="pi pi-arrow-right"
          iconPos="right"
          className={styles.actionBtn}
          disabled={!selectedQuote}
          onClick={onNextStep}
        />
      </div>
    </article>
  );
}
