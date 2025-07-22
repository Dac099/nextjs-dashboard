'use client';
import styles from './progressProyects.module.css';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta, DataTableValueArray } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { useState, useEffect, useMemo } from 'react';
import type { ProyectDataType } from '@/schemas/homeSchemas';
import { FilterMatchMode } from 'primereact/api';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { getProjects, getProjectTypes } from './actions';
import { InputText } from 'primereact/inputtext';
import { ExpandedRow } from './expandedRowOrder/expandedRowOrder';

export function ProgressProyects() {
  const [allProjects, setAllProjects] = useState<ProyectDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [proyectTypes, setProyectType] = useState<string[]>([]);
  const [emptyMessage, setEmptyMessage] = useState<string>('No hay proyectos registrados');
  const [startDateFilterValue, setStartDateFilterValue] = useState<Date | null>(null);
  const [endDateFilterValue, setEndDateFilterValue] = useState<Date | null>(null);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
  const [ filters, setFilters ] = useState<DataTableFilterMeta>({
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    name: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    createdBy: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    client: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    quoteNumber: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
    type: {value: null, matchMode: FilterMatchMode.EQUALS},
    id: {value: null, matchMode: FilterMatchMode.STARTS_WITH}
  });

  useEffect(() => {
    async function fetchData(){
      try {
        const [proyectsRes, typesRes] = await Promise.all([
          getProjects(),
          getProjectTypes()
        ]);

        setAllProjects(proyectsRes);
        setProyectType(typesRes);
      } catch (error) {
        console.error(error);
        setEmptyMessage('Error al cargar los proyectos');
        setAllProjects([]);
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
    if (
      _filters['global'] &&
      typeof _filters['global'] === 'object' &&
      'value' in _filters['global']
    ) {
      (_filters['global'] as { value: string | null }).value = value;
    }
    setFilters(_filters);
    setGlobalFilter(value);
  };

  // Función para convertir string de fecha a Date para comparación
  const parseSpanishDate = (dateInput: string | Date): Date | null => {
    if (!dateInput) return null;
    
    // Si ya es un Date, devolverlo
    if (dateInput instanceof Date) {
      return dateInput;
    }
    
    try {
      const months: { [key: string]: number } = {
        'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
      };
      
      const parts = dateInput.split(' ');
      if (parts.length < 3) return null;
      
      const day = parseInt(parts[0]);
      const month = months[parts[1].toLowerCase()];
      const year = parseInt(parts[2]);
      
      if (isNaN(day) || month === undefined || isNaN(year)) return null;
      
      const parsedDate = new Date(year, month, day);
      return parsedDate;
    } catch {
      return null;
    }
  };

  // Filtrar proyectos basado en las fechas seleccionadas
  const filteredProjects = useMemo(() => {
    let filtered = [...allProjects];

    if (startDateFilterValue) {
      filtered = filtered.filter(project => {
        const projectDate = parseSpanishDate(project.startDate);
        return projectDate && projectDate >= startDateFilterValue;
      });
    }

    if (endDateFilterValue) {
      filtered = filtered.filter(project => {
        const projectDate = parseSpanishDate(project.endDate);
        return projectDate && projectDate <= endDateFilterValue;
      });
    }

    return filtered;
  }, [allProjects, startDateFilterValue, endDateFilterValue]);

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

  const startDateFilterTemplate = () => {
    return (
      <Calendar 
        value={startDateFilterValue}
        onChange={e => {
          const dateValue = e.value;
          if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
            setStartDateFilterValue(dateValue);
          } else {
            setStartDateFilterValue(null);
          }
        }}
        dateFormat='dd/mm/yy'
        placeholder='Fecha desde'
        showIcon
      />
    );
  };

  const endDateFilterTemplate = () => {
    return (
      <Calendar 
        value={endDateFilterValue}
        onChange={e => {
          const dateValue = e.value;
          if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
            setEndDateFilterValue(dateValue);
          } else {
            setEndDateFilterValue(null);
          }
        }}
        dateFormat='dd/mm/yy'
        placeholder='Fecha hasta'
        showIcon
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
      value={filteredProjects} 
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
      onFilter={(e) => setFilters(e.filters)}
      expandedRows={expandedRows}
      onRowToggle={(e) => {
        setExpandedRows(e.data);
        console.log('Expanded Rows:', e.data);
      }}
      rowExpansionTemplate={data => <ExpandedRow rowData={data} />}
    >
      <Column 
        expander={proyect => proyect.orders.length > 0}
      />

      <Column 
        header="ID"
        field='id'
        style={columnStyles}
        filter
        showFilterMenu={false}
        filterPlaceholder='Filtra por ID'
      />

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
        filterElement={startDateFilterTemplate}
      />

      <Column 
        header="Fecha fin" 
        field='endDate'
        style={columnStyles}
        sortable
        filter
        showFilterMenu={false}
        filterField="endDate"
        filterElement={endDateFilterTemplate}
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