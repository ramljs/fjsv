import { Codec, codec } from '../codec.js';
import { Context } from '../context.js';

/**
 * Validates if given value is one of enum values or returns undefined if nullish
 * @codec tuple
 */
export function $enum<T1, I1>(values: I1 | I1[]): Codec<T1, I1 | I1[]> {
  // Prepare an object for fast lookup
  const valObj = (Array.isArray(values) ? values : [values])
      .reduce<any>((a, v) => {
        a[v] = true;
        return a;
      }, {});

  return codec<any>('enum',
      function (input: unknown, context: Context) {
        if (input == null)
          return;
        if (valObj[input as any])
          return input;
        context.failure({
          message: `{{location}} must be one of accepted values`,
          enum: values
        });
      }
  )
}
