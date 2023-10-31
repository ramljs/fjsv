import { Nullish } from 'ts-gems';
import { Context, ValidationOptions, validator } from '../core/index.js';

/**
 * Validates if value is "BigInt".
 * Converts input value to number if coerce option is set to 'true'.
 * @validator isNumber
 */
export function isBigint(options?: ValidationOptions) {
  return validator<bigint, unknown>('isBigint',
      function (
          input: unknown,
          context: Context,
          _this
      ): Nullish<bigint> {
        if (typeof input === 'bigint')
          return input;
        if ((typeof input === 'number' && !isNaN(input)) ||
            (typeof input === 'string' && context.coerce))
          return BigInt(input);
        context.fail(_this, `{{label}} must be an integer number`, input);
      }, options
  );
}
