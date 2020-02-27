import {AnyFactory} from './AnyFactory';
import {Valgen} from '../Valgen';

export namespace NumberFactory {
    export type IntegerFormatType = 'int64' | 'bigint' | 'int32' | 'int' | 'int16' | 'int8' |
        'uint64' | 'uint32' | 'uint16' | 'uint8' | 'long' | 'float';
    export type FloatFormatType = 'float' | 'double';
    export type NumberFormatType = IntegerFormatType | FloatFormatType;

    export interface ITypeSchema extends Valgen.ITypeSchema {
        default?: number;
        enum?: number[];
        minimum?: number;
        maximum?: number;
        multipleOf?: number;
        strictFormat?: boolean;
    }

    export interface IOptions {
        defaultFormat?: NumberFormatType;
    }

}

export const NumberFormats: string[];
export const IntegerFormats: string[];
export const MinValues: { [format: string]: number };
export const MaxValues: { [format: string]: number };

export class NumberFactory extends AnyFactory {
    schema: NumberFactory.ITypeSchema;
    defaultFormat?: NumberFactory.NumberFormatType;

    constructor(options?: NumberFactory.IOptions);

}
