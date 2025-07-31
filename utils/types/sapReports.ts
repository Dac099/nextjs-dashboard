export type SapReportRecord = {
  rfqSys: string | null;
  poStatus: string | null;
  lineStatus: string | null;
  orderDate: Date | null;
  orderNumber: string | null;
  vendorCode: string | null;
  vendorName: string | null;
  project: string | null;
  itemCode: string | null;
  manufacturerNumber: string | null;
  itemDescription: string | null;
  priceCurrency: string | null;
  unitPrice: number;
  orderedQuantity: number;
  totalOrderAmountFC: number;
  totalOrderAmount: number;
  promisedDeliveryDate: Date | null;
  receivedDate: Date | null;
  receiptNumbers: string | null;
  receivedQuantity: number;
  totalReceivedAmount: number;
  totalReceivedAmountFC: number;
  invoiceDate: Date | null;
  invoiceNumbers: string | null;
  invoicedQuantity: number;
  totalInvoicedAmount: number;
  totalInvoicedAmountFC: number;
  pendingInvoiceQuantity: number;
  pendingInvoiceAmount: number;
  pendingInvoiceAmountFC: number;
  pendingReceiptQuantity: number;
  pendingReceiptAmount: number;
  pendingReceiptAmountFC: number;
  receivedPercentAmount: number;
  invoicedPercentAmount: number;
  receivedPercentQuantity: number;
  invoicedPercentQuantity: number;
  batchId: string;
}

/**
 * Type for API response when uploading SAP reports
 */
export interface SapReportUploadResponse {
  success: boolean;
  message: string;
  filename: string;
  size: number;
  batchId: string;
}

/**
 * Type for API error response
 */
export interface SapReportErrorResponse {
  error: string;
  details: string;
  suggestion: string;
}
