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
  'SOL#': string;
  Usuario: string;
  Solicitante: string;
  NombreUsr: string;
  FechaSOL: string;
  ProveedorSol: string;
  NombreProvSol: string;
  'Número de artículo': string;
  Descripcion: string;
  UM: string;
  RFQSys: string;
  Proyecto: string;
  CantSolicitada: string;
  'Cot#': string;
  FechaCot: string;
  CantCot: string;
  'OC#': string;
  CodProvOC: string;
  ProvOC: string;
  FechaOC: string;
  CantOC: string;
  CantPendRec: string;
  ProyOC: string;
  FechaPromesa: string;
  'EM#': string;
  FechaEM: string;
  CantEM: string;
  Almacen: string;
  ProyEM: string;
  'FP#': string;
  FechaFP: string;
  CantFacturada: string;
  ProyFP: string;
};

export type ItemReport = ItemRequisition & {
  sapPartNumber: string | null;
  sapDescription: string | null;
  sapUM: string | null;
  poDate: Date | null;
  poQuantity: number | null;
  deliveryDate: Date | null;
  warehouseTicket: string | null;
  warehouseTicketDate: Date | null;
  warehouseTicketQuantity: number | null;
  warehouse: string | null;
  registerSap: number;
  stateText: string;
};

export type RFQsData = {
  items: ItemReport[];
  unmatchedSapItems: SapRecord[];
};