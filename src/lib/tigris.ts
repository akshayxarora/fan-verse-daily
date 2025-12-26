// Tigris integration for images and JSON content storage
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize Tigris S3 client
// Tigris endpoint: https://t3.storage.dev
// IAM endpoint: https://iam.storage.dev
const s3Client = new S3Client({
  endpoint: process.env.TIGRIS_ENDPOINT || import.meta.env.VITE_TIGRIS_ENDPOINT || 'https://t3.storage.dev',
  region: process.env.TIGRIS_REGION || import.meta.env.VITE_TIGRIS_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.TIGRIS_ACCESS_KEY_ID || import.meta.env.VITE_TIGRIS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.TIGRIS_SECRET_ACCESS_KEY || import.meta.env.VITE_TIGRIS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

const IMAGES_BUCKET = process.env.TIGRIS_IMAGES_BUCKET || import.meta.env.VITE_TIGRIS_IMAGES_BUCKET || 'images';
const CONTENT_BUCKET = process.env.TIGRIS_CONTENT_BUCKET || import.meta.env.VITE_TIGRIS_CONTENT_BUCKET || 'content';
const CDN_URL = process.env.TIGRIS_CDN_URL || import.meta.env.VITE_TIGRIS_CDN_URL || '';

/**
 * Upload an image to Tigris
 */
export async function uploadImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const fileKey = `uploads/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: IMAGES_BUCKET,
    Key: fileKey,
    Body: buffer,
    ContentType: file.type,
    ACL: 'public-read',
  });

  await s3Client.send(command);

  // Tigris URLs format: https://t3.storage.dev/{bucket}/{key}
  const endpoint = process.env.TIGRIS_ENDPOINT || import.meta.env.VITE_TIGRIS_ENDPOINT || 'https://t3.storage.dev';
  return CDN_URL 
    ? `${CDN_URL}/${IMAGES_BUCKET}/${fileKey}`
    : `${endpoint}/${IMAGES_BUCKET}/${fileKey}`;
}

/**
 * Store blog post content as JSON in Tigris
 */
export async function storePostContent(postId: string, content: any): Promise<string> {
  const fileKey = `posts/${postId}.json`;
  const jsonContent = JSON.stringify(content, null, 2);

  const command = new PutObjectCommand({
    Bucket: CONTENT_BUCKET,
    Key: fileKey,
    Body: jsonContent,
    ContentType: 'application/json',
    ACL: 'public-read',
  });

  await s3Client.send(command);

  return fileKey;
}

/**
 * Get blog post content from Tigris
 */
export async function getPostContent(postId: string): Promise<any> {
  const fileKey = `posts/${postId}.json`;

  const command = new GetObjectCommand({
    Bucket: CONTENT_BUCKET,
    Key: fileKey,
  });

  try {
    const response = await s3Client.send(command);
    const body = await response.Body?.transformToString();
    return body ? JSON.parse(body) : null;
  } catch (error: any) {
    if (error.name === 'NoSuchKey') {
      return null;
    }
    throw error;
  }
}

/**
 * Delete blog post content from Tigris
 */
export async function deletePostContent(postId: string): Promise<void> {
  const fileKey = `posts/${postId}.json`;

  const command = new DeleteObjectCommand({
    Bucket: CONTENT_BUCKET,
    Key: fileKey,
  });

  await s3Client.send(command);
}

/**
 * Delete image from Tigris
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  // Extract key from URL
  const urlParts = imageUrl.split('/');
  const keyIndex = urlParts.findIndex(part => part === IMAGES_BUCKET);
  if (keyIndex === -1) return;

  const fileKey = urlParts.slice(keyIndex + 1).join('/');

  const command = new DeleteObjectCommand({
    Bucket: IMAGES_BUCKET,
    Key: fileKey,
  });

  await s3Client.send(command);
}

