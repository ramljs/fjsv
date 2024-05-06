import { Context, ValidationOptions, validator } from '../core/index.js';

type IsEmptyInput = string | any[] | object | Set<any> | Map<any, any>;

/**
 * Checks if value is an empty. Value should be string, array, set, map or object
 * @validator isEmpty
 */
export function isEmpty(options?: ValidationOptions) {
  return validator<IsEmptyInput, IsEmptyInput>('isEmpty',
      function (
          input: unknown,
          context: Context,
          _this
      ) {
        if (input == null)
          return input;
        if (typeof input === 'string') {
          if (!input)
            return input;
          context.fail(_this, `Is not an empty string`, input);
        } else if (Array.isArray(input)) {
          if (!input.length)
            return input;
          context.fail(_this, `Is not an empty array`, input);
        } else if (input instanceof Set) {
          if (!input.size)
            return input;
          context.fail(_this, `Is not an empty Set`, input);
        } else if (input instanceof Map) {
          if (!input.size)
            return input;
          context.fail(_this, `Is not an empty Map`, input);
        } else if (typeof input === 'object') {
          if (!Object.keys(input).length)
            return input;
          context.fail(_this, `Is not an empty Object`, input);
        }
        context.fail(_this, `Is not empty`, input);
      }, options
  )
}

/**
 * Checks if value is a not empty. Value should be string, array, set, map or object
 * @validator isNotEmpty
 */
export function isNotEmpty(options?: ValidationOptions) {
  return validator<IsEmptyInput, IsEmptyInput>('isNotEmpty',
      function (
          input: unknown,
          context: Context,
          _this
      ) {
        if (input != null) {
          if (typeof input === 'string') {
            if (input)
              return input;
            context.fail(_this, `Value is an empty string`, input);
          } else if (Array.isArray(input)) {
            if (input.length)
              return input;
            context.fail(_this, `Value is an empty array`, input);
          } else if (input instanceof Set) {
            if (input.size)
              return input;
            context.fail(_this, `Value is an empty Set`, input);
          } else if (input instanceof Map) {
            if (input.size)
              return input;
            context.fail(_this, `Value is an empty Map`, input);
          } else if (typeof input === 'object') {
            if (Object.keys(input).length)
              return input;
            context.fail(_this, `Value is an empty Object`, input);
          }
        }
        context.fail(_this, `Value is empty`, input);
      }, options
  )
}
