'use client';
import { ProyectDataType } from '@/schemas/homeSchemas';
import { DataTable, DataTableExpandedRows, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { ExpandedRowItem } from '../expandedRowItem/expandedRowItem';

type Props = {
  rowData: ProyectDataType
};

export function ExpandedRow({ rowData }: Props) {
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);

  const columnStyles: React.CSSProperties = {
    fontSize: '1.2rem',
  };

  return (
    <DataTable
      value={rowData.orders}
      showGridlines
      stripedRows
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      rowExpansionTemplate={data => <ExpandedRowItem itemOrder={data} />}
    >
      <Column 
        expander={order => order.items.length > 0}
      />
      <Column 
        header='Solicitud de compra'
        field='purchaseNumber'
        sortable
        filter
        showFilterMenu={false}
        filterPlaceholder=''
        style={columnStyles}
      />
      <Column 
        header='Creado por'
        field='sapUser'
        sortable
        filter
        showFilterMenu={false}
        filterPlaceholder=''
        style={columnStyles}
      />
      <Column 
        header='Nombre de usuario'
        field='sapUserName'
        sortable
        filter
        showFilterMenu={false}
        filterPlaceholder=''
        style={columnStyles}
      />
      <Column 
        header='Solicitante'
        field='purchaseRequester'
        sortable
        filter
        showFilterMenu={false}
        filterPlaceholder=''
        style={columnStyles}
      />
      <Column 
        header='Fecha solicitud'
        field='requestedDate'
        sortable
        filter
        showFilterMenu={false}
        filterPlaceholder=''
        style={columnStyles}
      />
      <Column 
        header='Fecha promesa'
        field='deliveryDate'
        sortable
        filter
        showFilterMenu={false}
        filterPlaceholder=''
        style={columnStyles}
      />
      <Column 
        header='RFQ'
        field='rfqNumber'
        sortable
        filter
        showFilterMenu={false}
        filterPlaceholder=''
        style={columnStyles}
      />
    </DataTable>
  );
}