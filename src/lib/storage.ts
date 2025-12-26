import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.TIGRIS_ENDPOINT || 'https://t3.storage.dev',
  region: process.env.TIGRIS_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.TIGRIS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.TIGRIS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: false,
});

const IMAGES_BUCKET = process.env.TIGRIS_IMAGES_BUCKET || 'images';

/**
 * Delete a file from Tigris S3
 * @param url The full URL of the image or the file key
 */
export async function deleteFile(url: string) {
  try {
    if (!url) return;

    let fileKey = '';

    // If it's a full URL, extract the key
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      // Tigris URL format: https://{bucket}.t3.storage.dev/{key}
      // OR custom CDN URL
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      fileKey = pathParts[pathParts.length - 1];
    } else {
      fileKey = url;
    }

    if (!fileKey) return;

    console.log(`Deleting file from Tigris: ${fileKey} (bucket: ${IMAGES_BUCKET})`);

    const command = new DeleteObjectCommand({
      Bucket: IMAGES_BUCKET,
      Key: fileKey,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file from Tigris:', error);
    return false;
  }
}

/**
 * Extract Tigris image URLs from content (HTML or Markdown)
 */
export function extractImageUrls(content: string): string[] {
  if (!content) return [];

  const urls: string[] = [];
  
  // Match Tigris URLs in various formats
  // Subdomain style: https://mwv-bucket.t3.storage.dev/filename.jpg
  // Path style: https://t3.storage.dev/mwv-bucket/filename.jpg
  // Custom CDN: https://your-cdn.com/filename.jpg
  
  const bucket = process.env.TIGRIS_IMAGES_BUCKET || 'images';
  const endpoint = (process.env.TIGRIS_ENDPOINT || 't3.storage.dev').replace('https://', '');
  
  // Generic regex for URLs that look like they might be from our Tigris setup
  // We look for common image extensions and the Tigris endpoint or custom CDN if provided
  // Escape periods in endpoint/bucket for safe regex
  const safeEndpoint = endpoint.replace(/\./g, '\\.');
  const safeBucket = bucket.replace(/\./g, '\\.');
  
  const tigrisRegex = new RegExp(`https?://[^\\s"'>]+(${safeEndpoint}|${safeBucket})[^\\s"'>]+\\.(jpg|jpeg|png|gif|webp|svg)`, 'gi');
  
  const matches = content.match(tigrisRegex);
  if (matches) {
    urls.push(...matches);
  }

  // Also check for standard markdown images ![alt](url)
  const mdRegex = /!\[.*?\]\((https?:\/\/.*?)\)/g;
  let mdMatch;
  while ((mdMatch = mdRegex.exec(content)) !== null) {
    const url = mdMatch[1];
    if (url.includes(endpoint) || url.includes(bucket)) {
      urls.push(url);
    }
  }

  // Also check for standard HTML images <img src="url">
  const htmlRegex = /<img.*?src=["'](https?:\/\/.*?)["']/g;
  let htmlMatch;
  while ((htmlMatch = htmlRegex.exec(content)) !== null) {
    const url = htmlMatch[1];
    if (url.includes(endpoint) || url.includes(bucket)) {
      urls.push(url);
    }
  }

  // Remove duplicates
  return Array.from(new Set(urls));
}

