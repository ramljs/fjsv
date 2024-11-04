import { type Nullish } from 'ts-gems';
import validatorJS from 'validator';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

/**
 * Validates if value is an IP
 * @validator isIP
 */
export function isIP(version?: 4 | 6, options?: ValidationOptions) {
  return validator<string, string>(
    'isIP',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (
        input != null &&
        typeof input === 'string' &&
        validatorJS.isIP(input, version)
      ) {
        return input;
      }
      context.fail(
        _this,
        `"{{value}}" is not a valid IP${version ? ' v' + version : ''}`,
        input,
      );
    },
    options,
  );
}

/**
 * Validates if value is an IP
 * @validator isIPRange
 */
export function isIPRange(version?: 4 | 6, options?: ValidationOptions) {
  return validator<string, string>(
    'isIPRange',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (
        input != null &&
        typeof input === 'string' &&
        validatorJS.isIPRange(input, version)
      ) {
        return input;
      }
      context.fail(
        _this,
        `"{{value}}" is not a valid IP${version ? ' v' + version : ''} range`,
        input,
      );
    },
    options,
  );
}
