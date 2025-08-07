'use client';
import styles from './tableData.module.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatFileData } from '@/utils/helpers';
import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';

type Props = {
  data: string;
};

export function TableData({ data }: Props) {
  const LOCAL_STORAGE_KEY = 'visibleColumnsIndices';
  const parsedData = formatFileData(data);
  const [header] = useState(parsedData[0]);
  const [items] = useState(parsedData.slice(1));
  const [filters, setFilters] = useState(getFilters(header));
  const [globalFilter, setGlobalFilter] = useState('');
  const columns = header.map((col, index) => ({ field: index.toString(), header: col }));

  // Inicializar visibleColumns con todos los valores para evitar el error de componente no controlado
  const [visibleColumns, setVisibleColumns] = useState<typeof columns>(columns);
  const isFirstRender = React.useRef(true);

  // Cargar columnas visibles desde localStorage al inicializar el componente
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      try {
        const storedColumnIndices = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedColumnIndices) {
          const indices = JSON.parse(storedColumnIndices) as string[];
          // Verificar que los índices existan en las columnas actuales
          const availableColumns = columns.filter(col => indices.includes(col.field));

          if (availableColumns.length > 0) {
            setVisibleColumns(availableColumns);
          } else {
            // Si no hay coincidencias, guardar las columnas actuales en localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(columns.map(col => col.field)));
          }
        } else {
          // Si no hay nada guardado, inicializar localStorage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(columns.map(col => col.field)));
        }
      } catch (error) {
        console.error('Error al cargar columnas visibles del localStorage:', error);
      }
    }
  }, [columns]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
    const _filters = { ...filters };
    _filters['global'] = { value, matchMode: FilterMatchMode.CONTAINS };
    setFilters(_filters);
  };

  const onToggleColumnVisibility = (e: MultiSelectChangeEvent) => {
    try {
      const selectedColumns = e.value;
      const orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol: { field: string; header: string }) => sCol.field === col.field));
      setVisibleColumns(orderedSelectedColumns);

      // Guardar los índices de las columnas visibles en localStorage
      const columnIndices = orderedSelectedColumns.map(col => col.field);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(columnIndices));
    } catch (error) {
      console.error('Error al guardar columnas visibles en localStorage:', error);
    }
  };

  const renderHeader = () => {
    return (
      <section className={styles.headerContainer}>
        <MultiSelect
          value={visibleColumns}
          options={columns}
          optionLabel="header"
          onChange={onToggleColumnVisibility}
          style={{ width: '400px' }}
          display="chip"
        />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={onGlobalFilterChange}
            placeholder="Busca registros"
          />
        </IconField>
      </section>
    );
  };

  return (
    <article className={styles.mainContainer}>
      <div className={styles.tableContainer}>
        <DataTable
          size='large'
          showGridlines
          stripedRows
          value={items}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
          removableSort
          globalFilterFields={header.map((_, index) => index.toString())}
          header={renderHeader()}
          emptyMessage="No se encontraron registros"
          filters={filters}
          columnResizeMode="expand"
          scrollable
          scrollHeight="flex"
        >
          {visibleColumns.map((col, index) => (
            <Column
              field={col.field}
              header={col.header}
              key={index}
              sortable
              style={{ minWidth: '150px', fontSize: '1.2rem' }}
            />
          ))}
        </DataTable>
      </div>
    </article>
  );
}

function getFilters(header: string[]) {
  return header.reduce((res, _, index) => {
    res[index.toString()] = {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    };
    return res;
  }, {} as Record<string, { value: string | null; matchMode: FilterMatchMode }>);
}
