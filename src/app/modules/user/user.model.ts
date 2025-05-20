import { model, Schema } from 'mongoose'
import { TUser, UserModel } from './user.interface'
import { USER_ROLE } from './user.constant'
import bcrypt from 'bcrypt'
import config from '../../config'

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },

    role: {
      type: String,
      enum: USER_ROLE,
      default: 'user',
      required: true,
    },
    isDeactivate: {
      type: Boolean,
      default: false,
      required: true,
    },
    phone: { type: String, default: 'N/A' },
    address: { type: String, default: 'N/A' },
    city: { type: String, default: 'N/A' },
  },
  {
    timestamps: true,
  },
)

userSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.name = this.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }
  next()
})

userSchema.pre('save', async function (next) {
  const user = this // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

userSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
})

userSchema.statics.isUserExistsByCustomEmail = async function (email: string) {
  return await User.findOne({ email })
}

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ _id: id }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}
export const User = model<TUser, UserModel>('User', userSchema)
