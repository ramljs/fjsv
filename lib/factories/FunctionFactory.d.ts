import {AnyFactory} from './AnyFactory';
import {TypeSchema} from '../Valgen';

export interface IFunctionTypeSchema extends TypeSchema {
    default?: Function;
}

export class FunctionFactory extends AnyFactory {
    schema: IFunctionTypeSchema;
}
