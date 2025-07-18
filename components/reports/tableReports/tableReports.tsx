'use client';
import { FilteredEmployee } from '@/utils/types/projectDetail';
import { useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable, DataTableExpandedRows, DataTableValueArray, DataTableFilterMeta } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

// Interfaces para tipear las opciones de filtro
interface FilterOptions {
  value: string | null | undefined;
  filterApplyCallback: (value: string | null) => void;
}

type Props = {
  resources: FilteredEmployee[];
};

export function ResourcesTable({ resources }: Props) {
  const [expadedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    department: { value: null, matchMode: FilterMatchMode.EQUALS },
    position: { value: null, matchMode: FilterMatchMode.EQUALS }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  // Obtener valores únicos para los dropdowns
  const uniqueDepartments = [...new Set(resources.map(r => r.department))].map(dept => ({ label: dept, value: dept }));
  const uniquePositions = [...new Set(resources.map(r => r.position))].map(pos => ({ label: pos, value: pos }));

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      department: { value: null, matchMode: FilterMatchMode.EQUALS },
      position: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    setGlobalFilterValue('');
  };

  // Templates para los filtros de columna
  const nameFilterTemplate = (options: FilterOptions) => {
    return (
      <InputText
        value={options.value ?? ''}
        onChange={(e) => options.filterApplyCallback(e.target.value || null)}
        placeholder="Buscar por nombre..."
        style={{ width: '100%' }}
      />
    );
  };

  const departmentFilterTemplate = (options: FilterOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={uniqueDepartments}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Seleccionar departamento"
        showClear
        style={{ width: '100%' }}
      />
    );
  };

  const positionFilterTemplate = (options: FilterOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={uniquePositions}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Seleccionar posición"
        showClear
        style={{ width: '100%' }}
      />
    );
  };

  // Header global con filtro global
  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={clearFilters}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Limpiar Filtros
        </button>
        <InputText
          value={globalFilterValue}
          onChange={(e) => setGlobalFilterValue(e.target.value)}
          placeholder="Búsqueda global..."
          style={{ width: '300px' }}
        />
      </div>
    );
  };

  const columnStyle: React.CSSProperties = {
    fontSize: '1.3rem'
  };

  const tagStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    fontSize: '1.3rem',
  };

  const assignedItemsBody = (employee: FilteredEmployee) => {
    return (
      <Tag 
        style={tagStyle}
        severity={employee.assignedItems.length > 0 ? 'success' : 'warning'}
        value={employee.assignedItems.length > 0 ? employee.assignedItems.length : 'No Asignados'}
      />
    );
  };

  const allowExpand = (employee: FilteredEmployee) => {
    return employee.assignedItems.length > 0;
  };

  const expandedRowsBody = (employee: FilteredEmployee) => {
    return (
      <DataTable
        value={employee.assignedItems}
        stripedRows
      >
        <Column header='Item asignado' field='itemName' style={columnStyle} />
      </DataTable>
    );
  } 
 
  return (
    <DataTable 
      value={resources}
      size='large'
      stripedRows
      onRowToggle={e => setExpandedRows(e.data)}
      expandedRows={expadedRows}
      rowExpansionTemplate={expandedRowsBody}
      filters={filters}
      onFilter={(e) => setFilters(e.filters)}
      globalFilterFields={['name', 'department', 'position']}
      globalFilter={globalFilterValue}
      header={renderHeader()}
      filterDisplay="row"
      emptyMessage="No se encontraron recursos"
    >
      <Column expander={allowExpand} />
      <Column 
        header='Nombre' 
        field='name' 
        style={columnStyle}
        filter
        filterPlaceholder="Buscar por nombre"
        filterElement={nameFilterTemplate}
        showFilterMenu={false}
        filterMatchMode="contains"
      />
      <Column 
        header='Departamento' 
        field='department' 
        style={columnStyle}
        filter
        filterElement={departmentFilterTemplate}
        showFilterMenu={false}
        filterMatchMode="equals"
      />
      <Column 
        header='Posición' 
        field='position' 
        style={columnStyle}
        filter
        filterElement={positionFilterTemplate}
        showFilterMenu={false}
        filterMatchMode="equals"
      />
      <Column header='Items Asignados' body={assignedItemsBody} style={columnStyle}/>
    </DataTable>
  );
}