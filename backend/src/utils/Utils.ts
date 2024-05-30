import { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken'

//encrypt password using bcrypt
export async function encryptPassWord (password: string)  {
    const encryptedPassWord = await hash(password, 10)
    return encryptedPassWord
}

//create long term jwt token
export function createJWT (id: string, email: string) {
    return jwt.sign(
        {userId: id, name: email},
        process.env.JWT_SECRET as string,
        {expiresIn: '30d'}
    )
}

//create short term jwt token
export function createShortJWT (id: string, email: string) {
    return jwt.sign(
        {userId: id, name: email},
        process.env.JWT_SECRET as string,
        {expiresIn: '1d'}
    )
}