export enum Type {
    FILE,
    DIRECTORY,
    DUMMY
}

interface CommonProps {
    id: string;
    type: Type;
    name: string;
    content?: string;
    path: string;
    parentId: string | undefined;
    depth: number;
}

export interface File extends CommonProps {
}

export interface RemoteFile {
    type: "file" | "dir";
    name: string;
    path: string;
}

export interface Directory extends CommonProps {
    files: File[];
    dirs: Directory[];
}

// This function takes an array of RemoteFile objects and builds a file tree from it.
export function buildFileTree(data: RemoteFile[]): Directory {
    // Separate directories and files from the data
    const dirs = data.filter(x => x.type === "dir");
    const files = data.filter(x => x.type === "file");
    // Create a cache to store the directories and files by their path
    const cache = new Map<string, Directory | File>();
    
    // Initialize the root directory
    let rootDir: Directory = {
        id: "root",
        name: "root",
        parentId: undefined,
        type: Type.DIRECTORY,
        path: "",
        depth: 0,
        dirs: [],
        files: []
    };
    // For each directory in the data, create a Directory object and add it to the cache
    dirs.forEach((item) => {
        let dir: Directory = {
        id: item.path,
        name: item.name,
        path: item.path,
        parentId: item.path.split("/").length === 2 ? "0" : dirs.find(x => x.path === item.path.split("/").slice(0, -1).join("/"))?.path,
        type: Type.DIRECTORY,
        depth: 0,
        dirs: [],
        files: []
    };
    cache.set(dir.id, dir);
    });

    // For each file in the data, create a File object and add it to the cache
    files.forEach((item) => {
        let file: File = {
        id: item.path,
        name: item.name,
        path: item.path,
        parentId: item.path.split("/").length === 2 ? "0" : dirs.find(x => x.path === item.path.split("/").slice(0, -1).join("/"))?.path,
        type: Type.FILE,
        depth: 0
        };
        cache.set(file.id, file);
    });

    // For each item in the cache, add it to its parent directory's files or dirs array
    cache.forEach((value) => {
        if (value.parentId === "0") {
        if (value.type === Type.DIRECTORY) rootDir.dirs.push(value as Directory);
        else rootDir.files.push(value as File);
        } else {
        const parentDir = cache.get(value.parentId as string) as Directory;
        if (value.type === Type.DIRECTORY)
            parentDir.dirs.push(value as Directory);
        else parentDir.files.push(value as File);
        }
    });

    getDepth(rootDir, 0);

    return rootDir;
}

// This function calculates the depth of each item in the file tree
function getDepth(rootDir: Directory, curDepth: number) {
    rootDir.files.forEach((file) => {
        file.depth = curDepth + 1;
    });
    rootDir.dirs.forEach((dir) => {
        dir.depth = curDepth + 1;
        getDepth(dir, curDepth + 1);
    });
}

// This function finds a file by name in the file tree
export function findFileByName(
    rootDir: Directory,
    filename: string
    ): File | undefined {
    let targetFile: File | undefined = undefined;

    function findFile(rootDir: Directory, filename: string) {
        rootDir.files.forEach((file) => {
        if (file.name === filename) {
            targetFile = file;
            return;
        }
        });
        rootDir.dirs.forEach((dir) => {
        findFile(dir, filename);
        });
    }

    findFile(rootDir, filename);
    return targetFile;
}

// This function sorts directories by name
export function sortDir(l: Directory, r: Directory) {
    return l.name.localeCompare(r.name);
}

// This function sorts files by name
export function sortFile(l: File, r: File) {
    return l.name.localeCompare(r.name);
}