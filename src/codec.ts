import { kCodecFn } from './constants.js';
import { Context } from './context.js';
import { camelCase } from './helpers/string.utils.js';
import { CodecOptions } from './types.js';
import { ValidationError } from './validation-error.js';

export type CodecFunction<T, I = T> =
    (input: I, context: Context, _this: Codec<T, I>) => T | void;


export interface Codec<T, I = unknown, O extends CodecOptions = CodecOptions> {
  (input: I, options?: O): T;

  id: string;
  [kCodecFn]: CodecFunction<T, I>;
}

export function codec<TOutput, TInput = TOutput, TOptions extends CodecOptions = CodecOptions>(
    id: string,
    fn: CodecFunction<TOutput, TInput>
): Codec<TOutput, TInput, TOptions> {

  const name = fn.name || camelCase(id);
  const _codec = ({
    [name]: function _codec(input: TInput, options?: TOptions): TOutput {
      const context = new Context({id, input}, options);
      let value;
      try {
        value = fn(input, context, _codec as any);
      } catch (e: any) {
        if (e instanceof ValidationError)
          throw e;
        context.failure(e);
      }
      if (context.errors.length)
        throw new ValidationError(context.errors);
      return value;
    }
  })[name] as Codec<TOutput, TInput>;

  _codec.id = id;
  _codec[kCodecFn] = fn;

  return _codec;
}

export function isCodec(x: any): x is Codec<any, any> {
  return !!(typeof x === 'function' && x.id && x[kCodecFn]);
}
