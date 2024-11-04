import type { Nullish } from 'ts-gems';
import validatorJS from 'validator';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

/**
 * Validates if value is a ETH (Ethereum) address.
 * @validator isETHAddress
 */
export function isETHAddress(options?: ValidationOptions) {
  return validator<string, string>(
    'isETHAddress',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (typeof input === 'string' && validatorJS.isEthereumAddress(input)) {
        return input;
      }
      context.fail(
        _this,
        `Value is not a valid a ETH (Ethereum) address`,
        input,
      );
    },
    options,
  );
}
