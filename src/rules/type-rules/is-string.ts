import {
  type Context,
  type Nullish,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

/**
 * Validates if value is "string".
 * Converts input value to string if coerce option is set to 'true'.
 * @validator isString
 */
export function isString(options?: ValidationOptions) {
  return validator<string, unknown>(
    'isString',
    (input: any, context: Context, _this): Nullish<string> => {
      const coerce = options?.coerce || context.coerce;
      let output: any = input;
      if (output != null && typeof output !== 'string' && coerce) {
        if (typeof output === 'object') {
          if (typeof output.toJSON === 'function') output = output.toJSON();
          else output = JSON.stringify(output);
        } else output = String(output);
      }
      if (typeof output === 'string') return output;
      context.fail(_this, `"{{value}}" is not a string`, input);
    },
    options,
  );
}

/**
 * Process "String.replace" method
 * @validator stringReplace
 */
export function stringReplace(
  searchValue: string | RegExp,
  replaceValue: string,
);
export function stringReplace(
  searchValue: string | RegExp,
  replacer: (subsring: string, ...args: any[]) => string,
);
export function stringReplace(
  searchValue: {
    [Symbol.replace](string: string, replaceValue: string): string;
  },
  replaceValue: string,
);
export function stringReplace(
  searchValue: {
    [Symbol.replace](
      string: string,
      replacer: (substring: string, ...args: any[]) => string,
    ): string;
  },
  replacer: (substring: string, ...args: any[]) => string,
);
export function stringReplace(searchValue: any, replacer: any) {
  return validator<string>(
    'stringReplace',
    (input: unknown): Nullish<string> => {
      if (input == null) return input;
      return String(input).replace(searchValue, replacer);
    },
  );
}

/**
 * Process "String.split" method
 * @validator split
 */
export function stringSplit(separator: string | RegExp, limit?: number);
export function stringSplit(
  splitter: { [Symbol.split](string: string, limit?: number): string[] },
  limit?: number,
);
export function stringSplit(splitter: any, limit: any) {
  return validator<string[], string>('stringSplit', (input: unknown) => {
    if (input == null) return input;
    return String(input).split(splitter, limit);
  });
}

/**
 * Removes whitespace from both ends of a string
 * @validator trim
 */
export function trim() {
  return validator<string, string>('trim', (input: unknown) => {
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

const trimEndRule = validator<string, string>(
  'trimEnd',
  (input: unknown): Nullish<string> => {
    if (input == null) return input;
    return String(input).trimEnd();
  },
);

// *************************************************************

/**
 * Removes whitespace from the beginning of a string
 * @validator trimStart
 */
export const trimStart = () => trimStartRule;

const trimStartRule = validator<string, string>(
  'trimStart',
  (input: unknown): Nullish<string> => {
    if (input == null) return input;
    return String(input).trimStart();
  },
);
