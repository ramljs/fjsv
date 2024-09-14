import type { Nullish } from 'ts-gems';
import {
  type Context,
  type ValidationOptions,
  type Validator,
  validator,
} from '../../core/index.js';

/**
 * Makes sub-rule required
 * @validator required
 */
export function required<T, I>(
  nested: Validator<T, I>,
  options?: ValidationOptions,
) {
  return validator<Nullish<T>, I>(
    'required',
    (input: I, context: Context, _this): Nullish<T> => {
      if (input == null) {
        context.fail(_this, `{{label}} is required`, input);
        return;
      }
      return nested(input, context) as T;
    },
    options,
  );
}
