import { Context, Nullish, validator } from '../core/index.js';
import { allOf, pipe } from './pipe.js';
import { isGte, isLte } from './range.js';

/**
 * Returns length of an Array, String, ArrayBuffer, Buffer or any object with the "length" property.
 * @validator getLength
 */
export const extractLength = () => extractLengthRule;

type ExtractLengthInput = string | any[] | ArrayBuffer |
    { length: number } | { size: number };
const extractLengthRule =
    validator<number, ExtractLengthInput>('extractLength',
        function (input: any, context: Context, _this): Nullish<number> {
          if (typeof input === 'string')
            return input.length;
          if (Array.isArray(input))
            return input.length;
          if (input instanceof ArrayBuffer)
            return input.byteLength;
          if (input && typeof input === 'object' && typeof input.length === 'number')
            return input.length;
          if (input && typeof input === 'object' && typeof input.size === 'number')
            return input.size;
          context.fail(_this, `Unable to extract length of {{label}}`, input);
        }
    )


/**
 * Checks the length is at least "minValue"
 * @validator lengthMin
 */
export const lengthMin =
    (minValue: number) =>
        allOf(pipe(extractLength(),
                isGte(minValue, {
                  onFail: () => `The length of {{label}} must be at least ${minValue}`
                })
            )
        );


/**
 * Checks if the length is at most "maxValue"
 * @validator charLengthMax
 */
export const lengthMax =
    (maxValue: number) =>
        allOf(pipe(extractLength(),
                isLte(maxValue, {
                  onFail: () => `The length of {{label}} must be at most ${maxValue}`
                })
            )
        );
