import { Request, Response } from 'express';
import { tryCatch } from '../TryCatch';
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { copyS3Folder } from '../Cloud';


const prisma = new PrismaClient()

export const initProject = tryCatch( async (req: Request, res: Response) => {
    const { name, language } = req.body
    const { userId } = req.user
    const id = crypto.randomBytes(16).toString('hex');
    const folder = name + userId
    const nameExist = await prisma.projects.findFirst({
        where: {
            name,
            userId
        }
    })
    if (nameExist) return res.status(400).json('a folder with this name exist')
    await prisma.projects.create({
        data: {
            id,
            name,
            language,
            folder,
            userId
        }
    })
    await copyS3Folder(language, `projects/${folder}`)
    return res.status(200).json('project created')
})

export const getAllProject = tryCatch(async (req: Request, res: Response) => {
    const { userId } = req.user
    const myProjects = await prisma.projects.findMany({
        where: {
            userId
        }
    })
    return res.status(200).json(myProjects)
})

export const deleteProject = tryCatch(async (req: Request, res: Response) => {
    const { id } = req.body
    await prisma.projects.delete({
        where: {
            id: id
        }
    })
    return res.status(200).json('deleted')
})