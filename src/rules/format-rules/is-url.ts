import validatorJS from '@browsery/validator';
import type { Nullish } from 'ts-gems';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

export interface IsURLOptions
  extends ValidationOptions,
    validatorJS.IsURLOptions {}

/**
 * Validates if value is an URL
 * @validator isURL
 */
export function isURL(options?: IsURLOptions) {
  return validator<string, string>(
    'isURL',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (
        input != null &&
        typeof input === 'string' &&
        validatorJS.isURL(input, options)
      ) {
        return input;
      }
      context.fail(_this, `{{value}} is not a valid URL`, input);
    },
    options,
  );
}
