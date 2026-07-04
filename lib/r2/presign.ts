import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getR2Config } from "./config";

export const DEFAULT_R2_PRESIGNED_UPLOAD_EXPIRES_SECONDS = 3600;

let cachedClient: S3Client | null = null;

function getR2Client(): S3Client {
  const config = getR2Config();
  if (!config) {
    throw new Error("Brak konfiguracji Cloudflare R2.");
  }

  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  return cachedClient;
}

export async function createPresignedDownloadUrl(
  objectKey: string,
): Promise<{ url: string; expiresIn: number }> {
  const config = getR2Config();
  if (!config) {
    throw new Error("Brak konfiguracji Cloudflare R2.");
  }

  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: config.bucketName,
    Key: objectKey,
  });

  const url = await getSignedUrl(client, command, {
    expiresIn: config.presignedExpiresSeconds,
  });

  return {
    url,
    expiresIn: config.presignedExpiresSeconds,
  };
}

export async function createPresignedUploadUrl(
  objectKey: string,
  contentType: string,
): Promise<{ url: string; expiresIn: number; objectKey: string }> {
  const config = getR2Config();
  if (!config) {
    throw new Error("Brak konfiguracji Cloudflare R2.");
  }

  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: objectKey,
    ContentType: contentType,
  });

  const expiresIn = DEFAULT_R2_PRESIGNED_UPLOAD_EXPIRES_SECONDS;
  const url = await getSignedUrl(client, command, { expiresIn });

  return {
    url,
    expiresIn,
    objectKey,
  };
}
