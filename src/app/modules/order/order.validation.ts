import { z } from 'zod'

const createOrderValidationSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    products: z.array(
      z
        .object({
          productId: z.string(),
          quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        })
        .optional(),
    ),
    totalAmount: z.number().optional(),
    status: z
      .enum(['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'])
      .default('Pending'),
    orderDate: z.string().optional(),
  }),
})
export const OrderValidationSchema = {
  createOrderValidationSchema,
}
