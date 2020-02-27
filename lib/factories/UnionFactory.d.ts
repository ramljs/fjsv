import {AnyFactory} from './AnyFactory';
import {Valgen} from '../Valgen';

export namespace UnionFactory {
    export interface ITypeSchema extends Valgen.ITypeSchema {
        anyOf?: Array<string | Valgen.ITypeSchema>;
    }
}

export class UnionFactory extends AnyFactory {
    schema: UnionFactory.ITypeSchema;
    anyOf?: AnyFactory[];
}
