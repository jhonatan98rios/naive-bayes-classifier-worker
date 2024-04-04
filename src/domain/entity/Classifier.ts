export enum STATUS {
    READY = 'ready',
    INPROGRESS = 'inProgress',
    FAILED = 'failed'
}

export enum MODEL_TYPE {
    NLP = 'nlp',
    NUM = 'num',
}

export class Classifier {
    id: string
    name: string
    description: string
    type: MODEL_TYPE
    size: number
    format: string
    accuracy: number
    status: STATUS
    rating: number
    path: string
    isPublic: boolean
    owners: string[]

    constructor({ id, name, description, type, size, format, accuracy, status, rating, path, isPublic, owners }: Classifier) {
        this.id = id
        this.name = name
        this.description = description
        this.type = type
        this.size = size
        this.format = format
        this.accuracy = accuracy
        this.status = status
        this.rating = rating
        this.path = path
        this.isPublic = isPublic
        this.owners = owners
    }
}