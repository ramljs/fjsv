import {AnyFactory} from './AnyFactory';
import {Valgen} from '../Valgen';

export namespace DateFactory {
    export interface ITypeSchema extends Valgen.ITypeSchema {
        default?: string;
        format?: string;
    }
    export interface IDateFormatMap {
        date?: string,
        datetime?: string,
        timestamp?: string,
        time?: string,
        rfc2616?: string
    }
    export interface IOptions {
        dateFormats?: IDateFormatMap;
        format?: string;
    }
}


export class DateFactory extends AnyFactory {

    schema: DateFactory.ITypeSchema;
    format?: string;
    dateFormats: DateFactory.IDateFormatMap;

    TIMESTAMP_PATTERN: RegExp;
    TIMESTAMP_STRICT_PATTERN: RegExp;
    DATETIME_PATTERN: RegExp;
    DATETIME_STRICT_PATTERN: RegExp;
    DATE_PATTERN: RegExp;
    DATE_STRICT_PATTERN: RegExp;
    TIME_PATTERN: RegExp;
    TIME_STRICT_PATTERN: RegExp;

    constructor(options?: DateFactory.IOptions);
}
