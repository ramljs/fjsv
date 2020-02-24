import {AnyFactory} from './AnyFactory';
import {TypeSchema} from '../Valgen';

export type IntegerFormat = 'int64' | 'bigint' | 'int32' | 'int' | 'int16' | 'int8' |
    'uint64' | 'uint32' | 'uint16' | 'uint8' | 'long' | 'float';
export type FloatFormat = 'float' | 'double';
export type NumberFormat = IntegerFormat | FloatFormat;

export const NumberFormats: string[];
export const IntegerFormats: string[];
export const MinValues: { [format: string]: number };
export const MaxValues: { [format: string]: number };

export interface INumberTypeSchema extends TypeSchema {
    default?: number;
    enum?: number[];
    minimum?: number;
    maximum?: number;
    multipleOf?: number;
    strictFormat?: boolean;
}

export interface INumberTypeOptions {
    defaultFormat?: NumberFormat;
}

export class NumberFactory extends AnyFactory {
    schema: INumberTypeSchema;
    defaultFormat?: NumberFormat;

    constructor(options?: INumberTypeOptions);

}
