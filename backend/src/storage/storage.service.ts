import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.getOrThrow<string>('SUPABASE_URL');
    const key = this.configService.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  async uploadBuffer(
    bucket: string,
    path: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    await this.ensureBucketExists(bucket);

    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(path, buffer, { contentType, upsert: true });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    return path;
  }

  private async ensureBucketExists(bucket: string) {
    try {
      const { data: buckets, error: listError } = await this.supabase.storage.listBuckets();
      if (listError) {
        this.logger.warn(`Failed to list buckets: ${listError.message}`);
        return;
      }

      const exists = buckets?.find((b) => b.name === bucket);
      if (!exists) {
        this.logger.log(`Storage bucket '${bucket}' not found. Attempting to create...`);
        const { error: createError } = await this.supabase.storage.createBucket(bucket, {
          public: false,
        });

        if (createError) {
          this.logger.error(`Failed to create bucket '${bucket}': ${createError.message}`);
        } else {
          this.logger.log(`Successfully created storage bucket '${bucket}'`);
        }
      }
    } catch (err: any) {
      this.logger.warn(`Error ensuring bucket exists: ${err.message}`);
    }
  }

  async getSignedUrl(
    bucket: string,
    path: string,
    expiresInSeconds: number = 60 * 60 * 24 * 7, // 7 days
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error || !data?.signedUrl) {
      throw new Error(`Failed to generate signed URL: ${error?.message ?? 'unknown'}`);
    }

    return data.signedUrl;
  }

  async uploadFromStream(
    bucket: string,
    path: string,
    stream: Readable,
    contentType: string,
  ): Promise<string> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
    }
    const buffer = Buffer.concat(chunks);
    return this.uploadBuffer(bucket, path, buffer, contentType);
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);
    if (error) {
      this.logger.warn(`Failed to delete file ${path} from ${bucket}: ${error.message}`);
    }
  }
}
