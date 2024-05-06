import { Context, Nullish, ValidationOptions, validator } from '../core/index.js';

/**
 * Validates if value is "null".
 * @validator isNull
 */
export function isNull(options?: ValidationOptions) {
  return validator<null, unknown>('isNull',
      function (input: unknown, context: Context, _this) {
        if (input === null)
          return input;
        const coerce = options?.coerce || context.coerce;
        if (coerce)
          return null;
        context.fail(_this, `"{{value}}" is not null`, input);
      }, options
  );
}

/**
 * Validates if value is "null" or "undefined".
 * @validator isNull
 */
export function isNullish(options?: ValidationOptions) {
  return validator<null, unknown>('isNullish',
      function (input: unknown, context: Context, _this) {
        if (input == null)
          return input;
        const coerce = options?.coerce || context.coerce;
        if (coerce)
          return null;
        context.fail(_this, `"{{value}}" is not nullish`, input);
      }, options
  );
}


/**
 * Validates if value is not "undefined" nor "null"
 * @validator isDefined
 */
export function isDefined(options?: ValidationOptions) {
  return validator<any, unknown>('is-defined',
      function (input: unknown, context: Context, _this) {
        if (input !== undefined)
          return input;
        context.fail(_this, `Is not defined`, input);
      }, options
  );
}


/**
 * Validates if value is "undefined"
 * @validator isUndefined
 */
export function isUndefined(options?: ValidationOptions) {
  return validator<any, unknown>('isUndefined',
      function (input: unknown, context: Context, _this): Nullish<any> {
        if (options?.coerce || context.coerce)
          return undefined;
        if (input === undefined)
          return;
        context.fail(_this, `{{label}} mustn\'t be defined`, input);
      }, options
  );
}
