import {AnyFactory} from './AnyFactory';
import {Valgen} from '../Valgen';

export namespace BooleanFactory {
    export interface ITypeSchema extends Valgen.ITypeSchema {
        default?: boolean;
    }
}

export class BooleanFactory extends AnyFactory {
    schema: BooleanFactory.ITypeSchema;
}
