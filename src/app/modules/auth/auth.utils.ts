import jwt, { SignOptions } from 'jsonwebtoken'
export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string,
): string => {
  const signOptions: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  }

  return jwt.sign(jwtPayload as object, secret, signOptions)
}
