import * as z from 'zod';

 export const PurchaseItem = z.object({
  purchaseNumber: z.string(),
  sapUser: z.string(),
  purchaseRequester: z.string(),
  sapUserName: z.string(),
  requestedDate: z.date(),
  number: z.string(),
  description: z.string(),
  measurementUnit: z.string(),
  rfqNumber: z.optional(z.string()),
  projectNumber: z.string(),
  quantity: z.number(),
  deliveryDate: z.date(),
  placementFolio: z.optional(z.string()),
  placementDate: z.optional(z.date()),
  placementQuantity: z.optional(z.number()),
});

