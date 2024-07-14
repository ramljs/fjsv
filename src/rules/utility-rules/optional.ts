import { Nullish } from 'ts-gems';
import {
  Context,
  ValidationOptions,
  Validator,
  validator,
} from '../../core/index.js';

/**
 * Makes sub-rule optional
 * @validator optional
 */
export function optional<T, I>(
  nested: Validator<T, I>,
  options?: ValidationOptions,
) {
  return validator<Nullish<T>, Nullish<I>>(
    'optional',
    (input: Nullish<I>, context: Context): Nullish<T> => {
      if (input == null) return input as any;
      return nested(input as I, context) as T;
    },
    options,
  );
}
