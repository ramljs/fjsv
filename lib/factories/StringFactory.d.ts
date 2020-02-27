import {AnyFactory} from './AnyFactory';
import {Valgen} from '../Valgen';

export namespace StringFactory {
    export interface ITypeSchema extends Valgen.ITypeSchema {
        default?: string;
        enum?: string[];
        pattern?: string;
        minLength?: number;
        maxLength?: number;
    }
}

export class StringFactory extends AnyFactory {
    schema: StringFactory.ITypeSchema;
}
