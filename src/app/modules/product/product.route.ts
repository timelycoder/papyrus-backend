import express from 'express'
import { ProductControllers } from './product.controller'
import auth from '../../middlewares/auth'
import { validateRequest } from '../../middlewares/validateRequest'
import { ProductValidation } from './product.validation'

const router = express.Router()
router.post(
  '/',
  auth('admin'),
  validateRequest(ProductValidation.ProductValidationSchema),
  ProductControllers.createProduct,
)
router.get('/', ProductControllers.getAllProducts)
router.get('/:productId', ProductControllers.getSingleProduct)
router.put(
  '/:productId',
  auth('admin'),
  validateRequest(ProductValidation.updateProductValidationSchema),
  ProductControllers.updateProduct,
)
router.delete('/:productId', auth('admin'), ProductControllers.deleteProduct)

export const ProductRoutes = router
