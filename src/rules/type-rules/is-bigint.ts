import { Nullish } from 'ts-gems';
import { Context, ValidationOptions, validator } from '../../core/index.js';

/**
 * Validates if value is "BigInt".
 * Converts input value to number if coerce option is set to 'true'.
 * @validator isNumber
 */
export function isBigint(options?: ValidationOptions) {
  return validator<bigint, unknown>(
    'isBigint',
    (input: unknown, context: Context, _this): Nullish<bigint> => {
      const coerce = options?.coerce || context.coerce;
      if (typeof input === 'bigint') return input;
      if (
        (typeof input === 'number' && !isNaN(input)) ||
        (typeof input === 'string' && coerce)
      ) {
        return BigInt(input);
      }
      const t = typeof input === 'string' ? 'String ' : '';
      context.fail(_this, `${t}"{{value}}" is not a valid BigInt value`, input);
    },
    options,
  );
}
