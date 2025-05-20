// import QueryBuilder from '../../builder/QueryBuilder'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { productSearchableFields } from './product.constant'
import { TProduct } from './product.interface'
import { Product } from './product.model'
import status from 'http-status'

const createProductIntoDB = async (productData: TProduct) => {
  const result = await Product.create(productData)
  return result
}

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()

  const result = await productQuery.modelQuery

  const countQuery = new QueryBuilder(Product.find(), query)
    .search(productSearchableFields)
    .filter()

  const meta = await countQuery.countTotal()
  return {
    result,
    meta,
  }
}

const getSingleProductFromDB = async (productId: string) => {
  const result = await Product.findOne({ _id: productId })
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Product is not found!')
  }
  return result
}

const updateProductInDB = async (
  productId: string,
  updatedData: Partial<TProduct>,
) => {
  if (typeof updatedData.quantity === 'number') {
    updatedData.inStock = updatedData.quantity > 0
  }

  const result = await Product.findByIdAndUpdate(productId, updatedData, {
    new: true,
  })
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Product is not found!')
  }

  return result
}

const deleteProductFromDB = async (productId: string) => {
  const product = await Product.findById(productId)
  if (product?.isDeleted) {
    throw new AppError(status.OK, 'Product is already deleted!')
  }
  const result = await Product.findByIdAndUpdate(
    { _id: productId },
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    },
  )
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Product is not found!')
  }

  return result
}

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductInDB,
  deleteProductFromDB,
}
