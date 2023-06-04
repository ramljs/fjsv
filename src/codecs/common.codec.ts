import { Codec, codec, isCodec } from '../codec.js';
import { kCodecFn } from '../constants.js';
import { Context } from '../context.js';
import { CodecOptions } from '../types.js';

export const $any = codec<any, any>('any',
    function (input: unknown): any {
      return input;
    });

/**
 * Calls nested codec if input is not nullish, otherwise returns undefined
 * @codec optional
 */
export function $optional<T, I, O extends CodecOptions = CodecOptions>(
    nested: Codec<T, I, O>
) {
  return codec<T | undefined | null, I, O>('optional',
      function (input: I, context: Context): T | undefined | null | void {
        if (input == null)
          return input as any;
        return nested[kCodecFn](input, context, nested as any);
      }
  )
}

/**
 * Checks if value is not nullish than calls nested codec
 * @codec required
 */
export function $required<T, I, O extends CodecOptions = CodecOptions>(
    nested: Codec<T, I, O>
) {
  return codec<Exclude<T, undefined | null>, I, O>('required',
      function (input: I, context: Context) {
        if (input == null)
          return context.failure(`{{location}} is required`);
        return nested[kCodecFn](input, context, nested as any) as Exclude<T, undefined | null>;
      }
  )
}

/**
 * Forwards codec process to a sub codec. Useful for circular checks
 * @codec required
 */
export function $forwardRef<T, I, O extends CodecOptions = CodecOptions>(fn: () => Codec<T, I, O>) {
  return codec<T, I, O>('forwardref',
      function (input: I, context: Context): T | void {
        const nested = fn();
        return nested[kCodecFn](input, context, nested as any);
      }
  )
}

/**
 * if "check" codec passes returns "then", "else" otherwise
 * @codec iif
 */
export function $if<TOutput1, TOutput2, TDefault1, TDefault2>(
    check: Codec<any>,
    than_: TDefault1 | Codec<TOutput1, any, any>,
    else_: TDefault2 | Codec<TOutput2, any, any>
)
export function $if(check: Codec<any>, _then: any, _else?: any) {
  return codec<any, any, any>('iif',
      function (input: unknown, context: Context): any {
        let c = _else;
        try {
          if (check(input) !== undefined)
            c = _then;
        } catch {
          // ignored
        }
        if (isCodec(c))
          return c[kCodecFn](input, context, c)
        return c;
      }
  )
}


/**
 * On success returns nested codec result, otherwise returns undefined without any error
 * @codec iif
 */
export function $silent<T, I, O extends CodecOptions = CodecOptions>(
    nested: Codec<T, I, O>
) {
  return codec<any, any, any>('silent',
      function (input: unknown, context: Context): any {
        try {
          return nested(input as I, context.options as any);
        } catch {
          // ignored
        }
      }
  )
}
