'use client';
import styles from './tableData.module.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatFileData } from '@/utils/helpers';
import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

type Props = {
  data: string;
};

export function TableData({ data }: Props){
  const parsedData = formatFileData(data);
  const header = parsedData[0];
  const [items] = useState(parsedData.slice(1));
  const [filters, setFilters] = useState(getFilters(header));
  const [globalFilter, setGlobalFilter] = useState('');

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
    const _filters = { ...filters };
    _filters['global'] = { value, matchMode: FilterMatchMode.CONTAINS };
    setFilters(_filters);
  };

  const renderHeader = () => {
    return (
      <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText 
            value={globalFilter} 
            onChange={onGlobalFilterChange} 
            placeholder="Busca registros" 
          />
      </IconField>
    );
  }

  return (
    <article className={styles.mainContainer}>
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
        resizableColumns
        columnResizeMode="expand"
        tableStyle={{ maxWidth: '100%', overflowX: 'hidden' }}
      >
        {header.map((col, index) => (
          <Column 
            field={index.toString()}
            header={col}
            key={index}
            sortable
            style={{ minWidth: '120px', fontSize: '1.2rem' }}
          />
        ))}
      </DataTable>
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