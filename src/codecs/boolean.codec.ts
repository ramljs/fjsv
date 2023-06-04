import { codec } from '../codec.js';
import { Context } from '../context.js';

/**
 * Transforms given value to "boolean" or returns undefined if nullish
 * @codec boolean
 */
export const $boolean = codec<boolean | undefined, unknown>('boolean',
    function (input: unknown): boolean | undefined | void {
      return input == null ? undefined : !!input;
    });


/**
 * Checks if value is "boolean"
 * @codec isBoolean
 */
export const $isBoolean = codec<boolean>('is-boolean',
    function (input: unknown, context: Context): boolean | void {
      if (typeof input === 'boolean')
        return input;
      context.failure(`{{location}} must be a boolean`);
    })
