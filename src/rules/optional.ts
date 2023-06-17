import { Nullish } from 'ts-gems';
import {
  Context, kValidatorFn,
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
        return nested[kValidatorFn](input as I, context, nested as any) as T;
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
      function (input: I, context: Context): Nullish<T> {
        if (input == null) {
          context.failure(`{{label}} is required`);
          return;
        }
        return nested[kValidatorFn](input, context, nested as any) as T;
      }, options
  )
}



/**
 * Validates if property exists
 * @validator exists
 */
export function exists(options?: ValidationOptions) {
  return validator<any, unknown>('exists',
      function (input: unknown, context: Context) {
        if (input !== undefined ||
            (context.input.value && context.parent &&
                Object.getOwnPropertyDescriptor(context.input.value, context.input.property as any))
        )
          return input;
        context.failure(`{{label}} must exist`);
      }, options
  );

}
