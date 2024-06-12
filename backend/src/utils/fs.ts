import fs from "fs";
import path from "path";

interface File {
    type: "file" | "dir";
    name: string;
}

export const fetchDir = (dir: string, baseDir: string): Promise<File[]>  => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files.map(file => ({ type: file.isDirectory() ? "dir" : "file", name: file.name, path: `${baseDir}/${file.name}`  })));
            }
        });       
    });
}

export const fetchFileContent = (file: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
}

export function writeFile(filePath: string, fileData: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
            fs.writeFile(filePath, fileData, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    });
}

export function createFolder(dirName: string) {
    return new Promise<string>((resolve, reject) => {
        fs.mkdir(dirName, { recursive: true }, (err) => {
            if (err) {
                return reject(err)
            }
            return resolve('success')
        });
    })
}

export const saveFile = async (file: string, content: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, content, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

export const deleteFile = async (file: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.unlink(file, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

export const deleteDir = async (path: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.rm(path, {recursive: true, force: true}, (err) => {
            if (err) {
                return console.log(err);
            }
        console.log('success')
        });
    });
}