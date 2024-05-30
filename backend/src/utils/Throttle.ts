import { saveToS3 } from "../Cloud";

const Bottleneck = require('bottleneck');

const s3Limiter = new Bottleneck({
  reservoir: 10, // Maximum number of concurrent uploads (adjust as needed)
  maxRequests: 1, // Maximum requests per unit time (adjust as needed)
  minTime: 3000, // Minimum time between requests (in milliseconds)
});

export async function throttledSaveToS3(key: string, path: string, content: string) {
    return await s3Limiter.schedule(() => saveToS3(key, path, content));
}