import {AnyFactory} from './AnyFactory';
import {TypeSchema} from '../Valgen';

export interface IStringTypeSchema extends TypeSchema {
    default?: string;
    enum?: string[];
    pattern?: string;
    minLength?: number;
    maxLength?: number;
}

export class StringFactory extends AnyFactory {
    schema: IStringTypeSchema;
}
