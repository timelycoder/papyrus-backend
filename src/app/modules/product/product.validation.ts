import { z } from 'zod'

const ProductValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Product name is required'),
    image: z.string().url('Image must be a valid URL'),
    brand: z.string().trim().min(1, 'Brand name is required'),
    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .positive({ message: 'Price must be a positive number' }),
    category: z.enum([
      'Writing Instruments',
      'Paper Products',
      'Art Supplies',
      'Educational',
    ]),
    description: z.string().trim().min(1, 'Description is required'),
    quantity: z
      .number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a number',
      })
      .int()
      .positive({ message: 'Quantity must be a positive number' }),
    inStock: z.boolean().default(true),
    isDeleted: z.boolean().default(false),
  }),
})
const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Product name is required').optional(),
    image: z.string().url('Image must be a valid URL').optional(),
    brand: z.string().trim().min(1, 'Brand name is required').optional(),
    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .positive({ message: 'Price must be a positive number' })
      .optional(),
    category: z
      .enum([
        'Writing Instruments',
        'Paper Products',
        'Art Supplies',
        'Educational',
      ])
      .optional(),
    description: z.string().trim().min(1, 'Description is required').optional(),
    quantity: z
      .number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a number',
      })
      .int()
      .optional(),
  }),
})
export const ProductValidation = {
  ProductValidationSchema,
  updateProductValidationSchema,
}
