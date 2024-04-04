import { MODEL_TYPE } from "./Classifier"

export class EventPayload {
    public id: string
    public name: string
    public description: string
    public type: MODEL_TYPE
    public format: string
    public status: string
    public path: string
    public isPublic: boolean
    public owners: string[]

    constructor({ id, name, format, status, path, isPublic, owners, type, description }: EventPayload) {
        this.id = id
        this.name = name
        this.description = description
        this.type = type
        this.format = format
        this.status = status
        this.path = path
        this.isPublic = isPublic
        this.owners = owners
    }
}