import { codec } from '../codec.js';
import { Context } from '../context.js';

/**
 * Transforms given value to "string" or returns undefined if nullish
 * @codec string
 */
export const $string = codec<string | undefined, unknown>('string',
    function (input: unknown) {
      return input == null ? undefined : '' + input;
    });


/**
 * Checks if value is "string"
 * @codec isString
 */
export const $isString = codec<string>('is-string',
    function (input: unknown, context: Context): string | void {
      if (typeof input === 'string')
        return input;
      context.failure(`{{location}} must be a string`);
    })

/**
 * Checks if value is "string" and not empty
 * @codec isNotEmpty
 */
export const $isNotEmpty = codec<string>('is-not-empty',
    function (input: unknown, context: Context): string | void {
      if (input && typeof input === 'string')
        return input;
      context.failure(`{{location}} must be a non-empty string`);
    })

/**
 * Process String.trim on given value
 * @codec stringTrim
 */
export const $stringTrim = codec<string>('string-trim',
    function (input: unknown, context: Context): string | void {
      if (typeof input === 'string')
        return input.trim();
      context.failure(`{{location}} must be a string`);
    })

/**
 * Process String.trimEnd on given value
 * @codec stringTrimEnd
 */
export const $stringTrimEnd = codec<string>('string-trim-end',
    function (input: unknown, context: Context): string | void {
      if (typeof input === 'string')
        return input.trimEnd();
      context.failure(`{{location}} must be a string`);
    })

/**
 * Process String.trimStart on given value
 * @codec stringTrimStart
 */
export const $stringTrimStart = codec<string>('string-trim-start',
    function (input: unknown, context: Context): string | void {
      if (typeof input === 'string')
        return input.trimStart();
      context.failure(`{{location}} must be a string`);
    })

/**
 * Process String.replace on given value
 * @codec stringReplace
 */
export function $stringReplace(
    searchValue: string | RegExp,
    replaceValue: string
)
export function $stringReplace(
    searchValue: string | RegExp,
    replacer: (subsring: string, ...args: any[]) => string
)
export function $stringReplace(
    searchValue: { [Symbol.replace](string: string, replaceValue: string): string; },
    replaceValue: string
)
export function $stringReplace(
    searchValue: { [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string; },
    replacer: (substring: string, ...args: any[]) => string
)
export function $stringReplace(searchValue: any, replacer: any) {
  return codec<string>('string-replace',
      function (input: unknown, context: Context): string | void {
        if (typeof input === 'string')
          return input.replace(searchValue, replacer);
        context.failure(`{{location}} must be a string`);
      }
  )
}


/**
 * Process String.split on given value
 * @codec stringReplace
 */
export function $stringSplit(separator: string | RegExp, limit?: number)
export function $stringSplit(splitter: { [Symbol.split](string: string, limit?: number): string[]; }, limit?: number)
export function $stringSplit(splitter: any, limit: any) {
  return codec<string[], string>('string-replace',
      function (input: unknown, context: Context): string[] | void {
        if (typeof input === 'string')
          return input.split(splitter, limit);
        context.failure(`{{location}} must be a string`);
      }
  )
}
