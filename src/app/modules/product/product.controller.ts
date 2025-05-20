import { Request, Response } from 'express'
import { ProductServices } from './product.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import status from 'http-status'

const createProduct = async (req: Request, res: Response): Promise<void> => {
  const productData = req.body
  // data validation by Zod
  const result = await ProductServices.createProductIntoDB(productData)
  // success response
  sendResponse(res, {
    success: true,
    message: 'Product created successfully',
    statusCode: status.CREATED,
    data: result,
  })
}

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductsFromDB(req.query)

  sendResponse(res, {
    success: true,
    message: 'Products retrieved successfully',
    statusCode: status.OK,
    data: result,
  })
})

const getSingleProduct = catchAsync(async (req, res): Promise<void> => {
  const productId = req.params.productId
  const result = await ProductServices.getSingleProductFromDB(productId)
  // success response
  sendResponse(res, {
    success: true,
    message: 'Products retrieved successfully',
    statusCode: status.OK,
    data: result,
  })
})

const updateProduct = catchAsync(async (req, res): Promise<void> => {
  const productId = req.params.productId
  const updatedData = req.body
  const result = await ProductServices.updateProductInDB(productId, updatedData)
  // success response
  sendResponse(res, {
    success: true,
    message: 'Product updated successfully',
    statusCode: status.OK,
    data: result,
  })
})

const deleteProduct = catchAsync(async (req, res): Promise<void> => {
  const productId = req.params.productId
  const result = await ProductServices.deleteProductFromDB(productId)
  // success response
  sendResponse(res, {
    success: true,
    message: 'Product deleted successfully',
    statusCode: status.OK,
    data: result,
  })
})

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
}
