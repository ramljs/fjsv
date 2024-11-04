import { type Nullish } from 'ts-gems';
import validatorJS from 'validator';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

/**
 * Validates if value is a port number
 * @validator isPort
 */
export function isPort(options?: ValidationOptions) {
  return validator<number, string | number>(
    'isPort',
    (input: unknown, context: Context, _this): Nullish<number> => {
      if (typeof input === 'number') input = String(input);
      if (
        input != null &&
        typeof input === 'string' &&
        validatorJS.isPort(input)
      ) {
        return parseInt(input, 10);
      }
      context.fail(_this, `{{label}} is not a valid port number`, input);
    },
    options,
  );
}
