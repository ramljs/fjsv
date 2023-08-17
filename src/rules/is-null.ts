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
        context.fail(_this, `{{label}} is not null`, input);
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
        context.fail(_this, `{{label}} is not defined`, input);
      }, options
  );
}


/**
 * Validates if value is "undefined"
 * @validator isNotDefined
 */
export function isUndefined(options?: ValidationOptions) {
  return validator<any, unknown>('isUndefined',
      function (input: unknown, context: Context, _this): Nullish<any> {
        if (input === undefined)
          return;
        context.fail(_this, `{{label}} defined`, input);
      }, options
  );
}
