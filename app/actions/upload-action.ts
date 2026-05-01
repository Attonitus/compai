"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
    region: process.env.AWS_REGION_KEY!,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY!,
    },
});

export async function getPresignedUrl(fileName: string, fileType: string): Promise<string> {
    const key = `images/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME_KEY!,
        Key: key,
        ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 60 });
    return signedUrl;
}