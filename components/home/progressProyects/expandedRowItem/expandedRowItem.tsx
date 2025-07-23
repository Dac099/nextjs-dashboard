'use client';
import { PurchaseOrderType, PurchaseItemType } from '@/schemas/homeSchemas';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

type Props = {
  itemOrder: PurchaseOrderType
};

export function ExpandedRowItem({ itemOrder }: Props) {

  const columnStyles: React.CSSProperties = {
    fontSize: '1.2rem',
  };
  
  const PlacementFolioTag = (rowData: PurchaseItemType) => {
    return (
      <Tag 
        severity={rowData.placementFolio ? 'success' : 'danger'}
        value={rowData.placementFolio || 'Sin Entrega'}
        style={{ fontSize: '1.2rem', width: '100%' }}
      />
    );
  }

  const PlacementDate = (rowData: PurchaseItemType) => {
    return (
      <Tag 
        severity={rowData.placementDate ? 'success' : 'danger'}
        value={rowData.placementDate || 'Sin Entrega'} 
        style={{ fontSize: '1.2rem', width: '100%' }}     
      />
    );
  }

  const PlacementQuantity = (rowData: PurchaseItemType) => {  
    return (
      <Tag 
        severity={rowData.placementQuantity && rowData.placementQuantity !== '0.0000' ? 'success' : 'danger'}
        value={rowData.placementQuantity ? parseFloat(rowData.placementQuantity ) : 'Sin Entrega'}   
        style={{ fontSize: '1.2rem', width: '100%' }}   
      />
    );
  }

  const PurchaseRequest = (rowData: PurchaseItemType) => {
    return (
      <Tag 
        severity={rowData.requestedPurchase ? 'success' : 'danger'}
        value={rowData.requestedPurchase || 'Sin Solicitud'}  
        style={{ fontSize: '1.2rem', width: '100%' }}    
      />
    );
  }

  return (
    <DataTable
      value={itemOrder.items}
      showGridlines
      stripedRows      
    >
      <Column 
        header='Número de parte'
        field='number'
        style={columnStyles}
      />
      <Column 
        header='Descripción'
        field='description'
        style={columnStyles}
      />
      <Column 
        header='Proveedor'
        field='supplier'
        style={columnStyles}
      />
      <Column 
        header='Cantidad solicitada'
        field='quantity'
        style={columnStyles}                
      />
      <Column 
        header='Unidad de medida'
        field='measurementUnit'
        style={columnStyles}
      />
      <Column 
        header='Orden de compra'
        body={PurchaseRequest}
        style={columnStyles}
      />
      <Column 
        header='Folio de entrada'
        body={PlacementFolioTag}
        style={columnStyles}
      />
      <Column 
        header='Fecha de entrada'
        body={PlacementDate}
        style={columnStyles}
      />
      <Column 
        header='Cantidad de entrada'
        body={PlacementQuantity}
        style={columnStyles}
      />
    </DataTable>
  );
}