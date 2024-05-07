import { Context, Nullish, Validator, validator } from '../../core';

/**
 *
 * @validator pipe
 */
export function pipe<T>(...rules: Validator[]): Validator<T> {
  const l = rules.length;
  return validator<T, any>('pipe', function (input: unknown, context: Context): Nullish<T> {
    let i: number;
    let c: Validator;
    let v = input;
    for (i = 0; i < l; i++) {
      c = rules[i];
      v = c(v, context);
      if (context.errors.length) return;
    }
    return v as T;
  });
}

/**
 * Test given value against to all codecs and returns original input
 * @validator allOf
 */
export function allOf<T = any>(...rules: Validator[]): Validator<T> {
  return validator('allOf', function (input: any, context: Context): any {
    let i: number;
    let c: Validator;
    const l = rules.length;
    for (i = 0; i < l; i++) {
      c = rules[i];
      c(input, context);
    }
    return input;
  });
}
