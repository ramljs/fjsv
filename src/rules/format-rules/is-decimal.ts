import type { Nullish } from 'ts-gems';
import * as validatorJS from 'validator';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

/**
 * Check if the string represents a decimal number,
 * such as `0.1`, `.3`, `1.1`, `1.00003`, `4.0` etc.
 * @validator isDecimal
 */
export function isDecimal(options?: ValidationOptions) {
  return validator<string, string>(
    'isDecimal',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (typeof input === 'string' && validatorJS.isDecimal(input)) {
        return input;
      }
      context.fail(_this, `"{{value}}" is not an decimal number string`, input);
    },
    options,
  );
}
