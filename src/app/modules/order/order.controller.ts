import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { OrderServices } from './order.service'
import status from 'http-status'
// import { Document } from 'mongoose'

const createOrderController = catchAsync(async (req, res) => {
  const orderPayload = req.body
  const { userId } = req.body
  // Fetch the user by ID
  // Proceed with order creation
  const { createdOrder, /**checkout_url,**/ payment } =
    await OrderServices.createOrder(orderPayload, userId, req.ip || '::1')

  sendResponse(res, {
    success: true,
    message: 'Order placed successfully',
    statusCode: status.CREATED,
    data: {
      order: createdOrder,
      //   checkout_url,
      paymentResponse: payment,
    },
  })
})

const getAllOrdersController = catchAsync(async (req, res) => {
  const query = req.query
  const result = await OrderServices.getAllOrders(query)

  sendResponse(res, {
    success: true,
    message: 'Orders retrieved successfully',
    statusCode: status.OK,
    data: result.result,
  })
})

const getOrderController = catchAsync(async (req, res) => {
  const id = req.params.id
  const order = await OrderServices.getOrderById(id)

  sendResponse(res, {
    success: true,
    message: 'Order retrieved successfully',
    statusCode: status.OK,
    data: order,
  })
})

const getOrderHistoryBySpecificUserController = catchAsync(async (req, res) => {
  const userId = req.user.userId
  const orders = await OrderServices.getOrderHistoryBySpecificUser(userId)

  sendResponse(res, {
    success: true,
    message: 'Specific user wise order history are retrieved successfully',
    statusCode: status.OK,
    data: orders,
  })
})

const updateOrderStatusController = catchAsync(async (req, res) => {
  const id = req.params.id
  const orderStatus = req.body.status
  const updatedStatus = await OrderServices.updateOrderStatusById(
    id,
    orderStatus,
  )

  sendResponse(res, {
    success: true,
    message: 'Order status updated successfully',
    statusCode: status.OK,
    data: updatedStatus,
  })
})

const verifyPayment = catchAsync(async (req, res) => {
  const order = await OrderServices.verifyPayment(req.query.order_id as string)

  sendResponse(res, {
    success: true,
    message: 'Order verified successfully',
    statusCode: status.OK,
    data: order,
  })
})
export const OrderControllers = {
  createOrderController,
  getAllOrdersController,
  getOrderController,
  getOrderHistoryBySpecificUserController,
  updateOrderStatusController,
  verifyPayment,
}
