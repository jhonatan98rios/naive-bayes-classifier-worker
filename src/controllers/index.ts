import { Message } from "@aws-sdk/client-sqs";
import { EventPayload } from "../domain/entity/EventPayload";
import { S3ProviderV2 } from "../infra/providers/S3ProviderV2";
import { ClassifierService } from "../services/ClassifierService";
import { CSVRepository } from "../infra/repositories/CsvRepository";
import { MongoDBClassifierRepository } from "../infra/repositories/MongoDBClassifierRepository";

export default class ClasssifierController {

    public async handle(message: Message) {
        console.time('benchmark');

        const eventPayload = new EventPayload(JSON.parse(message.Body!))
        console.log("begin eventPayload")
        console.log(eventPayload)

        const csvRepository = new CSVRepository()
        const storageProvider = new S3ProviderV2()
        const classifierRepository = new MongoDBClassifierRepository()

        const trainClassifierService = new ClassifierService(storageProvider, csvRepository, classifierRepository)
        await trainClassifierService.execute(eventPayload)
        
        console.timeEnd('benchmark');
    }
}