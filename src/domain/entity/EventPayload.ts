export class EventPayload {
    public id: string
    public name: string
    public format: string
    public status: string
    public path: string
    public isPublic: boolean
    public owners: string[]
    public type: string

    constructor({ id, name, format, status, path, isPublic, owners, type }: EventPayload) {
        this.id = id
        this.name = name
        this.format = format
        this.status = status
        this.path = path
        this.isPublic = isPublic,
        this.owners = owners,
        this.type = type
    }
}