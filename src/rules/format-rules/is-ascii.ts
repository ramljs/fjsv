import { Nullish } from 'ts-gems';
import * as validatorJS from 'validator';
import { Context, ValidationOptions, validator } from '../../core/index.js';

/**
 * Check if the string contains ASCII chars only.
 * @validator isAscii
 */
export function isAscii(options?: ValidationOptions) {
  return validator<string, string>(
    'isAscii',
    function (input: unknown, context: Context, _this): Nullish<string> {
      if (typeof input === 'string' && validatorJS.isAscii(input)) return input;
      context.fail(_this, `Value is not an ascii string`, input);
    },
    options,
  );
}
