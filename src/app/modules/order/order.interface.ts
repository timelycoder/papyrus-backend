import { Types } from 'mongoose'

export type TOrder = {
  userId?: Types.ObjectId
  products: {
    productId: Types.ObjectId
    quantity: number
  }[]
  // quantity: number;
  totalAmount?: number
  status: 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Cancelled'
  transaction: {
    id: string
    transactionStatus: string
    bank_status: string
    sp_code: string
    sp_message: string
    method: string
    date_time: string
  }
  createdAt?: Date
  updatedAt?: Date
}
