import { Context, ValidationOptions, validator } from '../../core/index.js';

/**
 * Validates if value is not "undefined" nor "null"
 * @validator isDefined
 */
export function isDefined(options?: ValidationOptions) {
  return validator<any, unknown>(
    'is-defined',
    (input: unknown, context: Context, _this) => {
      if (input !== undefined) return input;
      context.fail(_this, `Is not defined`, input);
    },
    options,
  );
}
