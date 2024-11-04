import type { Nullish } from 'ts-gems';
import validatorJS from 'validator';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

/**
 * Validates if value is a passport number
 * @validator isPassportNumber
 */
export function isPassportNumber(
  countryCode: string,
  options?: ValidationOptions,
) {
  return validator<string, string>(
    'isPassportNumber',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (
        typeof input === 'string' &&
        validatorJS.isPassportNumber(input, countryCode)
      ) {
        return input;
      }
      context.fail(
        _this,
        `"{{value}}" is not a valid ${countryCode} PassportNumber)`,
        input,
      );
    },
    options,
  );
}
