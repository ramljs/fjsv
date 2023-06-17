import {
  Context, Nullish,
  Validator, validator
} from '../core/index.js';

/**
 *
 */
export function union<T, I>(
    codecs: Validator<T, I>[]
) {
  const l = codecs.length;
  return validator<T, I>('union',
      function (input: I, context: Context): Nullish<T> {
        let i: number;
        let c: Validator<any, any>;
        let v;
        let passed = false;
        for (i = 0; i < l; i++) {
          c = codecs[i];
          try {
            v = c(input, context);
            passed = true;
            break;
          } catch (e) {
            //
          }
        }
        if (passed)
          return v;
        context.failure(`{{location}} didn't match any of required format`)
      }
  )
}
