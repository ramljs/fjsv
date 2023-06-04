import { Codec, codec } from '../codec.js';
import { kCodecFn } from '../constants.js';
import { Context } from '../context.js';

/**
 * Transforms given value to "tuple" or returns undefined if nullish
 * @codec tuple
 */
export function $tuple<T1, I1>(
    nested: [Codec<T1, I1>]
): Codec<[T1], [I1]>
export function $tuple<T1, I1, T2, I2>(
    nested: [Codec<T1, I1>, Codec<T2, I2>]
): Codec<[T1, T2], [I1, I2]>
export function $tuple<T1, I1, T2, I2, T3, I3>(
    nested: [Codec<T1, I1>, Codec<T2, I2>, Codec<T3, I3>]
): Codec<[T1, T2, T3], [I1, I2, I3]>
export function $tuple<T1, I1, T2, I2, T3, I3, T4, I4>(
    nested: [Codec<T1, I1>, Codec<T2, I2>, Codec<T3, I3>, Codec<T4, I4>]
): Codec<[T1, T2, T3, T4], [I1, I2, I3, I4]>
export function $tuple<T1, I1, T2, I2, T3, I3, T4, I4>(
    nested: [Codec<T1, I1>, Codec<T2, I2>, Codec<T3, I3>, Codec<T4, I4>]
): Codec<[T1, T2, T3, T4], [I1, I2, I3, I4]>
export function $tuple<T1, I1, T2, I2, T3, I3, T4, I4, T5, I5>(
    nested: [Codec<T1, I1>, Codec<T2, I2>, Codec<T3, I3>, Codec<T4, I4>, Codec<T5, I5>]
): Codec<[T1, T2, T3, T4, T5], [I1, I2, I3, I4, I5]>
export function $tuple<T1, I1, T2, I2, T3, I3, T4, I4, T5, I5, T6, I6>(
    nested: [Codec<T1, I1>, Codec<T2, I2>, Codec<T3, I3>, Codec<T4, I4>, Codec<T5, I5>, Codec<T6, I6>, ...Codec<any, any>[]]
): Codec<[T1, T2, T3, T4, T5, T6, ...any[]], [I1, I2, I3, I4, I5, I5, ...any[]]>
export function $tuple(nested: Codec<any>[]) {
  return codec<any>('tuple',
      function (input: unknown, context: Context) {
        if (input == null)
          return;
        const nl = nested.length;
        const arr = Array.isArray(input) ? input : [input];
        const out: any[] = [];
        let i;
        const l = arr.length;
        let c: Codec<any>;
        for (i = 0; i < l && i < nl; i++) {
          c = nested[i];
          out.push(c[kCodecFn](arr[i], context, c as any) ?? null);
        }
        return context.errors.length ? undefined : out;
      }
  )
}
