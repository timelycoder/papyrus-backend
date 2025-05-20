import AppError from '../../errors/AppError'
import { User } from '../user/user.model'
import status from 'http-status'

const userDeactivateByAdminIntoDB = async (id: string) => {
  const userData = await User.findById(id)
  if (!userData) {
    throw new AppError(status.NOT_FOUND, 'User is not Found')
  }

  const { isDeactivate } = userData

  const updatedIsDeactivate = !isDeactivate
  const result = await User.findByIdAndUpdate(
    id,
    { isDeactivate: updatedIsDeactivate },
    {
      new: true,
      runValidators: true,
    },
  )

  const message = updatedIsDeactivate
    ? 'User Deactivated successfully'
    : 'User Activated successfully'

  return { result, message }
}

export const AdminServices = {
  userDeactivateByAdminIntoDB,
}
