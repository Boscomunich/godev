import React, {useState} from 'react'
import {Directory, File, sortDir, sortFile} from "./utils/FileManager";
import {getIcon} from "./Icon";


interface FileTreeProps {
    rootDir: Directory; 
    selectedFile: File | undefined;
    onSelect: (file: File) => void;
}

//renders subtree component with root directory
export const FileTree = (props: FileTreeProps) => {
    return <SubTree directory={props.rootDir} {...props}/>
}

interface SubTreeProps {
    directory: Directory;
    selectedFile: File | undefined;
    onSelect: (file: File) => void;
}

// The SubTree component, which displays the contents of a directory
const SubTree = (props: SubTreeProps) => {
    // The component renders a list of directories and files, each represented by a DirDiv or FileDiv component
    // Directories and files are sorted using the sortDir and sortFile functions
    // When a file is clicked, the onSelect function is called with the file as an argument
    return (
        <div className='dark:bg-primary dark:text-white h-[88vh] relative overflow-auto scrollbar-thin w-full'>
        {
            props.directory.dirs
            .sort(sortDir)
            .map(dir => (
                <React.Fragment key={dir.id}>
                <DirDiv
                    directory={dir}
                    selectedFile={props.selectedFile}
                    onSelect={props.onSelect}/>
                </React.Fragment>
            ))
        }
        {
            props.directory.files
            .sort(sortFile)
            .map(file => (
                <React.Fragment key={file.id}>
                <FileDiv
                    file={file}
                    selectedFile={props.selectedFile}
                    onClick={() => props.onSelect(file)}
                    />
                </React.Fragment>
            ))
        }
        </div>
    )
    }

    const FileDiv = ({file, icon, selectedFile, onClick}: {
    file: File | Directory;
    icon?: string;
    selectedFile: File | undefined; 
    onClick: () => void;
    }) => {
    const isSelected = (selectedFile && selectedFile.id === file.id) as boolean;
    const depth = file.depth;
    return (
        <div
        className={`flex items-center pl-${depth} ${isSelected ? "bg-[#242424]": "transparent"} hover:cursor-pointer hover:bg-[#242424]`}
        onClick={onClick}
        >
        <FileIcon
            name={icon}
            extension={file.name.split('.').pop() || ""}/>
        <span style={{marginLeft: 1}}>
            {file.name}
        </span>
        </div>
    )
}

const DirDiv = ({directory, selectedFile, onSelect}: {
    directory: Directory;
    selectedFile: File | undefined;
    onSelect: (file: File) => void;
    }) => {
    let defaultOpen = false;
    if (selectedFile)
        defaultOpen = isChildSelected(directory, selectedFile)
    const [open, setOpen] = useState(defaultOpen);
    return (
        <>
        <FileDiv
            file={directory}
            icon={open ? "openDirectory" : "closedDirectory"}
            selectedFile={selectedFile}
            onClick={() => {
            if (!open) {
                onSelect(directory)
            }
            setOpen(!open)
            }}
            />
        {
            open ? (
            <SubTree
                directory={directory}
                selectedFile={selectedFile}
                onSelect={onSelect}
                />
            ) : null
        }
        </>
    )
}

// A helper function to check if a file is a child of a directory
const isChildSelected = (directory: Directory, selectedFile: File) => {
    // The function checks if the selected file is a child of the directory
    // It returns true if the selected file is a child of the directory, and false otherwise

    let res: boolean = false;

    function isChild(dir: Directory, file: File) {
        if (selectedFile.parentId === dir.id) {
        res = true;
        return;
        }
        if (selectedFile.parentId === '0') {
        res = false;
        return;
        }
        dir.dirs.forEach((item) => {
        isChild(item, file);
        })
    }

    isChild(directory, selectedFile);
    return res;
}

// The FileIcon component, which displays an icon for a file
const FileIcon = ({extension, name}: { name?: string, extension?: string }) => {
    let icon = getIcon(extension || "", name || "");
    return (
        <span className='flex w-[32px] h-[32px] justify-center items-center'>
            {icon}
        </span>
    )
}