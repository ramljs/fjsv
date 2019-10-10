import DataType from '../DataType';

export default class NumberType extends DataType {
    enum?: number[];
    format?: 'int64' | 'bigint' | 'int32' | 'int' | 'int16' | 'int8' |
        'uint64' | 'uint32' | 'uint16' | 'uint8' | 'long' | 'float' | 'double';
    minimum?: number;
    maximum?: number;
    multipleOf?: number;

    protected _getFormat(): string;

    static NumberFormats: string[];
    static IntegerFormats: string[];
    static MinValues: { [index: string]: number };
    static MaxValues: { [index: string]: number };
}
