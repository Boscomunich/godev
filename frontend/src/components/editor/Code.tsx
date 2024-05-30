import Editor from "@monaco-editor/react";
import { File } from "./utils/FileManager";
import { Socket } from "socket.io-client";

export const Code = ({ selectedFile, socket }: { selectedFile: File | undefined, socket: Socket | null }) => {
    if (!selectedFile)
        return null

    const code = selectedFile.content
    let language = selectedFile.name.split('.').pop()

    if (language === "js" || language === "jsx")
        language = "javascript";
    else if (language === "py" )
        language = "python"

    function debounce(func: (value: string | undefined) => void, wait: number) {
        let timeout: number;
        return (value: string) => {
            clearTimeout(timeout);
            timeout = +setTimeout(() => { func(value); }, wait);
        };
    }

    const handleCodeChange = (value: string | undefined) => {
    let newValue
    if (value == undefined) {
        newValue = ''
    } else {
        newValue == value
    }

    debounce((newValue) => {
        socket?.emit("updateContent", { path: selectedFile.path, content: newValue });
        }, 500);
    };


    return (
        <Editor
            height="100vh"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={(value) => handleCodeChange(value)}
        />
    )
}