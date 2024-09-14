import {
  type Context,
  type ValidationOptions,
  type Validator,
  validator,
} from '../../core/index.js';

/**
 * Validates if value is "tuple" and applies validation for each item.
 * Converts input value to tuple if coerce option is set to 'true'.
 * @validator isTuple
 */
export function isTuple<T1, I1>(
  items: [Validator<T1, I1>],
  options?: ValidationOptions,
): Validator<[T1], [I1]>;
export function isTuple<T1, I1, T2, I2>(
  items: [Validator<T1, I1>, Validator<T2, I2>],
  options?: ValidationOptions,
): Validator<[T1, T2], [I1, I2]>;
export function isTuple<T1, I1, T2, I2, T3, I3>(
  items: [Validator<T1, I1>, Validator<T2, I2>, Validator<T3, I3>],
  options?: ValidationOptions,
): Validator<[T1, T2, T3], [I1, I2, I3]>;
export function isTuple<T1, I1, T2, I2, T3, I3, T4, I4>(
  items: [
    Validator<T1, I1>,
    Validator<T2, I2>,
    Validator<T3, I3>,
    Validator<T4, I4>,
  ],
  options?: ValidationOptions,
): Validator<[T1, T2, T3, T4], [I1, I2, I3, I4]>;
export function isTuple<T1, I1, T2, I2, T3, I3, T4, I4>(
  items: [
    Validator<T1, I1>,
    Validator<T2, I2>,
    Validator<T3, I3>,
    Validator<T4, I4>,
  ],
  options?: ValidationOptions,
): Validator<[T1, T2, T3, T4], [I1, I2, I3, I4]>;
export function isTuple<T1, I1, T2, I2, T3, I3, T4, I4, T5, I5>(
  items: [
    Validator<T1, I1>,
    Validator<T2, I2>,
    Validator<T3, I3>,
    Validator<T4, I4>,
    Validator<T5, I5>,
  ],
  options?: ValidationOptions,
): Validator<[T1, T2, T3, T4, T5], [I1, I2, I3, I4, I5]>;
export function isTuple<T1, I1, T2, I2, T3, I3, T4, I4, T5, I5, T6, I6>(
  items: [
    Validator<T1, I1>,
    Validator<T2, I2>,
    Validator<T3, I3>,
    Validator<T4, I4>,
    Validator<T5, I5>,
    Validator<T6, I6>,
    ...Validator[],
  ],
  options?: ValidationOptions,
): Validator<
  [T1, T2, T3, T4, T5, T6, ...any[]],
  [I1, I2, I3, I4, I5, I5, ...any[]]
>;
export function isTuple(items: Validator[], options?: ValidationOptions) {
  return validator<any>(
    'isTuple',
    (input: unknown, context: Context, _this) => {
      const coerce = options?.coerce || context.coerce;
      let output: any = input;
      if (output != null && coerce && !Array.isArray(output)) output = [output];
      if (!Array.isArray(input)) {
        context.fail(_this, `"{{value}}" is not a valid tuple`, input);
        return;
      }
      const location = context.location || '';
      let itemRule: Validator<any>;
      let i: number;
      let v: any;
      const l = output.length;
      const out: any[] = [];
      const nl = items.length;
      const itemContext = context.extend();
      for (i = 0; i < l && i < nl; i++) {
        itemRule = items[i];
        itemContext.scope = output;
        itemContext.label = context.label
          ? context.label + `[${i}]`
          : undefined;
        itemContext.index = i;
        itemContext.location = location + '[' + i + ']';
        itemContext.label =
          (itemContext.label || itemContext.property || 'Value at ') + `[${i}]`;
        v = itemRule(output[i], itemContext);
        out.push(v);
      }
      return context.errors.length ? undefined : out;
    },
    options,
  );
}
