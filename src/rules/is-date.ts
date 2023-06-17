import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Nullish } from 'ts-gems';
import { Context, ValidationOptions, validator } from '../core/index.js';
import { omitKeys } from '../helpers/object.utils.js';

dayjs.extend(customParseFormat);

export interface IsDateOptions extends ValidationOptions {
  format?: string | string[];
}

/**
 * Validates if value is instance of "Date".
 * Converts input value to Date if coerce option is set to 'true'.
 * @validator isDate
 */
export function isDate(options?: IsDateOptions) {
  return validator<Date, Date | number | string>('isDate',
      function (input: unknown, context: Context): Nullish<Date> {
        if (input != null && !(input instanceof Date) && context.coerce) {
          if (typeof input === 'string') {
            const d = dayjs(input, options?.format);
            if (d.isValid())
              input = d.toDate();
          } else if (typeof input === 'number')
            input = new Date(input);
        }
        if (input && input instanceof Date && !isNaN(input.getTime()))
          return input;
        context.failure({
              message: `{{label}} is not a valid Date instance` +
                  (context.coerce
                      ? ` or a date formatted${options?.format ? " (" + options.format + ")" : ''} string`
                      : ''),
              format: options?.format
            }
        );
      }, omitKeys(options || {}, ['format'])
  );
}


export interface IsDateStringOptions extends ValidationOptions {
  format?: string;
}

/**
 * Validates if value is DFS (date formatted string).
 * Converts input value to DFS if coerce option is set to 'true'.
 * @validator isDateString
 */
export function isDateString(options?: IsDateStringOptions) {
  return validator<string, Date | number | string>('isDateString',
      function (input: unknown, context: Context): Nullish<string> {
        if (input && typeof input !== 'string' && context.coerce) {
          const d = dayjs(input as any);
          if (d.isValid())
            return options?.format ? d.format(options?.format) : d.toISOString()
        }
        if (typeof input === 'string') {
          const d = dayjs(input, options?.format);
          if (d.isValid())
            return input;
        }

        context.failure({
              message: `{{label}} is not a valid date formatted${
                  options?.format ? " (" + options.format + ")" : ''
              } string`,
              format: options?.format
            }
        );
      }, omitKeys(options || {}, ['format'])
  );
}
