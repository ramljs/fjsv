import { Nullish } from 'ts-gems';
import { Context, ValidationOptions, validator } from '../core/index.js';

/**
 * Validates if value is "number".
 * Converts input value to number if coerce option is set to 'true'.
 * @validator isNumber
 */
export function isNumber(options?: ValidationOptions) {
  return validator<number, unknown>('isNumber',
      function (input: unknown, context: Context, _this): Nullish<number> {
        if (input != null && typeof input !== 'number' && context.coerce) {
          if (typeof input === 'string')
            input = parseFloat(input);
          if (typeof input === 'bigint') {
            const v = Number(input);
            if (input === BigInt(v))
              input = v;
          }
        }
        if (typeof input === 'number' && !isNaN(input))
          return input;
        context.fail(_this, `{{label}} must be a number`, input);
      }, options
  );
}
