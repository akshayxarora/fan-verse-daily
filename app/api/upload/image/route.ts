// Next.js API route for image upload
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import jwt from 'jsonwebtoken';
import { queryOne } from '@/lib/db/client';

// Verify admin authentication
async function verifyAdmin(request: NextRequest): Promise<{ valid: boolean; userId?: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const user = await queryOne('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!user || user.role !== 'admin') {
      return { valid: false };
    }

    return { valid: true, userId: decoded.userId };
  } catch {
    return { valid: false };
  }
}

const s3Client = new S3Client({
  endpoint: process.env.TIGRIS_ENDPOINT || 'https://t3.storage.dev',
  region: process.env.TIGRIS_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.TIGRIS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.TIGRIS_SECRET_ACCESS_KEY || '',
  },
  // virtual-hosted style (subdomain) is required for public access in Tigris
  forcePathStyle: false,
});

const IMAGES_BUCKET = process.env.TIGRIS_IMAGES_BUCKET || 'images';
const CDN_URL = process.env.TIGRIS_CDN_URL || '';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${randomString}.${extension}`;
    
    // KEY SHOULD NOT HAVE BUCKET NAME OR EXTRA PREFIX UNLESS NEEDED
    const fileKey = filename;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Tigris
    const command = new PutObjectCommand({
      Bucket: IMAGES_BUCKET,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    });

    try {
      await s3Client.send(command);
    } catch (uploadError: any) {
      console.error('Tigris upload error details:', {
        code: uploadError.Code,
        message: uploadError.message,
        bucket: IMAGES_BUCKET,
        key: fileKey,
        endpoint: process.env.TIGRIS_ENDPOINT,
      });
      
      return NextResponse.json(
        { error: `Storage error: ${uploadError.message}. Please verify TIGRIS_IMAGES_BUCKET and credentials.` },
        { status: 500 }
      );
    }

    // Generate URL - Tigris format: https://{bucket}.t3.storage.dev/{key}
    // As confirmed by the user, subdomain-style is required for public access
    const endpoint = (process.env.TIGRIS_ENDPOINT || 'https://t3.storage.dev').replace(/\/$/, '');
    const urlObj = new URL(endpoint);
    const host = urlObj.host; // e.g., t3.storage.dev
    
    // Construct the correct subdomain-style URL: https://mwv-bucket.t3.storage.dev/filename.jpg
    let imageUrl = `https://${IMAGES_BUCKET}.${host}/${fileKey}`;
    
    // If a custom CDN_URL is provided, prioritize it
    if (CDN_URL) {
      imageUrl = `${CDN_URL.replace(/\/$/, '')}/${fileKey}`;
    }

    return NextResponse.json({
      url: imageUrl,
      filename: filename,
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

