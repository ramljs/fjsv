import { Context, ValidationOptions, validator } from '../../core/index.js';

/**
 * Validates if property exists
 * @validator exists
 */
export function exists(options?: ValidationOptions) {
  return validator<any, unknown>(
    'exists',
    function (input: unknown, context: Context, _this) {
      if (input !== undefined || (context.scope && Object.getOwnPropertyDescriptor(context.scope, input as any)))
        return input;
      context.fail(_this, `{{label}} must exist`, input);
    },
    options,
  );
}
