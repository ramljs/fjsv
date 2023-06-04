import { Type } from 'ts-gems';
import { Codec, codec, isCodec } from '../codec.js';
import { kCodecFn } from '../constants.js';
import { Context } from '../context.js';
import { CodecOptions } from '../types.js';

export type ObjectSchema = Record<string | number, Codec<any, any>>;

export interface ObjectCodecOptions extends CodecOptions {
  detectCircular?: boolean;
}

/**
 *
 * @codec object
 */
export function $object<T, C = T extends never ? object : T>(
    schema: ObjectSchema,
    options?: {
      name?: string;
      ctor?: Type<T>,
      additionalFields?: boolean | Codec<any, any>
    }
) {
  const additionalFields = options?.additionalFields;
  const ctor = options?.ctor;
  const name = options?.name || ctor?.name;
  return codec<C | undefined, object | undefined, ObjectCodecOptions>('object',
      function (
          input: object | undefined,
          context: Context,
          _this
      ): C | undefined {
        if (input == null)
          return;
        const schemaClone = {...schema};
        let keys = Object.keys(input);
        let l = keys.length;
        let i = 0;
        let k: string;
        let v: any;
        let _propCodec: Codec<any, any> | undefined;
        const out: any = {};
        if (options?.ctor)
          Object.setPrototypeOf(out, options.ctor.prototype);
        if (context.options.detectCircular) {
          context.crc = context.crc || new Map<object, object>();
          if (context.crc.has(input))
            return context.crc.get(input) as any;
          context.crc.set(input, out);
        }
        const location = context.current.location || '';
        const current: any = context.current = {id: _this.id, input: '', location: ''};
        // Iterate object keys and perform codecs
        for (i = 0; i < l; i++) {
          k = keys[i];
          v = input[k];
          delete schemaClone[k];
          context.current = current;
          current.name = name || 'Object';
          current.input = v;
          current.property = k;
          current.location = location + (location ? '.' : '') + k;
          _propCodec = isCodec(schema[k]) ? schema[k] :
              (isCodec(additionalFields) ? additionalFields : undefined);
          if (_propCodec) {
            v = _propCodec[kCodecFn](v, context, _propCodec);
          } else if (v !== undefined && !additionalFields)
            context.failure(`${name || 'Object'} does not accept additional fields`);

          if (v !== undefined)
            out[k] = v;
        }
        // Iterate not visited schema properties perform codecs
        keys = Object.keys(schemaClone);
        l = keys.length;
        for (i = 0; i < l; i++) {
          k = keys[i];
          v = input[k];
          _propCodec = isCodec(schemaClone[k]) ? schemaClone[k] : undefined;
          if (_propCodec) {
            context.current = current;
            current.name = name || 'Object';
            current.input = v;
            current.property = k;
            current.location = location + (location ? '.' : '') + k;
            v = _propCodec[kCodecFn](v, context, _propCodec);
            if (v !== undefined)
              out[k] = v;
          }
        }

        return context.errors.length ? undefined : out;
      }
  )
}


/**
 *
 * @codec record
 */
export function $record<TKeys extends string | number | symbol, TValues>(
    keysCodec: Codec<TKeys>,
    valueCodec: Codec<TValues>
) {
  return codec<Record<TKeys, TValues>>('record',
      function (
          input: object | undefined,
          context: Context,
          _this
      ): Record<TKeys, TValues> | undefined {
        if (input == null)
          return;
        const keys = Object.keys(input);
        const l = keys.length;
        let i: number;
        let k;
        let v;
        const current: any = context.current = {id: _this.id, input: '', location: ''};
        const out: any = {};
        for (i = 0; i < l; i++) {
          k = keys[i];
          v = input[k];
          context.current = current;
          current.input = v;
          current.property = k;
          current.location = k;
          k = keysCodec[kCodecFn](k, context, keysCodec);
          v = valueCodec[kCodecFn](v, context, valueCodec);
          out[k] = v;
        }
        return context.errors.length ? undefined : out;
      }
  )
}
