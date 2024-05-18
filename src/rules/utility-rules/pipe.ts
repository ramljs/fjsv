import { Context, Nullish, ValidationOptions, Validator, validator } from '../../core/index.js';

export interface PipeOptions extends ValidationOptions {
  returnIndex?: number;
}

/**
 *
 * @validator pipe
 */
export function pipe<T>(rules: Validator[], options?: PipeOptions): Validator<T> {
  const l = rules.length;
  const returnIndex = options?.returnIndex;
  return validator<T, any>(
    'pipe',
    function (input: unknown, context: Context): Nullish<T> {
      let i: number;
      let c: Validator;
      let v = input;
      let returnValue: any;
      for (i = 0; i < l; i++) {
        c = rules[i];
        v = c(v, context);
        if (returnIndex == null || i <= returnIndex) returnValue = v;
        if (context.errors.length) return;
      }
      return returnValue as T;
    },
    options,
  );
}

/**
 * Test given value against to all codecs and returns original input
 * @validator allOf
 */
export function allOf<T = any>(rules: Validator[]): Validator<T> {
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
