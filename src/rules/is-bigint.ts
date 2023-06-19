import { Nullish } from 'ts-gems';
import { Context, ValidationOptions, validator } from '../core/index.js';

/**
 * Validates if value is "BigInt".
 * Converts input value to number if coerce option is set to 'true'.
 * @validator isNumber
 */
export function isBigint(options?: ValidationOptions) {
  return validator<bigint, unknown>('isBigint',
      function (input: unknown, context: Context): Nullish<bigint> {
        if (input != null && typeof input !== 'bigint' && context.coerce) {
          if (typeof input === 'string' || typeof input === 'number')
            input = BigInt(input);
        }
        if (typeof input === 'bigint')
          return input;
        context.failure(`{{label}} is not a valid BigInt`);
      }, options
  );
}
