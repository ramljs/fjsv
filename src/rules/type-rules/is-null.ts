import { Context, ValidationOptions, validator } from '../../core/index.js';

/**
 * Validates if value is "null".
 * @validator isNull
 */
export function isNull(options?: ValidationOptions) {
  return validator<null, unknown>(
    'isNull',
    (input: unknown, context: Context, _this) => {
      if (input === null) return input;
      context.fail(_this, `"{{value}}" is not null`, input);
    },
    options,
  );
}

/**
 * Validates if value is "null" or "undefined".
 * @validator isNull
 */
export function isNullish(options?: ValidationOptions) {
  return validator<null, unknown>(
    'isNullish',
    (input: unknown, context: Context, _this) => {
      if (input == null) return input;
      context.fail(_this, `"{{value}}" is not nullish`, input);
    },
    options,
  );
}
