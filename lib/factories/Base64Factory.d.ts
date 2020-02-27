import {AnyFactory} from './AnyFactory';
import {Valgen} from '../Valgen';

export namespace Base64Factory {
    export interface ITypeSchema extends Valgen.ITypeSchema {
        default?: string;
    }
}

export class Base64Factory extends AnyFactory {
    schema: Base64Factory.ITypeSchema;
}
