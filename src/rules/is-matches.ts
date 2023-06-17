import { Context, Nullish, ValidationOptions, validator } from '../core/index.js';

export interface IsMatchesOptions extends ValidationOptions {
  formatName?: string;
}

/**
 * Coerces given value to "UUID" format or returns undefined if nullish
 * @validator uuid
 */
export function isMatches(
    format: string | RegExp,
    options?: IsMatchesOptions
) {
  const regExp = format instanceof RegExp ? format : new RegExp(format);
  const formatName = options?.formatName;
  return validator<string, string>('matches',
      function (input: unknown, context: Context): Nullish<string> {
        if (input == null)
          return;
        if (typeof input === 'string' && regExp.test(input))
          return input;
        context.failure({
          message: `{{label}} does not match ${formatName || 'requested'} format`,
          format,
          formatName
        });
      }, options
  )
}
