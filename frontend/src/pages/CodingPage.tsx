import { useEffect, useState } from 'react';
import { Editor } from '../components/Editor';
import { File, RemoteFile, Type } from '../components/editor/utils/FileManager';
import { useParams } from 'react-router-dom';
import { Output } from '../components/Output';
import { TerminalComponent as Terminal } from '../components/Terminal';
import { Socket, io } from 'socket.io-client';
import { EXECUTION_ENGINE_URI } from '../Config';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

function useSocket(name: string, token: string) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(`${EXECUTION_ENGINE_URI}?roomId=${name}`, {
            transports: ['websocket'],
            auth: {
                token: token
            },
            withCredentials: true,
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [name]);

    return socket;
}

const CodingPage = () => {
    const params = useParams()
    const name = params.project || ''
    const authHeader = useAuthHeader()
    const [loaded, setLoaded] = useState(false);
    const socket = useSocket(name, authHeader as string);
    const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [showOutput, setShowOutput] = useState(false);


    useEffect(() => {
        if (socket) {
            socket.on('loaded', ({ rootContent }: { rootContent: RemoteFile[]}) => {
                setLoaded(true);
                setFileStructure(rootContent);
            });
        }
    }, [socket]);

    const onSelect = (file: File) => {
        if (file.type === Type.DIRECTORY) {
            socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
                setFileStructure(prev => {
                    const allFiles = [...prev, ...data];
                    return allFiles.filter((file, index, self) => 
                        index === self.findIndex(f => f.path === file.path)
                    );
                });
            });

        } else {
            socket?.emit("fetchContent", { path: file.path }, (data: string) => {
                file.content = data;
                setSelectedFile(file);
            });
        }
    };
    
    if (!loaded) {
        return "Loading...";
    }

    return (
        <div className='flex flex-col w-[100%]'>
            <div className='flex justify-center p-5'>
                <button onClick={() => setShowOutput(!showOutput)}>See output</button>
            </div>
            <div className='flex m-0 text-[16px] w-[100%]'>
                <div className='flex-1 w-[60%]'>
                    <Editor socket={socket} selectedFile={selectedFile} onSelect={onSelect} files={fileStructure} />
                </div>
                <div className='flex-1 w-[40%]'>
                    {showOutput && <Output />}
                    <Terminal socket={socket} />
                </div>
            </div>
        </div>
    );
}

export default CodingPage