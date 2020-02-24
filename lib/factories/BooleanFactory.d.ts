import {AnyFactory} from './AnyFactory';
import {TypeSchema} from '../Valgen';

export interface IBooleanTypeSchema extends TypeSchema {
    default?: boolean;
}

export class BooleanFactory extends AnyFactory {
    schema: IBooleanTypeSchema;
}
