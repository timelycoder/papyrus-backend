import AppError from '../../errors/AppError'
import { TUser } from './user.interface'
import { User } from './user.model'
import status from 'http-status'
const getUsersFromDB = async () => {
  const result = await User.find()
  if (!result.length) {
    throw new AppError(status.OK, 'No user found!')
  }
  return result
}
const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id)
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'User is not found!')
  }
  return result
}
const updateUserIntoDB = async (id: string, data: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'User is not found!')
  }
  return result
}

export const userServices = {
  getUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
}
