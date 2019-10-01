import DataType from '../DataType';

export default class ArrayType extends DataType {
    items?: DataType;
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;

    protected _copyTo(target: ArrayType, overwrite?: boolean): void;

}
