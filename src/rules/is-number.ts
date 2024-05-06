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
        const coerce = options?.coerce || context.coerce;
        if (input != null && typeof input !== 'number' && coerce) {
          if (typeof input === 'string')
            input = parseFloat(input);
          if (typeof input === 'bigint') {
            const v = Number(input);
            if (input === BigInt(v))
              return v;
          }
        }

        if (typeof input === 'number' && !isNaN(input))
          return input;
        const t = typeof input === 'bigint' ? 'BigInt ' :
            (typeof input === 'string' ? 'String ' : '');
        context.fail(_this, `${t}"{{value}}" is not a valid number value`, input);
      }, options
  );
}
