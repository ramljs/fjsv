import { codec } from '../codec.js';
import { Context } from '../context.js';

/**
 * Checks if value is "null". Value can't be "undefined".
 * @codec isNull
 */
export const $isNull = codec<null>('is-null',
    function (input: unknown, context: Context): null | void {
      if (input === null)
        return input;
      context.failure(`{{location}} must be null`);
    }
)

/**
 * Checks if value is "undefined". Value can't be "null".
 * @codec isUndefined
 */
export const $isUndefined = codec<null>('is-undefined',
    function (input: unknown, context: Context): undefined | void {
      if (input === undefined)
        return input;
      context.failure(`{{location}} must be undefined`);
    }
)


/**
 * Checks if value is "null" or "undefined"
 * @codec isNullish
 */
export const $isNullish = codec<null | undefined>('is-nullish',
    function (input: unknown, context: Context): null | undefined | void {
      if (input == null)
        return input as any;
      context.failure(`{{location}} must be null or undefined`);
    }
)

/**
 * Checks if value is not "null". Value can be "undefined".
 * @codec isNotNull
 */
export const $isNotNull = codec<any>('is-not-null',
    function (input: unknown, context: Context): any | void {
      if (input !== null)
        return input;
      context.failure(`{{location}} can't be null`);
    }
)

/**
 * Checks if value is not "undefined". Value can be "null".
 * @codec isDefined
 */
export const $isDefined = codec<any>('is-defined',
    function (input: unknown, context: Context): any | void {
      if (input !== undefined)
        return input;
      context.failure(`{{location}} must be defined`);
    }
)

/**
 * Checks if value is not "null" nor "undefined"
 * @codec isNotNullish
 */
export const $isNotNullish = codec<any>('is-not-nullish',
    function (input: unknown, context: Context): any | void {
      if (input != null)
        return input;
      context.failure(`{{location}} can't be null nor undefined`);
    }
)

