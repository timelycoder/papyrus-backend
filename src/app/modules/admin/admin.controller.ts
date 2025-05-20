import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AdminServices } from './admin.service'
import status from 'http-status'

const deactivateUserByAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const { result, message } =
    await AdminServices.userDeactivateByAdminIntoDB(id)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: message,
    data: result,
  })
})

export const AdminControllers = {
  deactivateUserByAdmin,
}
