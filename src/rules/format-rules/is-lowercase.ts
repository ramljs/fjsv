import type { Nullish } from 'ts-gems';
import * as validatorJS from 'validator';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

/**
 * Validates if value a Lowercase string
 * @validator isLowercase
 */
export function isLowercase(options?: ValidationOptions) {
  return validator<string, string>(
    'isLowercase',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (typeof input === 'string' && validatorJS.isLowercase(input)) {
        return input;
      }
      context.fail(_this, `"{{value}}" is not a lowercase string`, input);
    },
    options,
  );
}

/**
 * Validates if value a Uppercase string
 * @validator isUppercase
 */
export function isUppercase(options?: ValidationOptions) {
  return validator<string, string>(
    'isUppercase',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (typeof input === 'string' && validatorJS.isUppercase(input)) {
        return input;
      }
      context.fail(_this, `"{{value}}" is not an uppercase string`, input);
    },
    options,
  );
}
