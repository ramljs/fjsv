import { Context, Nullish, ValidationOptions, validator } from '../core/index.js';

/**
 * Validates if value is "integer".
 * Converts input value to integer number if coerce option is set to 'true'.
 * @validator isInteger
 */
export function isInteger(options?: ValidationOptions) {
  return validator<number, unknown>('isInteger',
      function (input: unknown, context: Context): Nullish<number> {
        if (input != null && typeof input !== 'number' && context.coerce) {
          if (typeof input === 'string')
            input = parseFloat(input);
          if (typeof input === 'bigint') {
            const v = Number(input);
            if (input === BigInt(v))
              input = v;
          }
        }
        if (typeof input === 'number' && !isNaN(input) && Number.isInteger(input))
          return input;
        context.failure(`{{label}} is not a valid integer number`);
      }, options
  );
}
