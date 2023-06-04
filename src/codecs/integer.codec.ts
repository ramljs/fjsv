import { codec } from '../codec.js';
import { Context } from '../context.js';

/**
 * Transforms given value to "integer" or returns undefined if nullish
 * @codec number
 */
export const $integer = codec<number | undefined, unknown>('integer',
    function (input: unknown, context: Context): number | undefined {
      if (input == null)
        return;
      const v = typeof input === 'number' ? input : parseInt('' + input, 10);
      if (!isNaN(v) && Number.isInteger(v))
        return v;
      context.failure(`"${input}" is not a valid integer number`);
    });

/**
 * Checks if number value is an integer number
 * @codec isNumberLte
 */
export const $isInteger = codec<number>('is-integer',
    function (input: unknown, context: Context): number | void {
      if (typeof input === 'number' && Number.isInteger(input))
        return input;
      context.failure(`{{input}} is not a valid integer value`);
    });
