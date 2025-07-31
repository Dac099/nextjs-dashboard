export type Requisition = {
  number: string;
  statusCode: string;
  sysStatusText: string;
  createdAt: Date;
  createdBy: string;
  type: string;
  purchaseItems: ItemReport[];  
};

export type ItemReport = {
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
  sapPartNumber: string | null;
  sapDescription: string | null;
  poDate: Date | null;
  deliveryDate: Date | null;
  poQuantity: number | null;
  poStatus: string | null;
  poNumber: string | null;
  warehouseTicket: string | null;
  warehouseTicketDate: Date | null;
  warehouseTicketQuantity: number | null;
  supplier: string | null;
  sapRfq: string | null;
};

export type AdvancedFilter = {
  origin: string;
  column: string;
  operator: string;
  userInput: string | Date | Date[];
}