import { Context, ValidationOptions, Validator, validator } from '../core/index.js';

/**
 * Validates if given value is one of enum values.
 * @validator isEnum
 */
export function isEnum<T1, I1>(
    values: I1 | I1[],
    options?: ValidationOptions & {
      caseInSensitive?: boolean;
      enumName?: string;
    }
): Validator<T1, I1 | I1[]> {
  const caseInSensitive = !!(options?.caseInSensitive);
  const enumName = options?.enumName;
  // Prepare an object for fast lookup
  const valObj = (Array.isArray(values) ? values : [values])
      .reduce<any>((a, v) => {
        if (typeof v === 'string' && caseInSensitive)
          a[v.toUpperCase()] = true;
        else
          a[v] = true;
        return a;
      }, {});

  return validator<any>('isEnum',
      function (input: any, context: Context) {
        if (input != null && valObj[
            typeof input === 'string' && caseInSensitive ? input.toUpperCase() : input
            ])
          return input;
        context.failure({
          message: `Value must be one of enumeration member${enumName ? ` (${enumName})` : ''}`,
          enum: enumName
        });
      }, options
  )
}
