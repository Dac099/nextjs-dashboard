import { useState } from 'react';
import { SapReportRecord } from '@/utils/types/sapReports';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

type Props = {
  data: SapReportRecord[];
}

export function TableDBData({ data }: Props) {
  const [filters, setFilters] = useState({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
    rfqSys: { value: null, matchMode: FilterMatchMode.CONTAINS },
    poStatus: { value: null, matchMode: FilterMatchMode.CONTAINS },
    lineStatus: { value: null, matchMode: FilterMatchMode.CONTAINS },
    orderNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    vendorName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    project: { value: null, matchMode: FilterMatchMode.CONTAINS },
    itemCode: { value: null, matchMode: FilterMatchMode.CONTAINS },
    itemDescription: { value: null, matchMode: FilterMatchMode.CONTAINS },
    orderDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
    promisedDeliveryDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
    receivedDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
    invoiceDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <h2 className="m-0">Reportes SAP</h2>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText 
            value={globalFilterValue} 
            onChange={onGlobalFilterChange} 
            placeholder="Búsqueda global" 
          />
        </IconField>
      </div>
    );
  };

  const dateBodyTemplate = (rowData: SapReportRecord, field: keyof SapReportRecord) => {
    const date = rowData[field] as Date | null;
    return date ? new Date(date).toLocaleDateString('es-ES') : '-';
  };

  const currencyBodyTemplate = (rowData: SapReportRecord, field: keyof SapReportRecord) => {
    const value = rowData[field] as number;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const numberBodyTemplate = (rowData: SapReportRecord, field: keyof SapReportRecord) => {
    const value = rowData[field] as number;
    return new Intl.NumberFormat('es-ES').format(value);
  };

  const percentBodyTemplate = (rowData: SapReportRecord, field: keyof SapReportRecord) => {
    const value = rowData[field] as number;
    return `${value.toFixed(2)}%`;
  };

  const dateFilterTemplate = (options: { value: Date | null; filterApplyCallback: (value: Date | null) => void }) => {
    return (
      <Calendar 
        value={options.value} 
        onChange={(e) => options.filterApplyCallback(e.value ?? null)} 
        dateFormat="dd/mm/yy" 
        placeholder="dd/mm/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable 
        value={data} 
        paginator 
        rows={10} 
        rowsPerPageOptions={[10, 25, 50, 100]}
        dataKey="id"
        filters={filters} 
        filterDisplay="row"
        loading={false}
        globalFilterFields={[
          'rfqSys', 'poStatus', 'lineStatus', 'orderNumber', 'vendorName', 
          'project', 'itemCode', 'itemDescription', 'manufacturerNumber'
        ]}
        header={header}
        emptyMessage="No se encontraron registros."
        size="large"
      >
        <Column 
          field='id'
          header="ID"
          style={{ minWidth: '120px', fontSize: '1.2rem' }}
        />
        <Column 
          field="rfqSys" 
          header="RFQ Sys" 
          filter 
          filterPlaceholder="Buscar por RFQ" 
          style={{ minWidth: '120px', fontSize: '1.2rem' }}
        />
        <Column 
          field="poStatus" 
          header="Estado PO" 
          filter 
          filterPlaceholder="Buscar por estado" 
          style={{ minWidth: '120px', fontSize: '1.2rem' }}
        />
        <Column 
          field="lineStatus" 
          header="Estado Línea" 
          filter 
          filterPlaceholder="Buscar por estado línea" 
          style={{ minWidth: '140px', fontSize: '1.2rem' }}
        />
        <Column 
          field="orderDate" 
          header="Fecha Orden" 
          filter 
          filterElement={dateFilterTemplate}
          body={(rowData) => dateBodyTemplate(rowData, 'orderDate')}
          style={{ minWidth: '120px', fontSize: '1.2rem' }}
        />
        <Column 
          field="orderNumber" 
          header="Número Orden" 
          filter 
          filterPlaceholder="Buscar por número" 
          style={{ minWidth: '140px', fontSize: '1.2rem' }}
        />
        <Column 
          field="vendorName" 
          header="Proveedor" 
          filter 
          filterPlaceholder="Buscar por proveedor" 
          style={{ minWidth: '200px', fontSize: '1.2rem' }}
        />
        <Column 
          field="project" 
          header="Proyecto" 
          filter 
          filterPlaceholder="Buscar por proyecto" 
          style={{ minWidth: '150px', fontSize: '1.2rem' }}
        />
        <Column 
          field="itemCode" 
          header="Código Item" 
          filter 
          filterPlaceholder="Buscar por código" 
          style={{ minWidth: '140px', fontSize: '1.2rem' }}
        />
        <Column 
          field="itemDescription" 
          header="Descripción" 
          filter 
          filterPlaceholder="Buscar en descripción" 
          style={{ minWidth: '250px', fontSize: '1.2rem' }}
        />
        <Column 
          field="unitPrice" 
          header="Precio Unitario" 
          body={(rowData) => currencyBodyTemplate(rowData, 'unitPrice')}
          style={{ minWidth: '140px', fontSize: '1.2rem' }}
        />
        <Column 
          field="orderedQuantity" 
          header="Cantidad Ordenada" 
          body={(rowData) => numberBodyTemplate(rowData, 'orderedQuantity')}
          style={{ minWidth: '150px', fontSize: '1.2rem' }}
        />
        <Column 
          field="totalOrderAmount" 
          header="Total Orden" 
          body={(rowData) => currencyBodyTemplate(rowData, 'totalOrderAmount')}
          style={{ minWidth: '140px', fontSize: '1.2rem' }}
        />
        <Column 
          field="promisedDeliveryDate" 
          header="Fecha Entrega Prometida" 
          filter 
          filterElement={dateFilterTemplate}
          body={(rowData) => dateBodyTemplate(rowData, 'promisedDeliveryDate')}
          style={{ minWidth: '180px', fontSize: '1.2rem' }}
        />
        <Column 
          field="receivedDate" 
          header="Fecha Recepción" 
          filter 
          filterElement={dateFilterTemplate}
          body={(rowData) => dateBodyTemplate(rowData, 'receivedDate')}
          style={{ minWidth: '140px', fontSize: '1.2rem' }}
        />
        <Column 
          field="receivedQuantity" 
          header="Cantidad Recibida" 
          body={(rowData) => numberBodyTemplate(rowData, 'receivedQuantity')}
          style={{ minWidth: '150px', fontSize: '1.2rem' }}
        />
        <Column 
          field="totalReceivedAmount" 
          header="Total Recibido" 
          body={(rowData) => currencyBodyTemplate(rowData, 'totalReceivedAmount')}
          style={{ minWidth: '140px', fontSize: '1.2rem' }}
        />
        <Column 
          field="invoiceDate" 
          header="Fecha Factura" 
          filter 
          filterElement={dateFilterTemplate}
          body={(rowData) => dateBodyTemplate(rowData, 'invoiceDate')}
          style={{ minWidth: '140px', fontSize: '1.2rem' }}
        />
        <Column 
          field="invoicedQuantity" 
          header="Cantidad Facturada" 
          body={(rowData) => numberBodyTemplate(rowData, 'invoicedQuantity')}
          style={{ minWidth: '160px', fontSize: '1.2rem' }}
        />
        <Column 
          field="totalInvoicedAmount" 
          header="Total Facturado" 
          body={(rowData) => currencyBodyTemplate(rowData, 'totalInvoicedAmount')}
          style={{ minWidth: '140px', fontSize: '1.2rem' }}
        />
        <Column 
          field="receivedPercentAmount" 
          header="% Recibido (Monto)" 
          body={(rowData) => percentBodyTemplate(rowData, 'receivedPercentAmount')}
          style={{ minWidth: '160px', fontSize: '1.2rem' }}
        />
        <Column 
          field="invoicedPercentAmount" 
          header="% Facturado (Monto)" 
          body={(rowData) => percentBodyTemplate(rowData, 'invoicedPercentAmount')}
          style={{ minWidth: '160px', fontSize: '1.2rem' }}
        />
        <Column 
          field="receivedPercentQuantity" 
          header="% Recibido (Cantidad)" 
          body={(rowData) => percentBodyTemplate(rowData, 'receivedPercentQuantity')}
          style={{ minWidth: '170px', fontSize: '1.2rem' }}
        />
        <Column 
          field="invoicedPercentQuantity" 
          header="% Facturado (Cantidad)" 
          body={(rowData) => percentBodyTemplate(rowData, 'invoicedPercentQuantity')}
          style={{ minWidth: '170px', fontSize: '1.2rem' }}
        />
      </DataTable>
    </div>
  );
}