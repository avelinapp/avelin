import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { config } from 'dotenv'

config({ path: '.env' }) // or .env.local

if (!process.env.R2_ENDPOINT) {
  throw new Error('DATABASE_URL is not set')
} else if (!process.env.R2_ACCESS_KEY_ID) {
  throw new Error('R2_ACCESS_KEY_ID is not set')
} else if (!process.env.R2_SECRET_ACCESS_KEY) {
  throw new Error('R2_SECRET_ACCESS_KEY is not set')
} else if (!process.env.ASSETS_URL) {
  throw new Error('ASSETS_URL is not set')
} else if (!process.env.R2_BUCKET_NAME) {
  throw new Error('R2_BUCKET_NAME is not set')
}

// Initialize S3 client for CloudFlare R2
const s3Client = new S3Client({
  region: 'auto', // R2 uses 'auto' for the region
  endpoint: process.env.R2_ENDPOINT, // e.g., 'https://<account_id>.r2.cloudflarestorage.com'
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

// Function to upload picture to R2 and return the public URL

type UploadOptions = {
  imageUrl: string
}

async function upload({ imageUrl }: UploadOptions): Promise<string> {
  // 1. Fetch the image from Google
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch picture from Google')
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const contentType = response.headers.get('content-type') || 'image/jpeg'

  // 3. Generate a unique key for the image in R2
  const key = `avatars/${crypto.randomUUID()}`

  // 4. Upload the image to R2
  const uploadParams = {
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }

  await s3Client.send(new PutObjectCommand(uploadParams))

  // 5. Construct the public URL for the uploaded image
  const r2Url = `${process.env.ASSETS_URL}/${key}`

  return r2Url
}

export const storage = {
  upload,
}
