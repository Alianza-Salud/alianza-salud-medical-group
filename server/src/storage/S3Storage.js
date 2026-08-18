const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class S3Storage {
  constructor() {
    const { S3Client } = require('@aws-sdk/client-s3');

    this.bucket = process.env.S3_BUCKET;
    this.region = process.env.S3_REGION || 'us-east-1';

    const s3Config = {
      region: this.region,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
    };

    // Soporte para Cloudflare R2, MinIO, Wasabi, Supabase o DigitalOcean Spaces via S3_ENDPOINT
    if (process.env.S3_ENDPOINT) {
      s3Config.endpoint = process.env.S3_ENDPOINT;
      s3Config.forcePathStyle = true;
    }

    this.s3Client = new S3Client(s3Config);
  }

  generateStorageKey(originalName) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const ext = path.extname(originalName) || '';
    const randomHex = crypto.randomBytes(12).toString('hex');
    const safeBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');

    return `documents/${year}/${month}/${Date.now()}_${randomHex}_${safeBase}${ext}`;
  }

  async uploadFile(tempFilePath, originalName, mimeType) {
    const { PutObjectCommand } = require('@aws-sdk/client-s3');
    const storageKey = this.generateStorageKey(originalName);
    const fileBuffer = await fs.promises.readFile(tempFilePath);
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      Body: fileBuffer,
      ContentType: mimeType || 'application/octet-stream',
    });

    await this.s3Client.send(command);

    return {
      storageKey,
      checksum,
      size: fileBuffer.length,
    };
  }

  async uploadBuffer(buffer, originalName, mimeType) {
    const { PutObjectCommand } = require('@aws-sdk/client-s3');
    const storageKey = this.generateStorageKey(originalName);
    const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      Body: buffer,
      ContentType: mimeType || 'application/octet-stream',
    });

    await this.s3Client.send(command);

    return {
      storageKey,
      checksum,
      size: buffer.length,
    };
  }

  async getReadStream(storageKey) {
    const { GetObjectCommand } = require('@aws-sdk/client-s3');
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
    });

    const response = await this.s3Client.send(command);
    return response.Body;
  }

  async exists(storageKey) {
    const { HeadObjectCommand } = require('@aws-sdk/client-s3');
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      });
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteFile(storageKey) {
    const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      });
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = S3Storage;
