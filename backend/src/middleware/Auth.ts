import jwt, { JwtPayload } from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express';

declare global {
    namespace Express {
        interface Request {
        user: {
            userId: string,
            name: string
        };
        }
    }
}


export async function Auth (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json('not authenticated')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string)as JwtPayload;
        req.user = { userId: payload.userId, name: payload.name}
        next()
    } catch (error) {
        return res.status(401).json('not authenticated')
    }
}

export async function ioAuth (authHeader: string) {
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return 'not authenticated'
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string)as JwtPayload;
        return ('authenticated')
    } catch (error) {
        return 'not authenticated'
    }
}