// Script to create Tigris buckets
// Run with: node scripts/create-tigris-buckets.js

import { S3Client, CreateBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';

const TIGRIS_ENDPOINT = process.env.TIGRIS_ENDPOINT || 'https://t3.storage.dev';
const TIGRIS_ACCESS_KEY_ID = process.env.TIGRIS_ACCESS_KEY_ID || 'tid_bwjetwsFAChLvhBFoWKjPCVHjVlllHrnDBjHoXUamnAJkElFlN';
const TIGRIS_SECRET_ACCESS_KEY = process.env.TIGRIS_SECRET_ACCESS_KEY || 'tsec_gq96kugwgaYdm-nG0sC5e5Ei+-fPiFwld_tWYUez1vilb2vtZleoEoiDo8nLpXQeD29rNu';

const s3Client = new S3Client({
  endpoint: TIGRIS_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: TIGRIS_ACCESS_KEY_ID,
    secretAccessKey: TIGRIS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

async function createBuckets() {
  const buckets = ['images', 'content'];

  for (const bucketName of buckets) {
    try {
      console.log(`Creating bucket: ${bucketName}...`);
      
      // Create bucket
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`✅ Created bucket: ${bucketName}`);

      // Set public read policy for images bucket
      if (bucketName === 'images') {
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'PublicReadGetObject',
              Effect: 'Allow',
              Principal: '*',
              Action: 's3:GetObject',
              Resource: `arn:aws:s3:::${bucketName}/*`,
            },
          ],
        };

        await s3Client.send(
          new PutBucketPolicyCommand({
            Bucket: bucketName,
            Policy: JSON.stringify(policy),
          })
        );
        console.log(`✅ Set public read policy for: ${bucketName}`);
      }
    } catch (error: any) {
      if (error.name === 'BucketAlreadyOwnedByYou' || error.name === 'BucketAlreadyExists') {
        console.log(`⚠️  Bucket ${bucketName} already exists`);
      } else {
        console.error(`❌ Error creating bucket ${bucketName}:`, error.message);
      }
    }
  }

  console.log('\n✅ Bucket setup complete!');
}

createBuckets().catch(console.error);

