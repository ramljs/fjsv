import {AnyFactory} from './AnyFactory';
import {TypeSchema} from '../Valgen';

export interface IBase64TypeSchema extends TypeSchema {
    default?: string;
}

export class Base64Factory extends AnyFactory {
    schema: IBase64TypeSchema;
}
