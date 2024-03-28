import { parse } from 'csv-parse/sync';
import fs from 'fs'


export class CSVRepository {

    constructor() {}

    public async readFile(filePath: string) {
        const file = fs.readFileSync(filePath)
        return this.parseCSVBuffer(file)
    }

    public async parseCSVBuffer(buffer: Buffer) {
        try {
            const records = parse(buffer, {
                columns: true,
                delimiter: ';'
            })
            return records

        } catch (err) {
            return err
        }
    }
}