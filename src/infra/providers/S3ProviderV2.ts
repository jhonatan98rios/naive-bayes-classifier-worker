import S3 from "aws-sdk/clients/s3";
import * as dotenv from 'dotenv'

dotenv.config()

export class S3ProviderV2 {
  private s3Client: S3;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3({ region: "us-east-1" });
    this.bucketName = "naive-bayes-classifier-model-bucket";
  }

  async getObject(key: string): Promise<Uint8Array> {

    const command: S3.GetObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
    }

    const response = await this.s3Client.getObject(command).promise()

    const buffer = response.Body
    return buffer as Uint8Array
  }

  async uploadObject(key: string, object: any): Promise<void> {
    const command: S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: object
    }

    await this.s3Client.putObject(command).promise()
  }

  async deleteObject(key: string): Promise<void> {
    const command: S3.DeleteObjectRequest = {
      Bucket: this.bucketName,
      Key: key
    }

    await this.s3Client.deleteObject(command).promise()
  } 
}