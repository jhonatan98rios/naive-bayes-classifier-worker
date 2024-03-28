import * as zlib from 'zlib';
import fs from 'fs'

export class GzipUtil {
    // Método para comprimir um JSON em gzip
    static compress(jsonString: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            zlib.gzip(jsonString, (error, result) => {
                if (error) reject(error);
                resolve(result)
            });
        });
    }
}
