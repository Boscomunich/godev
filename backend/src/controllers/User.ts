import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import { tryCatch } from '../TryCatch';
import crypto from 'crypto'
import { compare } from 'bcryptjs';
import { encryptPassWord, createJWT } from '../utils/Utils'

const prisma = new PrismaClient()

// register user to the database
export const registerUser = tryCatch( async (req: Request, res: Response) => {
    const { email, password } = req.body
    if ( !email || !password) {
        return res.status(400).json('all fields are required')
    }
    const userExist = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    if (userExist) {
        return res.status(400).json('user with this email exist')
    }
    const encryptedPassWord = await encryptPassWord(password)
    const userId = crypto.randomBytes(16).toString('hex');
    await prisma.user.create({
        data: {
            id: userId,
            email: email,
            password: encryptedPassWord
        }
    })
    const token = createJWT(userId, email)
    return res.status(200).json({email: email, id: userId, token: token})
})

//sign in user
export const logIn = tryCatch( async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!password || !email) {
        return res.status(400).json('all fields required')
    }
    const user = await prisma.user.findUnique({
        where: {email: email}
    })
    if (!user) {
        return res.status(400).json('wrong email or password')
    }
    const isMatch = await compare(password, user?.password)
    if (isMatch) {
        const token = createJWT(user.id, user.email)
        return res.status(200).json({email: user.email, id: user.id, token: token})
    }
    res.status(400).json('wrong email or password')
})