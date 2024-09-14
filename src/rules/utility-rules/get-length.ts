import { type Context, type Nullish, validator } from '../../core/index.js';

type ExtractLengthInput =
  | string
  | any[]
  | ArrayBuffer
  | { length: number }
  | { size: number };

/**
 * Returns length of an Array, String, ArrayBuffer, Buffer or any object with the "length" property.
 * @validator getLength
 */
export function getLength() {
  return validator<number, ExtractLengthInput>(
    'getLength',
    (input: any, context: Context, _this): Nullish<number> => {
      if (typeof input === 'string') return input.length;
      if (Array.isArray(input)) return input.length;
      if (input instanceof ArrayBuffer) return input.byteLength;
      if (
        input &&
        typeof input === 'object' &&
        typeof input.length === 'number'
      ) {
        return input.length;
      }
      if (
        input &&
        typeof input === 'object' &&
        typeof input.size === 'number'
      ) {
        return input.size;
      }
      context.fail(_this, `Unable to get length of {{label}}`, input);
    },
  );
}
