import { Context, Nullish, ValidationOptions, validator } from '../../core';

/**
 * Validates if value is "string".
 * Converts input value to string if coerce option is set to 'true'.
 * @validator isString
 */
export function isString(options?: ValidationOptions) {
  return validator<string, unknown>(
    'isString',
    function (input: any, context: Context, _this): Nullish<string> {
      const coerce = options?.coerce || context.coerce;
      if (input != null && typeof input !== 'string' && coerce) {
        if (typeof input === 'object') {
          if (typeof input.toJSON === 'function') input = input.toJSON();
          else input = JSON.stringify(input);
        } else input = String(input);
      }
      if (typeof input === 'string') return input;
      context.fail(_this, `{{label}} must be a string`, input);
    },
    options,
  );
}

/**
 * Process "String.replace" method
 * @validator stringReplace
 */
export function stringReplace(searchValue: string | RegExp, replaceValue: string);
export function stringReplace(searchValue: string | RegExp, replacer: (subsring: string, ...args: any[]) => string);
export function stringReplace(
  searchValue: { [Symbol.replace](string: string, replaceValue: string): string },
  replaceValue: string,
);
export function stringReplace(
  searchValue: { [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string },
  replacer: (substring: string, ...args: any[]) => string,
);
export function stringReplace(searchValue: any, replacer: any) {
  return validator<string>('stringReplace', function (input: unknown): Nullish<string> {
    if (input == null) return input;
    return String(input).replace(searchValue, replacer);
  });
}

/**
 * Process "String.split" method
 * @validator split
 */
export function stringSplit(separator: string | RegExp, limit?: number);
export function stringSplit(splitter: { [Symbol.split](string: string, limit?: number): string[] }, limit?: number);
export function stringSplit(splitter: any, limit: any) {
  return validator<string[], string>('stringSplit', function (input: unknown) {
    if (input == null) return input;
    return String(input).split(splitter, limit);
  });
}

/**
 * Removes whitespace from both ends of a string
 * @validator trim
 */
export function trim() {
  return validator<string, string>('trim', function (input: unknown) {
    if (input == null) return input;
    return String(input).trim();
  });
}

// *************************************************************

/**
 * Removes whitespace from the end of a string
 * @validator trimEnd
 */
export const trimEnd = () => trimEndRule;

const trimEndRule = validator<string, string>('trimEnd', function (input: unknown): Nullish<string> {
  if (input == null) return input;
  return String(input).trimEnd();
});

// *************************************************************

/**
 * Removes whitespace from the beginning of a string
 * @validator trimStart
 */
export const trimStart = () => trimStartRule;

const trimStartRule = validator<string, string>('trimStart', function (input: unknown): Nullish<string> {
  if (input == null) return input;
  return String(input).trimStart();
});
