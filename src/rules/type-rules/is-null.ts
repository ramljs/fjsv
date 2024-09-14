import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

/**
 * Validates if value is "null".
 * @validator isNull
 */
export function isNull(options?: ValidationOptions) {
  return validator<null, unknown>(
    'isNull',
    (input: unknown, context: Context, _this) => {
      if (input === null) return input;
      context.fail(_this, `{{label}} is not null`, input);
    },
    options,
  );
}

/**
 * Validates if value is not "null".
 * @validator isNotNull
 */
export function isNotNull(options?: ValidationOptions) {
  return validator(
    'isNotNull',
    (input: unknown, context: Context, _this) => {
      if (input !== null) return input;
      context.fail(_this, `{{label}} is null`, input);
    },
    options,
  );
}

/**
 * Validates if value is "null" or "undefined".
 * @validator isNullish
 */
export function isNullish(options?: ValidationOptions) {
  return validator<null, unknown>(
    'isNullish',
    (input: unknown, context: Context, _this) => {
      if (input == null) return input;
      context.fail(_this, `{{label}} is not nullish`, input);
    },
    options,
  );
}

/**
 * Validates if value is not "null" nor "undefined".
 * @validator isNotNullish
 */
export function isNotNullish(options?: ValidationOptions) {
  return validator(
    'isNotNullish',
    (input: unknown, context: Context, _this) => {
      if (input != null) return input;
      if (input === null) context.fail(_this, `{{label}} is null`, input);
      else context.fail(_this, `{{label}} is undefined`, input);
    },
    options,
  );
}
