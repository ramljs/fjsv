import { Nullish } from 'ts-gems';
import * as validatorJS from 'validator';
import { Context, ValidationOptions, validator } from '../../core/index.js';

/**
 * Validates if value a valid JWT token
 * @validator isJWT
 */
export function isJWT(options?: ValidationOptions) {
  return validator<string, string>(
    'isJWT',
    function (input: unknown, context: Context, _this): Nullish<string> {
      if (typeof input === 'string' && validatorJS.isJWT(input)) return input;
      context.fail(_this, `Value is not a valid JWT token`, input);
    },
    options,
  );
}
