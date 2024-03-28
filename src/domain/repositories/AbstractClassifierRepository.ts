import { Classifier } from "../entity/Classifier";

export abstract class AbstractClassifierRepository {

    abstract create(model: Classifier): Promise<any>
    abstract readAll(): Promise<Classifier[]>
    abstract readOneById(id: string): Promise<Classifier|null>
    abstract update(id: string, model: Classifier): Promise<Partial<Classifier>>
}