import { Nullish } from 'ts-gems';
import * as validatorJS from 'validator';
import { Context, ValidationOptions, validator } from '../../core/index.js';

export interface IsISSNOptions extends ValidationOptions {
  /**
   * If set to `true`, ISSNs with a lowercase `x` as the check digit are rejected.
   *
   * @default false
   */
  caseSensitive?: boolean;
}

/**
 * Validates if value is an ISSN
 * @validator isISSN
 */
export function isISSN(options?: IsISSNOptions) {
  const opts: validatorJS.IsISSNOptions = {
    // eslint-disable-next-line camelcase
    case_sensitive: options?.caseSensitive,
  };
  return validator<string, string>(
    'isISSN',
    function (input: unknown, context: Context, _this): Nullish<string> {
      if (typeof input === 'string' && validatorJS.isISSN(input, opts)) return input;
      context.fail(_this, `"{{value}}" is not a valid ISSN`, input);
    },
    options,
  );
}
