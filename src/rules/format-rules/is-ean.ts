import { Nullish } from 'ts-gems';
import * as validatorJS from 'validator';
import { Context, ValidationOptions, validator } from '../../core/index.js';

/**
 * Validates if value is an EAN (European Article Number)
 * @validator isEAN
 */
export function isEAN(options?: ValidationOptions) {
  return validator<string, string>(
    'isEAN',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (typeof input === 'string' && validatorJS.isEAN(input)) return input;
      context.fail(
        _this,
        `"{{value}}" is not a valid EAN (European Article Number)`,
        input,
      );
    },
    options,
  );
}
