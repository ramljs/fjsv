import { Nullish } from 'ts-gems';
import {
  Context,
  ValidationOptions, Validator, validator
} from '../core/index.js';

/**
 * Makes sub-rule optional
 * @validator optional
 */
export function optional<T, I>(
    nested: Validator<T, I>,
    options?: ValidationOptions
) {
  return validator<Nullish<T>, Nullish<I>>('optional',
      function (input: Nullish<I>, context: Context): Nullish<T> {
        if (input == null)
          return input as any;
        return nested(input as I, context) as T;
      }, options
  )
}


/**
 * Makes sub-rule required
 * @validator required
 */
export function required<T, I>(
    nested: Validator<T, I>,
    options?: ValidationOptions
) {
  return validator<Nullish<T>, I>('required',
      function (input: I, context: Context, _this): Nullish<T> {
        if (input == null) {
          context.fail(_this, `{{label}} is required`, input);
          return;
        }
        return nested(input, context) as T;
      }, options
  )
}


/**
 * Validates if property exists
 * @validator exists
 */
export function exists(options?: ValidationOptions) {
  return validator<any, unknown>('exists',
      function (input: unknown, context: Context, _this) {
        if (input !== undefined ||
            (context.scope &&
                Object.getOwnPropertyDescriptor(context.scope, input as any))
        )
          return input;
        context.fail(_this, `{{label}} must exist`, input);
      }, options
  );

}
