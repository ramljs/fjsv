import validatorJS from '@browsery/validator';
import type { Nullish } from 'ts-gems';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

export type HashAlgorithm = validatorJS.HashAlgorithm;

/**
 * Validates if value a hash of type algorithm
 * @validator isHash
 */
export function isHash(algorithm: HashAlgorithm, options?: ValidationOptions) {
  return validator<string, string>(
    'isHash',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (typeof input === 'string' && validatorJS.isHash(input, algorithm)) {
        return input;
      }
      context.fail(_this, `Value is not a valid ${algorithm} hash`, input);
    },
    options,
  );
}
