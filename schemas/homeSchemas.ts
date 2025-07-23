import * as z from 'zod';

export const PurchaseItem = z.object({
  number: z.string(),
  description: z.string(),
  measurementUnit: z.string(),
  quantity: z.string(),
  placementFolio: z.optional(z.string()),
  placementDate: z.optional(z.string()),
  placementQuantity: z.optional(z.string()),
  requestedPurchase: z.optional(z.string()),
  supplier: z.optional(z.string()),
});

export type PurchaseItemType = z.infer<typeof PurchaseItem>;

export const PurchaseOrder = z.object({
  purchaseNumber: z.string(),
  sapUser: z.string(),
  purchaseRequester: z.string(),
  sapUserName: z.string(),
  requestedDate: z.string(),
  rfqNumber: z.optional(z.string()),
  projectNumber: z.string(),
  deliveryDate: z.string(),
  items: z.array(PurchaseItem),
});

export type PurchaseOrderType = z.infer<typeof PurchaseOrder>;

export const proyectData  = z.object({
  id: z.string(),
  name: z.string(),
  createdBy: z.string(),
  type: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  quoteNumber: z.string(),
  client: z.string(),
  orders: z.array(PurchaseOrder),
});

export type ProyectDataType = z.infer<typeof proyectData>;