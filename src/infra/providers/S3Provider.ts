import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv'
import { handlePromise } from "../../utils/handlePromise";
import { AbstractStorageProvider } from "../../domain/providers/AbstractStorageProvider";

dotenv.config()

export class S3Provider implements AbstractStorageProvider {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({ region: process.env.AWS_REGION! });
    this.bucketName = process.env.BUCKET_NAME!;
  }

  async getObject(key: string): Promise<Uint8Array> {

    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key })

    const [getObjectError, object] = await handlePromise<GetObjectCommandOutput>(
      this.s3Client.send(command)
    )
    if (getObjectError || !object.Body) throw new Error(`S3 object does not exist: ${getObjectError}`)

    const [ transformError, buffer ] = await handlePromise<Uint8Array>(object.Body.transformToByteArray())
    if (transformError) throw new Error(`S3 object is corrupted ${transformError}`)

    return buffer;
  }

  async uploadObject(key: string, object: any): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: object
    })

    const [err] = await handlePromise(this.s3Client.send(command))
    if (err) throw new Error(`Error while uploading file: ${err}`)

  }

  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    const [err] = await handlePromise(this.s3Client.send(command))
    if (err) throw new Error(`Error while deleting file: ${err}`)
  } 
}