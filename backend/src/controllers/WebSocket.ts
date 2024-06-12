import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import path from "path";
import { createFolder,  deleteFile, fetchDir, fetchFileContent, saveFile } from "../utils/fs";
import { allowedOrigins } from "../..";
import { ioAuth } from "../middleware/Auth";
import { TerminalManager } from "../Terminal";
import { deleteFromS3, fetchS3Folder, saveProjectToS3 } from "../Cloud";
import { PrismaClient } from '@prisma/client'
import { throttledSaveToS3 } from "../utils/Throttle";

const terminalManager = new TerminalManager();
const prisma = new PrismaClient()

export function initWs(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials: true
        },
    });
    io.on("connection", async (socket) => {
        const token = socket.handshake.auth.token;
        const name = socket.handshake.query.roomId
        const user = await ioAuth(token)
        if (user == 'not authenticated') {
            socket.disconnect();
            return;
        }
        console.log('connected')
        //get project
        const project = await prisma.projects.findFirst({
            where: {
                name: name as string
            }
        })
        const folder = project?.folder
        const projectName = project?.name
        await createFolder(path.join(__dirname, `../../../tmp/${projectName}`))
        await fetchS3Folder(`projects/${folder}`, path.join(__dirname, `../../../tmp/${projectName}`));
        socket.emit("loaded", {
            rootContent: await fetchDir(path.join(__dirname, `../../../tmp/${projectName}`), "")
        });

        initHandlers(socket, projectName as string, folder as string);
    });
}

function initHandlers(socket: Socket, projectName: string, folder: string ) {

    socket.on("disconnect", async () => {
        terminalManager.clear(socket.id)
        await saveProjectToS3(path.join(__dirname, `../../../tmp/${projectName}`), `projects/${folder}`)
        console.log('client disconnected')
    });

    socket.on("fetchDir", async (dir: string, callback) => {
        const dirPath = path.join(__dirname, `../../../tmp/${projectName}/${dir}`);
        const contents = await fetchDir(dirPath, dir);
        callback(contents);
    });

    socket.on("fetchContent", async ({ path: filePath }: { path: string }, callback) => {
        const fullPath = path.join(__dirname, `../../../tmp/${projectName}/${filePath}`);
        const data = await fetchFileContent(fullPath);
        callback(data);
    });

    // TODO: contents should be diff, not full file
    socket.on("updateContent", async ({ path: filePath, content }: { path: string, content: string }) => {
        const fullPath = path.join(__dirname, `../../../tmp/${projectName}/${filePath}`);
        console.log(fullPath, content)
        await saveFile(fullPath, content);
        await throttledSaveToS3(`projects/${folder}`, filePath, content);
    });

    socket.on("deleteFile", async ({ path: filePath }: { path: string }) => {
        const fullPath = path.join(__dirname, `../../../tmp/${projectName}/${filePath}`);
        await deleteFile(fullPath );
        await deleteFromS3(`projects/${folder}`, filePath);
    });

    socket.on("requestTerminal", async () => {
        terminalManager.createPty(socket.id, projectName, (data) => {
            socket.emit('terminal', {
                data: Buffer.from(data,"utf-8")
            });
        });
    });
    
    socket.on("terminalData", async ({ data }: { data: string, terminalId: number }) => {
        terminalManager.write(socket.id, data);
    });

}