import type { Nullish } from 'ts-gems';
import validatorJS from 'validator';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

/**
 * Validates if value is a BTC address.
 * @validator isBtcAddress
 */
export function isBtcAddress(options?: ValidationOptions) {
  return validator<string, string>(
    'isBtcAddress',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (typeof input === 'string' && validatorJS.isBtcAddress(input)) {
        return input;
      }
      context.fail(_this, `Value is not a valid a BTC address`, input);
    },
    options,
  );
}
