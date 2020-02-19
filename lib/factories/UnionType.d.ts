import {AnyType} from './AnyType';

export class UnionType extends AnyType {
    anyOf?: AnyType[];
}
