import { Context, Nullish, ValidationOptions, validator } from '../../core/index.js';

/**
 * Validates if value is "integer".
 * Converts input value to integer number if coerce option is set to 'true'.
 * @validator isInteger
 */
export function isInteger(options?: ValidationOptions) {
  return validator<number, unknown>(
    'isInteger',
    function (input: unknown, context: Context, _this): Nullish<number> {
      const coerce = options?.coerce || context.coerce;
      let output: any = input;
      if (output != null && typeof output !== 'number' && coerce) {
        if (typeof input === 'string') output = parseFloat(input);
        else if (typeof input === 'bigint') {
          output = Number(input);
          if (input === BigInt(output)) input = output;
        }
      }
      if (typeof output === 'number' && !isNaN(output) && Number.isInteger(output)) return output;
      const t = typeof input === 'bigint' ? 'BigInt ' : typeof input === 'string' ? 'String ' : '';
      context.fail(_this, `${t}"{{value}}" is not a valid integer value`, input);
    },
    options,
  );
}
