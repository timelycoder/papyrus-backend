import express from 'express'
import { AuthControllers } from './auth.controller'
import { validateRequest } from '../../middlewares/validateRequest'
import { UserValidation } from '../user/user.validation'
import { AuthValidation } from './auth.validation'

const router = express.Router()

router.post(
  '/register',
  validateRequest(UserValidation.userValidationShcema),
  AuthControllers.registerUser,
)
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationShcema),
  AuthControllers.loginUser,
)
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
)
export const AuthRoutes = router
