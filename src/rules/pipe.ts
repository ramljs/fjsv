import {
  Context, kValidatorFn, Nullish,
  Validator, validator
} from '../core/index.js';

/**
 *
 * @validator pipe
 */
export function pipe<T>(
    ...rules: [...Validator<any, any>[], Validator<T, any>]
) {
  const l = rules.length;
  return validator<T, any>('pipe',
      function (input: unknown, context: Context): Nullish<T> {
        let i: number;
        let c: Validator<any, any>;
        let v = input;
        for (i = 0; i < l; i++) {
          c = rules[i];
          const subContext = context.extend(c);
          v = c[kValidatorFn](v, subContext, c);
          if (context.errors.length)
            return;
        }
        return v as T;
      }
  )
}


/**
 * Test given value against to all codecs and returns original input
 * @validator allOf
 */
export function allOf(
    ...rules: Validator<any, any>[]
) {
  return validator('allOf',
      function (input: any, context: Context): any {
        let i: number;
        let c: Validator<any, any>;
        const l = rules.length;
        for (i = 0; i < l; i++) {
          c = rules[i];
          const subContext = context.extend(c);
          c[kValidatorFn](input, subContext, c);
        }
        return input;
      }
  )
}
