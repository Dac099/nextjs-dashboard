import * as z from 'zod';

export const PurchaseItem = z.object({
  number: z.string(),
  description: z.string(),
  measurementUnit: z.string(),
  quantity: z.number(),
  placementFolio: z.optional(z.string()),
  placementDate: z.optional(z.date()),
  placementQuantity: z.optional(z.number()),
});

export type PurchaseItemType = z.infer<typeof PurchaseItem>;

export const PurchaseOrder = z.object({
  purchaseNumber: z.string(),
  sapUser: z.string(),
  purchaseRequester: z.string(),
  sapUserName: z.string(),
  requestedDate: z.date(),
  rfqNumber: z.optional(z.string()),
  projectNumber: z.string(),
  deliveryDate: z.date(),  
  items: z.array(PurchaseItem),
});

export type PurchaseOrderType = z.infer<typeof PurchaseOrder>;

export const Requisition = z.object({
  number: z.string(),
  createdBy: z.string(),
  authorDepartment: z.string(),
  createdAt: z.date(),
  purchases: z.array(PurchaseOrder),
});

export type RequisitionType = z.infer<typeof Requisition>;

export const proyectData  = z.object({
  id: z.string(),
  name: z.string(),
  createdBy: z.string(),
  type: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  quoteNumber: z.string(),
  client: z.string(),
  requisitions: z.array(Requisition),
});

export type ProyectDataType = z.infer<typeof proyectData>;