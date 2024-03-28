import { Classifier } from "../../domain/entity/Classifier";
import { AbstractClassifierRepository } from "../../domain/repositories/AbstractClassifierRepository";
import { IClassifierModel, ClassifierModel } from "../models/Classifier.schema";


export class MongoDBClassifierRepository implements AbstractClassifierRepository {

    private classifierModel: IClassifierModel

    constructor() {
        this.classifierModel = ClassifierModel.getInstance()
    }

    async create(classifier: Classifier): Promise<Classifier> {
        await this.classifierModel.create(classifier)
        return classifier
    }

    async readAll(): Promise<Classifier[]> {
        const users = await this.classifierModel.find()
        return users
    }

    async readOneById(classifier: string): Promise<Classifier | null> {
        const foundClassifier = await this.classifierModel.findOne({ classifier })
        return foundClassifier
    }

    async update(id: string, classifier: Partial<Classifier>): Promise<Partial<Classifier>> {
        await this.classifierModel.findOneAndUpdate({ id }, classifier)
        return classifier
    }
}