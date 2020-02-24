import {DataType} from './DataType';

export class UnionType extends DataType {
    anyOf?: DataType[];
}
