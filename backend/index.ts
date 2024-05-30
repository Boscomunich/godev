import dotenv from "dotenv"
dotenv.config()
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { initHttp } from "./src/Http";
import { initWs } from "./src/controllers/WebSocket";

const local = process.env.LOCAL as string
const localApi = process.env.LOCAL_API as string

export const allowedOrigins = [ local, localApi ]

const app = express();
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
const httpServer = createServer(app);

initHttp(app)
initWs(httpServer)

const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
    console.log(`listening on :${port}`);
});

export default express;