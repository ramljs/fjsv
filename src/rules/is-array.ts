import {
  Context, Nullish,
  ValidationOptions, Validator, validator,
} from '../core/index.js';

/**
 * Validates if value is "array" and applies validation for each item.
 * Converts input value to array if coerce option is set to 'true'.
 * @validator isArray
 */
export function isArray<T, I>(
    itemValidator?: Validator<T, I>,
    options?: ValidationOptions
) {
  return validator<T[], I[] | I>('isArray',
      function (
          input: unknown,
          context: Context,
          _this
      ): Nullish<T[]> {
        if (input != null && context.coerce && !Array.isArray(input))
          input = [input];
        if (!Array.isArray(input)) {
          context.fail(_this, `{{label}} is not an array`, input);
          return;
        }
        if (!itemValidator)
          return input as T[];
        const location = context.location || '';
        const itemContext = context.extend();
        let i: number;
        let v: any;
        const l = input.length;
        const out: any[] = [];
        for (i = 0; i < l; i++) {
          v = input[i];
          itemContext.scope = input;
          itemContext.location = location + '[' + i + ']';
          itemContext.label = context.label
              ? context.label + `[${i}]`
              : `Item at (${i})`;
          itemContext.index = i;
          v = itemValidator(v, itemContext) as T;
          out.push(v);
        }
        return out;
      }, options
  )
}
