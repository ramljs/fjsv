import {
  Context, kValidatorFn,
  ValidationOptions, Validator, validator
} from '../core/index.js';

/**
 * Validates if value is "tuple" and applies validation for each item.
 * Converts input value to tuple if coerce option is set to 'true'.
 * @validator isTuple
 */
export function isTuple<T1, I1>(
    items: [Validator<T1, I1>],
    options?: ValidationOptions
): Validator<[T1], [I1]>
export function isTuple<T1, I1, T2, I2>(
    items: [Validator<T1, I1>, Validator<T2, I2>],
    options?: ValidationOptions
): Validator<[T1, T2], [I1, I2]>
export function isTuple<T1, I1, T2, I2, T3, I3>(
    items: [Validator<T1, I1>, Validator<T2, I2>, Validator<T3, I3>],
    options?: ValidationOptions
): Validator<[T1, T2, T3], [I1, I2, I3]>
export function isTuple<T1, I1, T2, I2, T3, I3, T4, I4>(
    items: [Validator<T1, I1>, Validator<T2, I2>, Validator<T3, I3>, Validator<T4, I4>],
    options?: ValidationOptions
): Validator<[T1, T2, T3, T4], [I1, I2, I3, I4]>
export function isTuple<T1, I1, T2, I2, T3, I3, T4, I4>(
    items: [Validator<T1, I1>, Validator<T2, I2>, Validator<T3, I3>, Validator<T4, I4>],
    options?: ValidationOptions
): Validator<[T1, T2, T3, T4], [I1, I2, I3, I4]>
export function isTuple<T1, I1, T2, I2, T3, I3, T4, I4, T5, I5>(
    items: [Validator<T1, I1>, Validator<T2, I2>, Validator<T3, I3>,
      Validator<T4, I4>, Validator<T5, I5>],
    options?: ValidationOptions
): Validator<[T1, T2, T3, T4, T5], [I1, I2, I3, I4, I5]>
export function isTuple<T1, I1, T2, I2, T3, I3, T4, I4, T5, I5, T6, I6>(
    items: [Validator<T1, I1>, Validator<T2, I2>, Validator<T3, I3>,
      Validator<T4, I4>, Validator<T5, I5>, Validator<T6, I6>, ...Validator<any, any>[]],
    options?: ValidationOptions
): Validator<[T1, T2, T3, T4, T5, T6, ...any[]], [I1, I2, I3, I4, I5, I5, ...any[]]>
export function isTuple(
    items: Validator<any, any>[],
    options?: ValidationOptions
) {
  return validator<any>('isTuple',
      function (input: unknown, context: Context) {
        if (input != null && context.coerce && !Array.isArray(input))
          input = [input];
        if (!Array.isArray(input)) {
          context.failure(`{{label}} is not a valid tuple`);
          return;
        }
        const location = context.input.location || '';
        let itemRule: Validator<any>;
        let i;
        const l = input.length;
        const out: any[] = [];
        const nl = items.length;
        for (i = 0; i < l && i < nl; i++) {
          itemRule = items[i];
          const itemContext = context.extend(itemRule);
          itemContext.input.value = input[i];
          itemContext.input.label = ((context.input.label || context.input.property) || 'Item') +
              `[${i}]`;
          itemContext.input.property = i;
          itemContext.input.location = location + '[' + i + ']';
          out.push(itemRule[kValidatorFn](input[i], itemContext, itemRule) ?? null);
        }
        return context.errors.length ? undefined : out;
      }, options
  )
}
