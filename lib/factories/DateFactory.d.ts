import {AnyFactory} from './AnyFactory';
import {TypeSchema} from '../Valgen';

declare interface IDateFormatMap {
    date?: string,
    datetime?: string,
    timestamp?: string,
    time?: string,
    rfc2616?: string
}

export interface IDateTypeOptions {
    dateFormats?: IDateFormatMap;
    defaultFormat?: string;
}

export interface IDateTypeSchema extends TypeSchema {
    default?: string;
    format?: string;
}

export class DateFactory extends AnyFactory {

    schema: IDateTypeSchema;
    defaultFormat?: string;
    dateFormats: IDateFormatMap;

    TIMESTAMP_PATTERN: RegExp;
    TIMESTAMP_STRICT_PATTERN: RegExp;
    DATETIME_PATTERN: RegExp;
    DATETIME_STRICT_PATTERN: RegExp;
    DATE_PATTERN: RegExp;
    DATE_STRICT_PATTERN: RegExp;
    TIME_PATTERN: RegExp;
    TIME_STRICT_PATTERN: RegExp;

    constructor(options?: IDateTypeOptions);
}
