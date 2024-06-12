import { S3Client, ListObjectsV2Command, GetObjectCommand, CopyObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { writeFile } from "./utils/fs";

const s3 = new S3Client({
    region: 'us-east-1', 
    credentials: { 
        accessKeyId: process.env.ACCESS_KEY as string, 
        secretAccessKey: process.env.SECRET_KEY as string
    },
    endpoint: process.env.END_POINT
})

export const fetchS3Folder = async (key: string, localPath: string): Promise<void> => {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET as string,
            Prefix: key
        };
        //list folder content in s3
        const listObjects = new ListObjectsV2Command(params);
        const response = await s3.send(listObjects)
        if (response.Contents) {
            console.log(response.Contents)
            //loops through folder contents excluding the first content (folder name) 
            await Promise.all(response.Contents.slice(1).map(async (file) => {
                const fileKey = file.Key;
                if (fileKey) {
                    const getObjectParams = {
                        Bucket: process.env.S3_BUCKET as string,
                        Key: fileKey
                    };
                    const getObject = new GetObjectCommand(getObjectParams)

                    const data = await s3.send(getObject)
                    if (data.Body) {
                        const fileData = await data.Body?.transformToString();
                        const filePath = `${localPath}/${fileKey.replace(key, "")}`;
                        console.log(filePath)
                        //write contents to local file path
                        await writeFile(filePath, fileData);
                        console.log(`Downloaded ${fileKey} to ${filePath}`);
                    }
                }
            }));
        }
    } catch (error) {
        console.error('Error fetching folder:', error);
    }
};

export async function copyS3Folder(sourcePrefix: string, destinationPrefix: string, continuationToken?: string): Promise<void> {
    try {
        // List all objects in the source folder
        const listParams = {
            Bucket: process.env.S3_BUCKET as string,
            Prefix: sourcePrefix,
            ContinuationToken: continuationToken
        };

        const listObjects = new ListObjectsV2Command(listParams)

        const listedObjects = await s3.send(listObjects)

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;
        
        // Copy each object to the new location
        await Promise.all(listedObjects.Contents.map(async (object) => {
            if (!object.Key) return;
            let destinationKey = object.Key.replace(sourcePrefix, destinationPrefix);
            let copyParams = {
                Bucket: process.env.S3_BUCKET as string,
                CopySource: `${process.env.S3_BUCKET}/${object.Key}`,
                Key: destinationKey
            };

            const copyObject = new CopyObjectCommand(copyParams)

            await s3.send(copyObject);
            console.log(`Copied ${object.Key} to ${destinationKey}`);
        }));

        // Check if the list was truncated and continue copying if necessary
        if (listedObjects.IsTruncated) {
            listParams.ContinuationToken = listedObjects.NextContinuationToken;
            await copyS3Folder(sourcePrefix, destinationPrefix, continuationToken);
        }
    } catch (error) {
        console.error('Error copying folder:', error);
    }
}

export const saveToS3 = async (key: string, filePath: string, content: string): Promise<void> => {
    //save file contents to s3
    const params = {
        Bucket: process.env.S3_BUCKET as string,
        Key: `${key}${filePath}`,
        Body: content
    }

    const putObject = new PutObjectCommand(params)

    await s3.send(putObject)
}

export const deleteFromS3 = async (key: string, filePath: string): Promise<void> => {
    //delete file from s3
    const params = {
        Bucket: process.env.S3_BUCKET as string,
        Key: `${key}${filePath}`,
    }

    const deleteObject = new DeleteObjectCommand(params)
    await s3.send(deleteObject)
}

export const saveProjectToS3 = async (dir: string, key: string = ''): Promise<void> => {
    //saves entire project folder when client disconnect

    //read project dir
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    //loop through files in project die
    for (const file of files) {
        const filePath = path.join(dir, file.name);
        const fileKey = `${key}/${file.name}`;
        // check if file is a dir
        if (file.isDirectory()) {
            //recursion
            await saveProjectToS3(filePath, fileKey);
        } else {
            //upload file content to s3
            const fileContent = await fs.promises.readFile(filePath);
            const params = {
                Bucket: process.env.S3_BUCKET as string,
                Key: fileKey,
                Body: fileContent
            };

            const putObject = new PutObjectCommand(params);
            await s3.send(putObject);
        }
    }
    console.log('done')
};

export const deleteProjectFromS3 = async (key: string): Promise<string> => {
    const listParams = {
            Bucket: process.env.S3_BUCKET as string,
            Prefix: key
        };

        const listObjects = new ListObjectsV2Command(listParams);
        const response = await s3.send(listObjects)
        if (response.Contents) {
            // Use Promise.all to run getObject operations in parallel
            await Promise.all(response.Contents.map(async (file) => {
                const fileKey = file.Key;
                const params = {
                    Bucket: process.env.S3_BUCKET as string,
                    Key: `${key}${fileKey}`,
                }

                const deleteObject = new DeleteObjectCommand(params)
                await s3.send(deleteObject)
            }))
        }
    return 'deleted'
}