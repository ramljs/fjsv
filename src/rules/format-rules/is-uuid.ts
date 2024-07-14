import { Nullish } from 'ts-gems';
import * as validatorJS from 'validator';
import { Context, ValidationOptions, validator } from '../../core/index.js';

/**
 * Validates if value is an "UUID".
 * @validator isUUID
 */
export function isUUID(
  version?: 1 | 2 | 3 | 4 | 5,
  options?: ValidationOptions,
) {
  return validator<string, string>(
    'isUUID',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (
        input != null &&
        typeof input === 'string' &&
        validatorJS.isUUID(input, version)
      ) {
        return input;
      }
      context.fail(
        _this,
        `{{label}} is not a valid UUID${version ? ' v' + version : ''}`,
        input,
      );
    },
    options,
  );
}
