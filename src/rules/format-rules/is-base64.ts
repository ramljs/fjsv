import validatorJS from '@browsery/validator';
import type { Nullish } from 'ts-gems';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

export interface Base64ValidatorOptions
  extends ValidationOptions,
    validatorJS.IsBase64Options {}

/**
 * Validates if value is a "Base64" string.
 * @validator isBase64
 */
export function isBase64(options?: Base64ValidatorOptions) {
  return validator<string, string>(
    'isBase64',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (typeof input === 'string' && validatorJS.isBase64(input, options)) {
        return input;
      }
      context.fail(_this, `"{{value}}" is not a valid a Base64 string`, input);
    },
    options,
  );
}
