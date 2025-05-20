import AppError from '../../errors/AppError'
import { TUser } from '../user/user.interface'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import status from 'http-status'
import { createToken } from './auth.utils'
import config from '../../config'
import jwt, { JwtPayload } from 'jsonwebtoken'

const userRegisteredIntoDB = async (payload: TUser) => {
  const result = await User.create(payload)
  return result
}

const userLoginIntoDB = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload?.email }).select('+password')

  if (!user) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid credentials')
  }

  const userStatus = user?.isDeactivate

  if (userStatus) {
    throw new AppError(
      status.FORBIDDEN,
      'Access denied. Your account has been Deactivate.',
    )
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(status.FORBIDDEN, 'Password does not matched')

  const jwtPayload = {
    userId: user?._id.toString(),
    role: user?.role,
  }
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_secret_expires_in as string,
  )
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_secret_exires_in as string,
  )
  return { accessToken, refreshToken, user }
}

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload
  const { userId } = decoded
  const user = await User.isUserExistsByCustomId(userId)
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'This user is not found!')
  }
  const userStatus = user?.isDeactivate
  if (userStatus) {
    throw new AppError(status.FORBIDDEN, 'This user is Deactivate!')
  }

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  }
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_secret_expires_in as string,
  )
  return { accessToken }
}
export const AuthServices = {
  userRegisteredIntoDB,
  userLoginIntoDB,
  refreshToken,
}
