import { Express } from "express";
import express from "express";
import { Auth } from './middleware/Auth'
import { errorHandler } from "./middleware/ErrorHandler";
import userRoute from "./routes/UserRoutes";
import projectRoute from "./routes/ProjectRoutes"

export function initHttp(app: Express) {

    app.use(express.json());

    app.use('/api/user', userRoute)
    app.use('/api/project', Auth, (projectRoute))

    app.use(errorHandler)
}