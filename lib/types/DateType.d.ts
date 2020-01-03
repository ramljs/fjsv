import AnyType from './AnyType';

export interface IDateTypeOptions {
    dateFormats?: {
        date: string,
        datetime: string,
        timestamp: string,
        time: string,
        rfc2616: string
    };
    format?: string;
}

export default class DateType extends AnyType {

    dateFormats: { [index: string]: string };
    TIMESTAMP_PATTERN: RegExp;
    TIMESTAMP_STRICT_PATTERN: RegExp;
    DATETIME_PATTERN: RegExp;
    DATETIME_STRICT_PATTERN: RegExp;
    DATE_PATTERN: RegExp;
    DATE_STRICT_PATTERN: RegExp;
    TIME_PATTERN: RegExp;
    TIME_STRICT_PATTERN: RegExp;

    default: string | Date;
    format?: string;

    constructor(options?: IDateTypeOptions);
}
