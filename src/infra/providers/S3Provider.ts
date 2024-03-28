import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv'

dotenv.config()

export class S3Provider {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({ region: "us-east-1" });
    this.bucketName = "naive-bayes-classifier-model-bucket";
  }

  async getObject(key: string): Promise<Uint8Array> {

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    const response = await this.s3Client.send(command)
    const buffer = await response.Body?.transformToByteArray()
    return buffer as Uint8Array
  }

  async uploadObject(key: string, object: any): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: object
    })

    await this.s3Client.send(command);
  }

  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    await this.s3Client.send(command);
  } 
}