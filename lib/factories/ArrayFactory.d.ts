import {AnyFactory} from './AnyFactory';
import {Valgen} from '../Valgen';

export namespace ArrayFactory {
    export interface ITypeSchema extends Valgen.ITypeSchema {
        default?: any[];
        items?: string | Valgen.ITypeSchema;
        minItems?: number;
        maxItems?: number;
    }
}


export class ArrayFactory extends AnyFactory {
    schema: ArrayFactory.ITypeSchema;
}
