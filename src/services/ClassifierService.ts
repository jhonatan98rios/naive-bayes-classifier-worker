import { BayesClassifier } from 'natural'

import { trainRow } from "../types/trainRow"

import { CSVRepository } from "../infra/repositories/CsvRepository"
import { EventPayload } from "../domain/entity/EventPayload"
import { Classifier, STATUS } from '../domain/entity/Classifier';

import { AbstractClassifierRepository } from '../domain/repositories/AbstractClassifierRepository';
import { AbstractStorageProvider } from '../domain/providers/AbstractStorageProvider'


export class ClassifierService {

    constructor(private storageProvider: AbstractStorageProvider, private csvRepository: CSVRepository, private classifierRepository: AbstractClassifierRepository) {}

    public async execute(eventPayload: EventPayload) {

        try {
            /* Read CSV from S3 */
            console.log("Reading object... ", eventPayload.path)        
            const object = await this.storageProvider.getObject(eventPayload.path)
        
            if (!object) throw new Error(`File ${eventPayload.path} doesn't exist`)

            /* Parse CSV from buffer */
            const dataset = await this.parseCSV(object)

            /* Split data in Train and Test */
            const { trainDataset, testDataset } = this.splitTrainTestDataset(dataset)

            console.log('trainDataset.length', trainDataset.length)
            console.log('testDataset.length', testDataset.length)

            /* Train classifier with CSV Train Dataset */
            const classifier = this.createClassifier(trainDataset)

            /* Test classifier with CSV Test Dataset */
            const accuracy = this.calculateAccuracy(classifier, testDataset)

            /* Classifier model */
            const { filename, filesize } = await this.saveClassifier(classifier, eventPayload)

            /* Update the classifier model register in MongoDB */
            const updateClassifierDTO = new Classifier({
                id: eventPayload.id,
                name: eventPayload.name,
                accuracy,
                format: 'csv',
                isPublic: eventPayload.isPublic,
                owners: eventPayload.owners,
                path: filename,
                rating: 0,
                size: filesize,
                status: STATUS.READY,
                description: ''
            })

            const updatedClassifier = await this.classifierRepository.update(eventPayload.id, updateClassifierDTO)
            console.log("updatedClassifier")
            console.log(updatedClassifier)

            /* Delete CSV from S3 */
            //this.storageProvider.deleteObject(eventPayload.path)

        } catch (err) {
            console.log(err)

            const updateClassifierDTO = new Classifier({
                id: eventPayload.id,
                name: eventPayload.name,
                accuracy: 0,
                format: 'csv',
                isPublic: eventPayload.isPublic,
                owners: eventPayload.owners,
                path: eventPayload.path,
                rating: 0,
                size: 0,
                status: STATUS.FAILED,
                description: ''
            })

            const updatedClassifier = await this.classifierRepository.update(eventPayload.id, updateClassifierDTO)
            console.log(updatedClassifier)
            throw new Error(JSON.stringify(err))
        }
    }

    async parseCSV(object: Uint8Array): Promise<trainRow[]> {
        console.log("Parsing file...")
        const buffer = Buffer.from(object)
        const dataset: trainRow[] = await this.csvRepository.parseCSVBuffer(buffer)
        console.log("Rows: ", dataset.length)
        return dataset
    }

    splitTrainTestDataset(dataset: trainRow[]) {
        const trainPercentage = 50
        const trainDatasetLength = Math.round((dataset.length / 100) * trainPercentage)

        const shuffledTrainDataset = this.shuffleDataset(dataset)
        const trainDataset = shuffledTrainDataset.slice(0, trainDatasetLength)
        const testDataset = shuffledTrainDataset.slice(trainDatasetLength)
        return { testDataset, trainDataset }
    }

    createClassifier(trainDataset: trainRow[]) {
        const classifier = new BayesClassifier()
        trainDataset.forEach((row) => classifier.addDocument(row.sample, this.normalizeString(row.label)))
        classifier.train()
        return classifier
    }

    async saveClassifier(classifier: BayesClassifier, eventPayload: EventPayload) {
        const stringfiedModel = JSON.stringify(classifier)
        const bufferedModel = Buffer.from(stringfiedModel)
        
        /* Upload compressed classifier to S3 */
        const filename = eventPayload.path.replaceAll("raw/", "model/").replaceAll("-train.csv", "") + ".model.json"
        await this.storageProvider.uploadObject(filename, bufferedModel)
        console.log("File uploaded")
        
        const filesize = (bufferedModel.byteLength / 1024)
        console.log("filesize: ", filesize.toPrecision(3) + "kb")
        
        return { filename, filesize }
    }
    
    calculateAccuracy(classifier: BayesClassifier, testDataset: trainRow[]) {
        const successDataset = testDataset.filter(row => {
            let res = classifier.classify(row.sample)
            return res == this.normalizeString(row.label)
        })
        const successPercentage = successDataset.length * 100 / testDataset.length
        console.log("successDataset: ", successDataset.length)

        return Number(successPercentage.toFixed(2))
    }

    normalizeString(text: string) {
        return text.replace(/\s/g, '').toLowerCase()
    }

    shuffleDataset(array: trainRow[]) { 
        return array.sort(() => Math.random() - 0.5); 
    };
}