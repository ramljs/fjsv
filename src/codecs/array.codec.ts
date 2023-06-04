import { Codec, codec } from '../codec.js';
import { kCodecFn } from '../constants.js';
import { Context } from '../context.js';
import { CodecOptions } from '../types.js';

/**
 * Transforms given value to "array" or returns undefined if nullish
 * @codec boolean
 */
export function $array<T, I, O extends CodecOptions = CodecOptions>(
    nested: Codec<T, I, O>
) {
  return codec<T[], I[] | I, O>('array',
      function (input: unknown, context: Context): T[] | void {
        if (input == null)
          return;
        input = Array.isArray(input) ? input : [input];
        return (input as any[])
            .map(
                (v) => nested[kCodecFn](v, context, nested as any) as T
            );
      }
  )
}

/**
 * Checks if value is "boolean"
 * @codec isBoolean
 */
export const $isArray = codec<any[], any>('is-array',
    function (input: unknown, context: Context): any[] | void {
      if (Array.isArray(input))
        return input;
      context.failure(`{{location}} must be an array`);
    })

/**
 * Return array length
 * @codec arrayLength
 */
export const $arrayLength = codec<number, any[]>('arraylength',
    function (input: unknown, context: Context): number | void {
      if (Array.isArray(input))
        return input.length;
      context.failure(`{{location}} must be an array`);
    })
