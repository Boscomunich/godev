import Editor from "@monaco-editor/react";
import { File } from "./utils/FileManager";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

export const Code = ({ selectedFile, socket }: { selectedFile: File | undefined, socket: Socket | null }) => {
    if (!selectedFile)
        return null
    const [isdark, setIsDark] = useState('vs-dark')

    useEffect(() => {
        const theme = localStorage.getItem('theme')
        if (theme == 'dark') {
            setIsDark('vs-dark')
        }else {
            setIsDark('vs-light')
        }
    },[])

    const code = selectedFile.content
    let language = selectedFile.name.split('.').pop()

    if (language === "js" || language === "jsx")
        language = "javascript";
    else if (language === "py" )
        language = "python"

    const handleCodeChange = (value: string | undefined) => {
        socket?.emit("updateContent", { path: selectedFile.path, content: value })
    };


    return (
            <Editor
                height="88vh"
                language={language}
                value={code}
                theme={isdark}
                onChange={(value) => handleCodeChange(value)}
            />
    )
}