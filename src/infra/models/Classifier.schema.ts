import { Model, model, Schema } from 'mongoose'
import { Classifier } from "../../domain/entity/Classifier"

const ClassifierSchema: Schema = new Schema<Classifier, Model<Classifier>>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: false },
    description: { type: String, required: true, unique: false },
    size: { type: Number, required: true, unique: false },
    format: { type: String, required: true, unique: false },
    accuracy: { type: Number, required: true, unique: false },
    status: { type: String, required: true, unique: false },
    rating: { type: Number, required: true, unique: false },
    path: { type: String, required: true, unique: false },
    isPublic: { type: Boolean, required: true, unique: false },
    owners: { type: [String], required: true, unique: false },
})

export type IClassifierModel = Model<Classifier>

export class ClassifierModel {
    static getInstance() {
        return model<Classifier>('Classifier', ClassifierSchema)
    }
}