import express from 'express'
import { userControllers } from './user.controller'
import { validateRequest } from '../../middlewares/validateRequest'
import { UserValidation } from './user.validation'
import auth from '../../middlewares/auth'

const router = express.Router()

router.get('/', auth('admin'), userControllers.getUsers)
router.get('/:userId', auth('user', 'admin'), userControllers.getSingleUser)
router.patch(
  '/:userId',
  auth('user', 'admin'),
  validateRequest(UserValidation.updateUserValidationShcema),
  userControllers.updateUser,
)

export const UserRoutes = router
