import {AnyFactory} from './AnyFactory';
import {TypeSchema} from '../Valgen';

export interface IUnionTypeSchema extends TypeSchema {
    anyOf?: Array<string | TypeSchema>;
}

export class UnionFactory extends AnyFactory {
    schema: IUnionTypeSchema;
    anyOf?: AnyFactory[];
}
