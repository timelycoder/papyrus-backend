import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import status from 'http-status'
import { AuthServices } from './auth.service'
import config from '../../config'

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.userRegisteredIntoDB(req.body)
  const filteredResponse = {
    _id: result?._id,
    name: result?.name,
    email: result?.email,
  }
  sendResponse(res, {
    success: true,
    message: 'User registered successfully',
    statusCode: status.CREATED,
    data: filteredResponse,
  })
})

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.userLoginIntoDB(req.body)
  const { refreshToken, accessToken } = result
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
  })

  const data = {
    token: accessToken,
  }
  sendResponse(res, {
    success: true,
    message: 'Login successful',
    statusCode: status.OK,
    data: data,
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies
  const result = await AuthServices.refreshToken(refreshToken)
  sendResponse(res, {
    success: true,
    message: 'Access token retrieved successfully!',
    statusCode: status.OK,
    data: result,
  })
})

export const AuthControllers = {
  registerUser,
  loginUser,
  refreshToken,
}
