import { z } from 'zod'

export const prizeSchema = z.object({
  name: z.string()
    .min(1, 'Prize name is required')
    .max(255, 'Prize name must be less than 255 characters'),
  total_quantity: z.number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(10000, 'Quantity must be less than 10,000'),
  session_name: z.string()
    .min(1, 'Session name is required')
    .max(100, 'Session name must be less than 100 characters'),
  is_continue: z.boolean().default(false),
  group_no: z.number()
    .int('Group number must be a whole number')
    .min(1, 'Group number must be at least 1')
    .nullable()
    .optional(),
  order_no: z.number()
    .int('Order number must be a whole number')
    .min(1, 'Order number must be at least 1')
    .nullable()
    .optional(),
  random_sec: z.number()
    .min(0.1, 'Random seconds must be at least 0.1')
    .max(60, 'Random seconds must be less than 60')
    .nullable()
    .optional(),
  image_url: z.string().nullable().optional(),
})

export type PrizeInput = z.infer<typeof prizeSchema>
