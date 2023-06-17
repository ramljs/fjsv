import {
  Context, kValidatorFn, Nullish,
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
      function (input: unknown, context: Context): Nullish<T[]> {
        if (input != null && context.coerce && !Array.isArray(input))
          input = [input];
        if (!Array.isArray(input)) {
          context.failure(`{{label}} is not an array`);
          return;
        }
        if (!itemValidator)
          return input as T[];
        const location = context.input.location || '';
        const itemContext = context.extend(itemValidator);
        let i;
        let v;
        const l = input.length;
        const out: any[] = [];
        for (i = 0; i < l; i++) {
          v = input[i];
          itemContext.input.value = v;
          itemContext.input.label = ((context.input.label || context.input.property) || 'Item') +
              `[${i}]`;
          itemContext.input.property = i;
          itemContext.input.location = location + '[' + i + ']';
          out.push(itemValidator[kValidatorFn](v, itemContext, itemValidator) as T);
        }
        return out;
      }, options
  )
}
