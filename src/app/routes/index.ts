import { Router } from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { AuthRoutes } from '../modules/auth/auth.routes'
import { AdminRouter } from '../modules/admin/admin.routes'
import { ProductRoutes } from '../modules/product/product.route'
import { OrderRoutes } from '../modules/order/order.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/admin',
    route: AdminRouter,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
