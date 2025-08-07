import { useState, useEffect, useCallback, useRef } from 'react';
import { SapReportRecord } from '@/utils/types/sapReports';
import { getSapReports, SapReportsFilters } from '@/app/(dashboard)/sap-reports/actions';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './tableDBData.module.css';

type Props = {
  initialData?: SapReportRecord[];
}

export function TableDBData({ initialData = [] }: Props) {
  const [data, setData] = useState<SapReportRecord[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const isInitialLoad = useRef(true);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const pageSize = 100;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const loadData = useCallback(async (page: number, globalFilter?: string) => {
    setLoading(true);
    try {
      const filters: SapReportsFilters = {};
      if (globalFilter && globalFilter.trim() !== '') {
        filters.global = globalFilter.trim();
      }
      
      const response = await getSapReports(page, pageSize, filters);
      setData(response.data);
      setTotalRecords(response.totalRecords);
    } catch (error) {
      console.error('Error loading data:', error);
      setData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // Cargar datos iniciales solo una vez
  useEffect(() => {
    if (initialData.length === 0 && isInitialLoad.current) {
      isInitialLoad.current = false;
      loadData(0);
    } else if (initialData.length > 0) {
      setData(initialData);
      setTotalRecords(initialData.length);
    }
  }, [initialData, loadData]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    
    // Limpiar timeout anterior
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    // Aplicar filtro global inmediatamente si está vacío, o después de un delay si tiene contenido
    if (value === '') {
      setCurrentPage(0);
      loadData(0, value);
    } else {
      // Crear nuevo timeout para debounce
      debounceTimeout.current = setTimeout(() => {
        setCurrentPage(0);
        loadData(0, value);
      }, 500);
    }
  };

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    loadData(newPage, globalFilterValue);
  };

  const dateBodyTemplate = (date: Date | null) => {
    return date ? new Date(date).toLocaleDateString('es-ES') : '-';
  };

  const currencyBodyTemplate = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  const numberBodyTemplate = (value: number) => {
    return new Intl.NumberFormat('es-ES').format(value);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // Botón anterior
    pages.push(
      <Button
        key="prev"
        icon="pi pi-chevron-left"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        outlined
        size="small"
        className={styles.paginationButton}
      />
    );

    // Páginas
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          label={(i + 1).toString()}
          onClick={() => handlePageChange(i)}
          className={styles.paginationButton}
          outlined={currentPage !== i}
          size="small"
        />
      );
    }

    // Botón siguiente
    pages.push(
      <Button
        key="next"
        icon="pi pi-chevron-right"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        outlined
        size="small"
        className={styles.paginationButtonNext}
      />
    );

    return (
      <div className={styles.paginationContainer}>
        <span className={styles.paginationInfo}>
          Mostrando {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalRecords)} de {totalRecords} registros
        </span>
        <div className={styles.paginationButtons}>
          {pages}
        </div>
      </div>
    );
  };

  return (
    <div className={`card ${styles.tableWrapper}`}>
      {/* Header con filtro global */}
      <div className={styles.headerContainer}>
        <h2 className={styles.headerTitle}>Reportes SAP</h2>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText 
            value={globalFilterValue} 
            onChange={onGlobalFilterChange} 
            placeholder="Búsqueda global" 
          />
        </IconField>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className={styles.loadingContainer}>
          <ProgressSpinner className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Cargando datos...</p>
        </div>
      )}

      {/* Tabla HTML nativa */}
      {!loading && (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th className={styles.tableHeaderCell}>#</th>
                  <th className={styles.tableHeaderCell}>RFQ Sys</th>
                  <th className={styles.tableHeaderCell}>Estado PO</th>
                  <th className={styles.tableHeaderCellMedium}>Estado Línea</th>
                  <th className={styles.tableHeaderCell}>Fecha Orden</th>
                  <th className={styles.tableHeaderCellMedium}>Número Orden</th>
                  <th className={styles.tableHeaderCellWide}>Proveedor</th>
                  <th className={styles.tableHeaderCellLarge}>Proyecto</th>
                  <th className={styles.tableHeaderCellMedium}>Código Item</th>
                  <th className={styles.tableHeaderCellMedium}>Código Fabricante</th>
                  <th className={styles.tableHeaderCellExtraWide}>Descripción</th>
                  <th className={styles.tableHeaderCellRight}>Moneda</th>
                  <th className={styles.tableHeaderCellRight}>Precio Unitario</th>
                  <th className={styles.tableHeaderCellRight}>Cantidad Ordenada</th>
                  <th className={styles.tableHeaderCellRight}>Importe Total Orden (ME)</th>
                  <th className={styles.tableHeaderCellRight}>Importe Total Orden</th>
                  <th className={styles.tableHeaderCellPromised}>Fecha Promesa Entrega</th>
                  <th className={styles.tableHeaderCell}>Fecha Recepción</th>
                  <th className={styles.tableHeaderCellRight}>Número Recepción</th>
                  <th className={styles.tableHeaderCellRight}>Cantidad Recibida</th>
                  <th className={styles.tableHeaderCellRight}>Cantidad Pendiente Recibir</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={23} className={styles.noDataCell}>
                      No se encontraron registros.
                    </td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <tr key={row.batchId + index} className={styles.tableRow}>
                      <td className={styles.tableCell}>{row.id || '-'}</td>
                      <td className={styles.tableCell}>{row.rfqSys || '-'}</td>
                      <td className={styles.tableCell}>{row.poStatus || '-'}</td>
                      <td className={styles.tableCell}>{row.lineStatus || '-'}</td>
                      <td className={styles.tableCell}>{dateBodyTemplate(row.orderDate)}</td>
                      <td className={styles.tableCell}>{row.orderNumber || '-'}</td>
                      <td className={styles.tableCell}>{row.vendorName || '-'}</td>
                      <td className={styles.tableCell}>{row.project || '-'}</td>
                      <td className={styles.tableCell}>{row.itemCode || '-'}</td>
                      <td className={styles.tableCell}>{row.manufacturerNumber || '-'}</td>
                      <td className={styles.tableCell}>{row.itemDescription || '-'}</td>
                      <td className={styles.tableCellRight}>{row.priceCurrency}</td>
                      <td className={styles.tableCellRight}>{currencyBodyTemplate(row.unitPrice)}</td>
                      <td className={styles.tableCellRight}>{numberBodyTemplate(row.orderedQuantity)}</td>
                      <td className={styles.tableCellRight}>{currencyBodyTemplate(row.totalOrderAmountFC)}</td>
                      <td className={styles.tableCellRight}>{currencyBodyTemplate(row.totalOrderAmount)}</td>
                      <td className={styles.tableCell}>{dateBodyTemplate(row.promisedDeliveryDate)}</td>
                      <td className={styles.tableCell}>{dateBodyTemplate(row.receivedDate)}</td>
                      <td className={styles.tableCellRight}>{row.receiptNumbers}</td>
                      <td className={styles.tableCellRight}>{numberBodyTemplate(row.receivedQuantity)}</td>
                      <td className={styles.tableCell}>{numberBodyTemplate(row.pendingReceiptQuantity)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalRecords > 0 && renderPagination()}
        </>
      )}
    </div>
  );
}