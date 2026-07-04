export const DEFAULT_R2_PRESIGNED_EXPIRES_SECONDS = 900;

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  presignedExpiresSeconds: number;
};

export function getR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return null;
  }

  const expiresRaw = process.env.R2_PRESIGNED_URL_EXPIRES_SECONDS;
  const presignedExpiresSeconds = expiresRaw
    ? Number(expiresRaw)
    : DEFAULT_R2_PRESIGNED_EXPIRES_SECONDS;

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    presignedExpiresSeconds: Number.isFinite(presignedExpiresSeconds)
      ? presignedExpiresSeconds
      : DEFAULT_R2_PRESIGNED_EXPIRES_SECONDS,
  };
}

export function isR2Configured(): boolean {
  return getR2Config() != null;
}
