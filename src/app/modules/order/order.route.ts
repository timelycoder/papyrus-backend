import express from 'express'
import { OrderControllers } from './order.controller'
import { validateRequest } from '../../middlewares/validateRequest'
import { OrderValidationSchema } from './order.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'
const router = express.Router()
router.post(
  '/',
  auth('user', 'admin'),
  validateRequest(OrderValidationSchema.createOrderValidationSchema),
  OrderControllers.createOrderController,
)
router.get(
  '/verify',
  // auth("user","admin"),
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  OrderControllers.verifyPayment,
)
router.get(
  '/byUser',
  auth('user', 'admin'),
  OrderControllers.getOrderHistoryBySpecificUserController,
)
router.get('/', auth('admin'), OrderControllers.getAllOrdersController)
router.get('/:id', auth('admin', 'user'), OrderControllers.getOrderController)
router.patch(
  '/:id/status',
  auth('admin'),
  OrderControllers.updateOrderStatusController,
)

export const OrderRoutes = router
