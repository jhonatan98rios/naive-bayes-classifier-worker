
export abstract class AbstractStorageProvider {
  abstract getObject(key: string): Promise<Uint8Array>
  abstract uploadObject(key: string, object: any): Promise<void> 
  abstract deleteObject(key: string): Promise<void> 
}