import { codec } from '../codec.js';
import { Context } from '../context.js';

/**
 * Transforms given value to "number" or returns undefined if nullish
 * @codec number
 */
export const $number = codec<number | undefined, unknown>('number',
    function (input: unknown, context: Context): number | undefined {
      if (input == null)
        return;
      const v = typeof input === 'number' ? input : parseFloat('' + input);
      if (!isNaN(v))
        return v;
      context.failure(`"${input}" is not a valid number`);
    });



/**
 * Checks if value is "number"
 * @codec isBoolean
 */
export const $isNumber = codec<number>('is-number',
    function (input: unknown, context: Context): number | void {
      if (typeof input === 'number' && !isNaN(input))
        return input;
      context.failure(`{{location}} must be a number`);
    })

/**
 * Checks if number value is grater than minValue
 * @codec isNumberGt
 */
export function $isNumberGt(minValue: number) {
  return codec<number>('is-number-gt',
      function (input: unknown, context: Context): number | void {
        if (typeof input === 'number' && input > minValue)
          return input;
        context.failure(`{{location}} must be greater than ${minValue}`);
      }
  )
}

/**
 * Checks if number value is grater than or equal to minValue
 * @codec isNumberGte
 */
export function $isNumberGte(minValue: number) {
  return codec<number>('is-number-gte',
      function (input: unknown, context: Context): number | void {
        if (typeof input === 'number' && input >= minValue)
          return input;
        context.failure(`{{location}} must be greater than or equal to ${minValue}`);
      }
  )
}

/**
 * Checks if number value is lover than minValue
 * @codec isNumberLt
 */
export function $isNumberLt(minValue: number) {
  return codec<number>('is-number-lt',
      function (input: unknown, context: Context): number | void {
        if (typeof input === 'number' && input < minValue)
          return input;
        context.failure(`{{location}} must be lover than ${minValue}`);
      }
  )
}

/**
 * Checks if number value is lover than or equal to minValue
 * @codec isNumberLte
 */
export function $isNumberLte(minValue: number) {
  return codec<number>('is-number-lte',
      function (input: unknown, context: Context): number | void {
        if (typeof input === 'number' && input <= minValue)
          return input;
        context.failure(`{{location}} must be lover than or equal to ${minValue}`);
      }
  )
}
