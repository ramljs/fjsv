import type { Nullish } from 'ts-gems';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

/**
 * Validates if value is "number".
 * Converts input value to number if coerce option is set to 'true'.
 * @validator isNumber
 */
export function isNumber(options?: ValidationOptions) {
  return validator<number, unknown>(
    'isNumber',
    (input: unknown, context: Context, _this): Nullish<number> => {
      const coerce = options?.coerce || context.coerce;
      let output: any = input;
      if (output != null && typeof output !== 'number' && coerce) {
        if (typeof input === 'string') output = parseFloat(input);
        else if (typeof input === 'bigint') {
          output = Number(input);
          if (input === BigInt(output)) return output;
        }
      }

      if (typeof output === 'number' && !isNaN(output)) return output;
      const t =
        typeof input === 'bigint'
          ? 'BigInt '
          : typeof input === 'string'
            ? 'String '
            : '';
      context.fail(_this, `${t}"{{value}}" is not a valid number value`, input);
    },
    options,
  );
}
