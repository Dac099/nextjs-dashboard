'use client';
import styles from './progressProyects.module.css';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | undefined>(undefined);
  const [ filters, setFilters ] = useState<DataTableFilterMeta>({
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
        console.log('Projects loaded:', proyectsRes);
        console.log('Sample project structure:', proyectsRes[0]);
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

  // Función personalizada para filtro global que incluye datos anidados
  const customGlobalFilter = (value: ProyectDataType, filter: string): boolean => {
    if (!filter) return true;
    
    const filterLower = filter.toLowerCase();
    
    // Buscar en campos principales del proyecto
    const mainFields = [
      value.id,
      value.name,
      value.createdBy,
      value.type,
      value.client,
      value.quoteNumber,
      value.startDate,
      value.endDate
    ];
    
    const mainFieldsMatch = mainFields.some(field => {
      const fieldMatch = field?.toString().toLowerCase().includes(filterLower);
      if (fieldMatch) {
        console.log('✅ Match found in main field:', field, 'for project:', value.id);
      }
      return fieldMatch;
    });
    
    if (mainFieldsMatch) {
      return true;
    }
    
    // Si no hay coincidencias en campos principales, buscar en orders (si las hay)
    if (!value.orders || value.orders.length === 0) {
      return false;
    }
    
    // Buscar en orders y sus campos
    const ordersMatch = value.orders.some(order => {
      const orderFields = [
        order.purchaseNumber,
        order.sapUser,
        order.purchaseRequester,
        order.sapUserName,
        order.requestedDate,
        order.rfqNumber,
        order.projectNumber,
        order.deliveryDate
      ];
      
      const orderFieldsMatch = orderFields.some(field => {
        const fieldMatch = field?.toString().toLowerCase().includes(filterLower);
        if (fieldMatch) {
          console.log('✅ Match found in order field:', field, 'for project:', value.id);
        }
        return fieldMatch;
      });
      
      if (orderFieldsMatch) return true;
      
      // Buscar en items de cada order
      if (!order.items || order.items.length === 0) {
        return false;
      }
      
      const itemsMatch = order.items.some(item => {
        const itemFields = [
          item.number,
          item.description,
          item.measurementUnit,
          item.quantity,
          item.placementFolio,
          item.placementDate,
          item.placementQuantity
        ];
        
        return itemFields.some(field => {
          const fieldMatch = field?.toString().toLowerCase().includes(filterLower);
          if (fieldMatch) {
            console.log('✅ Match found in item field:', field, 'for project:', value.id);
          }
          return fieldMatch;
        });
      });
      
      return itemsMatch;
    });
    
    return ordersMatch;
  };

  const onGlobalFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
  }, []);

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

    // Aplicar filtro global personalizado
    if (globalFilter) {
      filtered = filtered.filter(project => 
        customGlobalFilter(project, globalFilter)
      );
    }

    return filtered;
  }, [allProjects, startDateFilterValue, endDateFilterValue, globalFilter]);

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

  const TableHeader = useMemo(() => (
    <section className={styles.tableGlobalFilterContainer}>
      <InputText 
        placeholder='Buscar en proyectos, órdenes e items...'
        style={{ width: '400px', fontSize: '1.3rem' }}
        value={globalFilter}
        onChange={onGlobalFilterChange}
      />
    </section>
  ), [globalFilter, onGlobalFilterChange]);

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
      emptyMessage={emptyMessage}
      header={TableHeader}
      onFilter={(e) => setFilters(e.filters)}
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
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