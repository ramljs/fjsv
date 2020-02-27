import {AnyFactory} from './AnyFactory';
import {Valgen} from '../Valgen';

export namespace FunctionFactory {
    export interface ITypeSchema extends Valgen.ITypeSchema {
        default?: Function;
    }
}

export class FunctionFactory extends AnyFactory {
    schema: FunctionFactory.ITypeSchema;
}
