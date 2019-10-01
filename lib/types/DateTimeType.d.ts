import AnyType from './AnyType';

export default class DateTimeType extends AnyType {

    default: string | Date;
    format: string;

    protected _getFormat(): string;

    protected _mapFormat(format: string): string;

    protected _getFormatDateFn(): (d: Date) => string;

    protected _getFormatDateItemsFn(): (m: number[]) => string;

    protected _getMatchDatePatternFn(): (v: string) => number[];

    static DateFormats: string[];
    static TIMESTAMPLIKE_PATTERN: RegExp;
    static TIMESTAMP_PATTERN: RegExp;
    static DATETIMEONLY_PATTERN: RegExp;
    static DATEONLY_PATTERN: RegExp;
    static TIMEONLY_PATTERN: RegExp;
}
