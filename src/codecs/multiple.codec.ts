import { Codec, codec } from '../codec.js';
import { kCodecFn } from '../constants.js';
import { Context } from '../context.js';

/**
 *
 * @codec pipe
 */
export function $pipe<T>(codecs: [...Codec<any>[], Codec<T>]) {
  const l = codecs.length;
  return codec<T>('pipe',
      function (input: unknown, context: Context): T | void {
        let i: number;
        let c: Codec<any>;
        let v = input;
        for (i = 0; i < l; i++) {
          c = codecs[i];
          try {
            v = c[kCodecFn](v, context, c);
          } catch (e) {
            //
          }
        }
        return context.errors.length ? undefined : v as T;
      }
  )
}

/**
 *
 */
export function $oneOf<T>(codecs: Codec<T>[]) {
  const l = codecs.length;
  return codec<T>('one-of',
      function (input: unknown, context: Context): T | void {
        let i: number;
        let c: Codec<any>;
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

/**
 *
 */
export function $allOf(codecs: Codec<any>[]) {
  const l = codecs.length;
  return codec<any>('all-of',
      function (input: unknown, context: Context): void {
        let i: number;
        for (i = 0; i < l; i++) {
          const c = codecs[i];
          c[kCodecFn](input, context, c);
        }
      }
  )
}
