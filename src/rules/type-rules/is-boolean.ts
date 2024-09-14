import {
  type Context,
  type Nullish,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

const TRUE_PATTERN = /^true|t|1|yes|y$/i;
const FALSE_PATTERN = /^false|f|0|no|n$/i;

/**
 * Validates if value is "boolean".
 * Converts input value to boolean if coerce option is set to 'true'.
 * @validator isBoolean
 */
export function isBoolean(options?: ValidationOptions) {
  return validator<boolean | undefined, unknown>(
    'isBoolean',
    (input: unknown, context: Context, _this): Nullish<boolean> => {
      const coerce = options?.coerce || context.coerce;
      let output: any = input;
      if (output != null && typeof output !== 'boolean' && coerce) {
        if (typeof input === 'string') {
          if (TRUE_PATTERN.test(input)) return true;
          if (FALSE_PATTERN.test(input)) return false;
          throw new TypeError(`Invalid boolean string`);
        }
        if (input === 1 || input === 0) output = !!input;
      }
      if (typeof output === 'boolean') return output;
      const t = typeof input === 'string' ? 'String ' : '';
      context.fail(
        _this,
        `${t}"{{value}}" is not a valid boolean value`,
        input,
      );
    },
    options,
  );
}
