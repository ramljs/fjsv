import AnyType from './AnyType';

export default class NumberType extends AnyType {
    default?: number;
    enum?: number[];
    format?: string;
    minimum?: number;
    maximum?: number;
    multipleOf?: number;

    static NumberFormats: string[];
    static IntegerFormats: string[];
    static MinValues: { [index: string]: number };
    static MaxValues: { [index: string]: number };
}
