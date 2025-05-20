import express from 'express'
import { AdminControllers } from './admin.controller'
import auth from '../../middlewares/auth'

const router = express.Router()

router.patch(
  '/user/:id/deactivate',
  auth('admin'),
  AdminControllers.deactivateUserByAdmin,
)

export const AdminRouter = router
