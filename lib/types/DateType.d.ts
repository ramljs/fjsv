import TypeFactory from '../TypeFactory';

export default class DateType extends TypeFactory {

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
}
