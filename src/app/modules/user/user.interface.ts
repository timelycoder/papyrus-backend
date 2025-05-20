/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'
export type TUser = {
  _id?: Types.ObjectId
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  isDeactivate: boolean
  phone?: string
  address?: string
  city?: string
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByCustomId(id: string): Promise<TUser>
  isUserExistsByCustomEmail(email: string): Promise<TUser>
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>
}
