import {AnyFactory} from './AnyFactory';
import {TypeSchema} from '../Valgen';

export interface IArrayTypeSchema extends TypeSchema {
    default?: any[];
    items?: string | TypeSchema;
    minItems?: number;
    maxItems?: number;
}

export class ArrayFactory extends AnyFactory {
    schema: IArrayTypeSchema;
}
