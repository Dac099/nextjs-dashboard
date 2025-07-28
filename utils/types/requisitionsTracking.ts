export type Requisition = {
  number: string;
  statusCode: string;
  sysStatusText: string;
  createdAt: Date;
  createdBy: string;
  type: string;
  purchaseItems: ItemReport[];  
};

export type ItemRequisition = {
  partNumber: string;
  description: string;
  projectId: string;
  machineType: string;
  rfqNumber: string;
  rfqType: string;
  createdBy: string;
  createdAt: Date;
  statusCode: string;
  sysStatusText: string;
}

export type SapRecord = {
  '#': string;
  'RFQ-Sys': string;
  'Fecha Orden': string;
  'Número Orden': string;
  'Código Proveedor': string;
  'Nombre Proveedor': string;
  'Proyecto': string;
  'Código de Artículo': string;
  'Numero de Fabricante': string;
  'Descripción Artículo': string;
  'Moneda Precio': string;
  'Precio Unitario (Orden)': string;
  'Cantidad Ordenada': string;
  'Importe Total Orden (ME)': string;
  'Importe Total Orden': string;
  'Fecha Recepción': string;
  'Número Recepción(es)': string;
  'Cantidad Recibida': string;
  'Importe Total Recibido': string;
  'Importe Total Recibido (ME)': string;
  'Fecha Factura': string;
  'Número Factura(s)': string;
  'Cantidad Facturada': string;
  'Importe Total Facturado': string;
  'Importe Total Facturado (ME)': string;
  'Cant. Pendiente Facturar': string;
  'Importe Pendiente Facturar': string;
  'Importe Pendiente Facturar (ME)': string;
  'Cant. Pendiente Recibir': string;
  'Importe Pendiente Recibir': string;
  'Importe Pendiente Recibir (ME)': string;
  '% Recibido (Importe)': string;
  '% Facturado (Importe)': string;
  '% Recibido (Cantidad)': string;
  '% Facturado (Cantidad)': string;
  'Estatus OC': string;
};

export type ItemReport = ItemRequisition & {
  sapPartNumber: string | null;
  sapDescription: string | null;
  poDate: Date | null;
  poQuantity: number | null;
  poStatus: string | null;
  warehouseTicket: string | null;
  warehouseTicketDate: Date | null;
  warehouseTicketQuantity: number | null;
  registerSap: number;
  stateText: string;
  supplier: string;
};

export type RFQsData = {
  items: ItemReport[];
  unmatchedSapItems: SapRecord[];
};