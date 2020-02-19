import {AnyType} from './AnyType';

export type IntegerFormat = 'int64' | 'bigint' | 'int32' | 'int' | 'int16' | 'int8' |
    'uint64' | 'uint32' | 'uint16' | 'uint8' | 'long' | 'float';
export type FloatFormat = 'float' | 'double';
export type NumberFormat = IntegerFormat | FloatFormat;

export interface INumberTypeOptions {
    format?: NumberFormat;
}

export class NumberType extends AnyType {
    default?: number;
    enum?: number[];
    format?: NumberFormat;
    minimum?: number;
    maximum?: number;
    multipleOf?: number;

    static NumberFormats: string[];
    static IntegerFormats: string[];
    static MinValues: { [index: string]: number };
    static MaxValues: { [index: string]: number };

    constructor(options?: INumberTypeOptions);

}
