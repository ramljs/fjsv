import { formatISO, parseISO } from 'date-fns';
import { Nullish } from 'ts-gems';
import { Context, ValidationOptions, validator } from '../core/index.js';

/* eslint-disable-next-line max-len */ // noinspection RegExpUnnecessaryNonCapturingGroup
const DATE_PATTERN = /^(\d{4})(?:-(0[0-9]|1[0-2]))?(?:-([0-2][0-9]|3[0-1]))?(?:[T ](([0-1][0-9]|2[0-4]):([0-5][0-9])(?::([0-5][0-9]))?(?:\.(\d{0,3}))?)?((?:[+-](0[0-9]|1[0-2])(?::(\d{2}))?)|Z)?)?$/;


/**
 * Validates if value is instance of "Date".
 * Converts input value to Date if coerce option is set to 'true'.
 * @validator isDate
 */
export function isDate(options?: isDate.Options) {
  const precision = options?.precision;
  return validator<Date, Date | number | string>('isDate',
      function (
          input: unknown,
          context: Context,
          _this
      ): Nullish<Date> {
        const coerce = options?.coerce || context.coerce;
        let d: Date | undefined;
        if (input instanceof Date)
          d = input;
        else if (input != null && coerce) {
          if (typeof input === 'string' && coerce) {
            d = parseISO(input);
          } else if (typeof input === 'number')
            d = new Date(input);
        }
        if (d && !isNaN(d.getTime())) {
          if (precision === 'year') {
            d.setHours(0, 0, 0, 0);
            d.setMonth(0, 1);
          }
          if (precision === 'month') {
            d.setHours(0, 0, 0, 0);
            d.setDate(1);
          }
          if (precision === 'date')
            d.setHours(0, 0, 0, 0);
          return d;
        }
        context.fail(_this, `"{{value}}" is not a valid date value`, input, {...options});
      }, options
  );
}


export interface IsDateStringOptions extends ValidationOptions {
  precision?: 'year' | 'month' | 'date' | 'time'
  trim?: 'date' | 'time';
}

/**
 * Validates if value is DFS (date formatted string).
 * Converts input value to DFS if coerce option is set to 'true'.
 * @validator isDateString
 */
export function isDateString(options?: IsDateStringOptions) {
  const precision = options?.precision;
  const trim = options?.trim;
  return validator<string, Date | number | string>('isDateString',
      function (
          input: any,
          context: Context,
          _this
      ): Nullish<string> {
        const coerce = options?.coerce || context.coerce;
        if (typeof input === 'string') {
          const m = DATE_PATTERN.exec(input);
          if (m) {
            const d = parseISO(input);
            if (d && !isNaN(d.getTime())) {
              if (
                  !precision ||
                  precision === 'year' ||
                  (precision === 'month' && m[2]) ||
                  (precision === 'date' && m[2] && m[3]) ||
                  (precision === 'time' && m[2] && m[3] && m[4])
              ) {
                if (!coerce)
                  return input;
                let s = m[1];
                if (m[2]) s += '-' + m[2]; else return s;
                if (m[3]) s += '-' + m[3]; else return s;
                if (trim === 'date' || !m[4]) return s;
                s += 'T' + m[4].substring(0, 8);
                if (trim === 'time') return s;
                if (m[9]) s += m[9];
                return s;
              }
            }

          }
        } else if (input instanceof Date) {
          return trim === 'date'
              ? formatISO(input, {representation: 'date'})
              : formatISO(input).substring(0, 19)
        }

        context.fail(_this, `"{{value}}" is not a valid date string`, input, {...options});

      }, options
  );
}

export namespace isDate {
  export interface Options extends ValidationOptions {
    precision?: 'year' | 'month' | 'date' | 'time'
  }

}
