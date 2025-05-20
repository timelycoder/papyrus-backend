import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { Product } from '../product/product.model'
import { User } from '../user/user.model'
import { TOrder } from './order.interface'
import { Order } from './order.model'
import { orderUtils } from './order.utils'
import { AnyBulkWriteOperation } from 'mongoose'
import status from 'http-status'

type TOrderResponse = {
  createdOrder: TOrder
  //   checkout_url: string
  payment: any
}

const createOrder = async (
  payload: TOrder,
  userId: string,
  client_ip: string,
): Promise<TOrderResponse> => {
  // Check if user exists
  const user = await User.findById(userId)
  // const user = await User.isUserExistsByCustomEmail(user?.email)
  if (!user) throw new AppError(status.NOT_FOUND, 'User not found')
  if (user?.isDeactivate === true) {
    throw new AppError(
      status.FORBIDDEN,
      'Your account is Deactivate. You cannot perform this action.',
    )
  }
  //  Validate payload
  if (!payload.products || payload.products.length === 0) {
    throw new AppError(status.BAD_REQUEST, 'At least one product is required.')
  }

  // Fetch products from DB
  const productIds = payload.products.map((p) => p.productId)
  const productsFromDB = await Product.find({ _id: { $in: productIds } })

  if (productsFromDB.length !== payload.products.length) {
    throw new AppError(status.NOT_FOUND, 'One or more products not found.')
  }

  const productMap = new Map<string, (typeof productsFromDB)[0]>()
  productsFromDB.forEach((product) => {
    productMap.set(product._id.toString(), product)
  })

  let totalAmount = 0

  //  Validate stock and calculate total
  for (const item of payload.products) {
    const product = productMap.get(item.productId.toString())

    if (!product) {
      throw new AppError(
        status.NOT_FOUND,
        `Product with ID ${item.productId} not found.`,
      )
    }

    if (product.quantity <= 0) {
      product.inStock = false
      await product.save()
      throw new AppError(
        status.BAD_REQUEST,
        `Product "${product.name}" is out of stock.`,
      )
    }

    if (item.quantity > product.quantity) {
      throw new AppError(
        status.BAD_REQUEST,
        `Only ${product.quantity} units of "${product.name}" are available.`,
      )
    }

    totalAmount += product.price * item.quantity
  }

  // Prepare order data
  payload.totalAmount = totalAmount
  payload.userId = user._id

  try {
    //  Create order
    // await OrderValidationSchema.parseAsync({ body: req.body });
    const createdOrder = await Order.create(payload)

    // update product quantities
    // const bulkUpdates = payload.products.map((item) => ({
    //   updateOne: {
    //     filter: { _id: item.productId },
    //     update: { $inc: { quantity: -item.quantity } },
    //   },
    // }))

    // Cleaned and type-safe bulkWrite logic
    const bulkUpdates: AnyBulkWriteOperation<typeof Product>[] = []

    productsFromDB.forEach((product) => {
      const orderedItem = payload.products.find(
        (item) => item.productId.toString() === product._id.toString(),
      )

      if (orderedItem) {
        const updatedQuantity = product.quantity - orderedItem.quantity

        bulkUpdates.push({
          updateOne: {
            filter: { _id: product._id },
            update: {
              $inc: { quantity: -orderedItem.quantity },
              $set: { inStock: updatedQuantity > 0 },
            },
          },
        })
      }
    })

    await Product.bulkWrite(bulkUpdates)

    // Payment integration
    const shurjopayPayload = {
      amount: totalAmount,
      order_id: createdOrder._id,
      currency: 'BDT',
      customer_name: user.name,
      customer_address: user.address,
      customer_email: user.email,
      customer_phone: user.phone,
      customer_city: user.city,
      client_ip,
    }

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload)

    if (payment?.transactionStatus) {
      await Order.updateOne(
        { _id: createdOrder._id },
        {
          $set: {
            transaction: {
              id: payment.sp_order_id,
              transactionStatus: payment.transactionStatus,
            },
          },
        },
      )
    }

    // console.log('Payment Response:', payment);
    // console.log(payment.checkout_url)

    return {
      createdOrder,
      // checkout_url: payment?.checkout_url || '',
      payment,
    }
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.error('Order creation error:', error)
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to initiate order.',
    )
  }
}

const VALID_ORDER_STATUSES = [
  'Pending',
  'Paid',
  'Shipped',
  'Completed',
  'Cancelled',
]

const getAllOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    Order.find().populate('userId').populate('products.productId'),
    query,
  )
    .filter()
    .sort()
    .paginate()

  const meta = await orderQuery.countTotal()
  const result = await orderQuery.modelQuery
  if (!result?.length) {
    throw new AppError(status.OK, 'No orders found!')
  }
  return { meta, result }
}

const getOrderById = async (id: string) => {
  const order = await Order.findById(id)
    .populate('userId')
    .populate('products.productId')

  if (!order) {
    throw new AppError(status.NOT_FOUND, 'Order not found!')
  }
  return order
}

const getOrderHistoryBySpecificUser = async (userId: string) => {
  // const user = await User.isUserExistsByCustomEmail(userEmail)
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found!')
  }

  const orders = await Order.find({ userId: user._id })
    .populate('userId', '_id name identifier role')
    .populate('products.productId')

  if (!orders?.length) {
    throw new AppError(status.OK, 'No order found')
  }
  return orders
}

const updateOrderStatusById = async (id: string, orderStatus: string) => {
  if (!VALID_ORDER_STATUSES.includes(orderStatus)) {
    throw new AppError(status.BAD_REQUEST, `Invalid status: ${orderStatus}`)
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status: orderStatus },
    { new: true, runValidators: true },
  )

  if (!updatedOrder) {
    throw new AppError(status.NOT_FOUND, 'No order found with the provided ID')
  }

  return updatedOrder
}

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id)

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    )
  }

  return verifiedPayment
}

export const OrderServices = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderHistoryBySpecificUser,
  updateOrderStatusById,
  verifyPayment,
}
