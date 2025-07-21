'use client';
import styles from './progressProyects.module.css';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { useState, useEffect } from 'react';
import type { ProyectDataType } from '@/schemas/homeSchemas';
import { proyectData } from '@/schemas/homeSchemas';
import { FilterMatchMode } from 'primereact/api';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { getProjects, getProjectTypes } from './actions';
import { InputText } from 'primereact/inputtext';
import { transformDateObjectToLocalString } from '@/utils/helpers';

export function ProgressProyects() {
  const [projects, setProjects] = useState<ProyectDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [proyectTypes, setProyectType] = useState<string[]>([]);
  const [emptyMessage, setEmptyMessage] = useState<string>('No hay proyectos registrados');
  const [ filters, setFilters ] = useState<DataTableFilterMeta>({
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    name: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    createdBy: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    startDate: {value: null, matchMode: FilterMatchMode.DATE_IS},
    endDate: {value: null, matchMode: FilterMatchMode.DATE_IS},
    client: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    quoteNumber: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    type: {value: null, matchMode: FilterMatchMode.EQUALS}
  });

  useEffect(() => {
    async function fetchData(){
      try {
        const [proyectsRes, typesRes] = await Promise.all([
          getProjects(),
          getProjectTypes()
        ]);

        setProjects(proyectsRes);
        setProyectType(typesRes);
      } catch (error) {
        console.error(error);
        setEmptyMessage('Error al cargar los proyectos');
        setProjects([]);
      } finally
      {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const columnStyles: React.CSSProperties = {
    fontSize: '1.3rem',
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilter(value);
  };

  const SelectProyectTypes = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <MultiSelect 
        value={options.value}
        options={proyectTypes}
        onChange={e => options.filterApplyCallback(e.value)}
        placeholder='Filtro por tipo'
        maxSelectedLabels={1}
      />
    );
  };

  const TableHeader = () => {
    return (
      <section className={styles.tableGlobalFilterContainer}>
        <InputText 
          placeholder='Filtro global'
          style={{ width: '300px', fontSize: '1.3rem' }}
          value={globalFilter}
          onChange={onGlobalFilterChange}
        />
      </section>
    );
  };

  return (
    <DataTable 
      value={projects} 
      paginator 
      rows={50}
      size='large'
      showGridlines
      stripedRows
      paginatorPosition='bottom'
      rowsPerPageOptions={[10, 30, 50, 100]}
      removableSort
      filters={filters}
      filterDisplay='row'
      loading={loading}
      globalFilterFields={['name', 'createdBy', 'client', 'quoteNumber']}
      emptyMessage={emptyMessage}
      header={<TableHeader />}
    >
      <Column 
        header="Nombre del proyecto" 
        field='name'
        style={columnStyles}
        sortable      
        filter  
        showFilterMenu={false}
        filterPlaceholder='Filtrar por nombre'
      />

      <Column 
        header="Tipo" 
        field='type'
        style={columnStyles}
        sortable
        showFilterMenu={false}
        filter
        filterElement={SelectProyectTypes}
        filterField="type"        
      />

      <Column 
        header="Creado por" 
        field='createdBy'
        style={columnStyles}
        sortable
        filter
        showFilterMenu={false}
        filterPlaceholder='Filtra por creador'
      />

      <Column 
        header="Fecha inicio" 
        field='startDate'
        style={columnStyles}
        sortable
        filter
        showFilterMenu={false}
        filterField="startDate"
      />

      <Column 
        header="Fecha fin" 
        field='endDate'
        style={columnStyles}
        sortable
        filter
        showFilterMenu={false}
        filterField="endDate"
      />

      <Column 
        header="Cliente" 
        field='client'
        style={columnStyles}
        sortable
        filter
        showFilterMenu={false}
        filterPlaceholder='Filtra por nombre de cliente'
      />

      <Column 
        header="Cotización" 
        field='quoteNumber'
        style={columnStyles}
        sortable
        filter
        showFilterMenu={false}
        filterPlaceholder='Filtra por cotización'
      />
    </DataTable>
  );
}