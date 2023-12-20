import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Nullish } from 'ts-gems';
import { Context, ValidationOptions, validator } from '../core/index.js';

dayjs.extend(customParseFormat);
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
        if (input != null && !(input instanceof Date) && context.coerce) {
          if (typeof input === 'string' && context.coerce) {
            const d = dayjs(input);
            if (d.isValid())
              input = d.toDate();
          } else if (typeof input === 'number')
            input = new Date(input);
        }
        if (input && input instanceof Date && !isNaN(input.getTime())) {
          if (precision === 'year') {
            input.setHours(0, 0, 0, 0);
            input.setMonth(0, 1);
          }
          if (precision === 'month') {
            input.setHours(0, 0, 0, 0);
            input.setDate(1);
          }
          if (precision === 'date')
            input.setHours(0, 0, 0, 0);
          return input;
        }
        context.fail(_this, `{{label}} must be a Date instance or a date string`, input);
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
        if (typeof input === 'string') {
          const d = dayjs(input);
          if (d.isValid()) {
            const m = DATE_PATTERN.exec(input);
            if (m) {
              if (
                  !precision ||
                  precision === 'year' ||
                  (precision === 'month' && m[2]) ||
                  (precision === 'date' && m[2] && m[3]) ||
                  (precision === 'time' && m[2] && m[3] && m[4])
              ) {
                if (!context.coerce)
                  return input;
                let s = m[1];
                if (m[2]) s += '-' + m[2]; else return s;
                if (m[3]) s += '-' + m[3]; else return s;
                if (trim === 'date' || !m[4]) return s;
                s += 'T' + m[4];
                if (trim === 'time') return s;
                if (m[9]) s += m[9];
                return s;
              }
            }

          }
        } else if (input != null) {
          const d = dayjs(input);
          if (d.isValid()) {
            if (trim === 'date')
              return d.format('YYYY-MM-DD')
            return d.millisecond() ? d.format('YYYY-MM-DDTHH:mm:ss.SSS') : d.format('YYYY-MM-DDTHH:mm:ss')
          }
        }

        context.fail(_this,
            `{{label}} is not a valid date string`,
            input,
            {...options}
        );

      }, options
  );
}

export namespace isDate {
  export interface Options extends ValidationOptions {
    precision?: 'year' | 'month' | 'date' | 'time'
  }

}
