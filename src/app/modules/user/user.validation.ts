import { z } from 'zod'
import { USER_ROLE } from './user.constant'

const userValidationShcema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required!' })
      .trim()
      .min(1, 'Name cannot be empty or contain only spaces')
      .refine((value) => !/^\s*$/.test(value), {
        message: 'Name cannot contain only spaces',
      }),
    email: z.string({ required_error: 'Email is required.' }).email(),
    role: z
      .enum([...(Object.values(USER_ROLE) as [string, ...string[]])], {
        errorMap: () => ({
          message: 'Invalid role! Allowed roles are admin or user',
        }),
      })
      .optional(),
    password: z
      .string({ required_error: 'Password is required!' })
      .trim()
      .min(1, 'Password cannot be empty or only spaces')
      .refine((password) => !/^\s*$/.test(password), {
        message: 'Password cannot contain only spaces',
      }),
    address: z.string({ required_error: 'Password is required!' }).optional(),
  }),
})
const updateUserValidationShcema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required!' })
      .trim()
      .min(1, 'Name cannot be empty or contain only spaces')
      .refine((value) => !/^\s*$/.test(value), {
        message: 'Name cannot contain only spaces',
      })
      .optional(),
    email: z
      .string({ required_error: 'Email is required.' })
      .email()
      .optional(),
    role: z
      .enum([...(Object.values(USER_ROLE) as [string, ...string[]])], {
        errorMap: () => ({
          message: 'Invalid role! Allowed roles are admin or user',
        }),
      })
      .optional(),
    password: z
      .string({ required_error: 'Password is required!' })
      .trim()
      .min(1, 'Password cannot be empty or only spaces')
      .refine((password) => !/^\s*$/.test(password), {
        message: 'Password cannot contain only spaces',
      })
      .optional(),
    address: z.string({ required_error: 'Address is required!' }).optional(),
    phone: z.string({ required_error: 'Phone is required!' }).optional(),
    city: z.string({ required_error: 'City is required!' }).optional(),
  }),
})
export const UserValidation = {
  userValidationShcema,
  updateUserValidationShcema,
}
