import {AnyType} from './AnyType';

export class ArrayType extends AnyType {
    default?: any[];
    items?: AnyType;
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
}
