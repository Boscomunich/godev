import {Request, Response, NextFunction} from 'express';

export function errorHandler (error: Error, req: Request, res: Response, next: NextFunction) {
    //TODO: handle errors properly
    console.log(error)
}