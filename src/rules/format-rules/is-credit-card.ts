import { Nullish } from 'ts-gems';
import * as validatorJS from 'validator';
import { Context, ValidationOptions, validator } from '../../core/index.js';

export interface CreditCardValidatorOptions extends ValidationOptions, validatorJS.IsCreditCardOptions {}

/**
 * Validates if value is a credit card number
 * @validator isCreditCard
 */
export function isCreditCard(options?: CreditCardValidatorOptions) {
  return validator<string, string>(
    'isCreditCard',
    function (input: unknown, context: Context, _this): Nullish<string> {
      if (typeof input === 'string' && validatorJS.isCreditCard(input, options)) return input;
      context.fail(_this, `"{{value}}" is not a valid Credit Card number`, input);
    },
    options,
  );
}
