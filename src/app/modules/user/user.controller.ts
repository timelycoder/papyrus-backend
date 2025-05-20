import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import status from 'http-status'
import { userServices } from './user.service'

const getUsers = catchAsync(async (req, res) => {
  const result = await userServices.getUsersFromDB()

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users retrieve successfully',
    data: result,
  })
})
const getSingleUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const result = await userServices.getSingleUserFromDB(userId)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrieve successfully',
    data: result,
  })
})
const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const userData = req.body
  const result = await userServices.updateUserIntoDB(userId, userData)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users update successfully',
    data: result,
  })
})

export const userControllers = {
  getUsers,
  getSingleUser,
  updateUser,
}
