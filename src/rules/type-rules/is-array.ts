import {
  type Context,
  type Nullish,
  type ValidationOptions,
  type Validator,
  validator,
} from '../../core/index.js';

/**
 * Validates if value is "array" and applies validation for each item.
 * Converts input value to array if coerce option is set to 'true'.
 * @validator isArray
 */
export function isArray<T, I>(
  itemValidator?: Validator<T, I>,
  options?: ValidationOptions,
) {
  return validator<T[], I[] | I>(
    'isArray',
    (input: unknown, context: Context, _this): Nullish<T[]> => {
      const coerce = options?.coerce || context.coerce;
      let output: any = input;
      if (output != null && coerce && !Array.isArray(output)) output = [output];
      if (!Array.isArray(output)) {
        context.fail(_this, `"{{value}}" is not an array value`, input);
        return;
      }
      if (!itemValidator) return output as T[];
      // const location = context.location || '';
      const itemContext = context.extend();
      let i: number;
      let v: any;
      const l = output.length;
      const out: any[] = [];
      for (i = 0; i < l; i++) {
        v = output[i];
        itemContext.scope = output;
        // itemContext.location = location + '[' + i + ']';
        itemContext.location = context.location
          ? context.location + `[${i}]`
          : `<Array>[${i}]`;
        itemContext.index = i;
        v = itemValidator(v, itemContext) as T;
        out.push(v);
      }
      return out;
    },
    options,
  );
}
