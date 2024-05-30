import { useEffect, useMemo } from "react";
import SideBar from "./editor/SideBar";
import { Code } from "./editor/Code";
import { File, buildFileTree, RemoteFile } from "./editor/utils/FileManager";
import { FileTree } from "./editor/FileTree";
import { Socket } from "socket.io-client";

type EditorProps = {
    files: RemoteFile[];
    onSelect: (file: File) => void;
    selectedFile: File | undefined;
    socket: Socket | null;
}
// credits - https://codesandbox.io/s/monaco-tree-pec7u
export const Editor = ({ files, onSelect, selectedFile, socket }: EditorProps) => {
    const rootDir = useMemo(() => {
        return buildFileTree(files);
    }, [files]);

    useEffect(() => {
        if (!selectedFile) {
            onSelect(rootDir.files[0])
        }
    }, [selectedFile])

    return (
        <div>
            <main className="flex">
                <SideBar>
                <FileTree
                    rootDir={rootDir}
                    selectedFile={selectedFile}
                    onSelect={onSelect}
                />
                </SideBar>
                <Code socket={socket} selectedFile={selectedFile} />
            </main>
        </div>
    );
};