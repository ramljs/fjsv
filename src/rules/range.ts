import {
  Context, Nullish,
  ValidationOptions, Validator, validator
} from '../core/index.js';

type RangeInput = number | bigint | Date | string;

/**
 * Checks if value is grater than "minValue"
 * @validator iGt
 */
export function isGt(minValue: number, options?: ValidationOptions): Validator<number, number>
export function isGt(minValue: bigint, options?: ValidationOptions): Validator<bigint, bigint | number>
export function isGt(minValue: Date, options?: ValidationOptions): Validator<Date, Date>
export function isGt(minValue: string, options?: ValidationOptions & {
  caseInsensitive?: boolean
}): Validator<string, string>
export function isGt(minValue: any, options?: ValidationOptions & { caseInsensitive?: boolean }): Validator<any, any> {
  return validator<RangeInput, RangeInput>('isGt',
      function (input: RangeInput, context: Context): Nullish<RangeInput> {
        if ((typeof minValue === 'number' || typeof minValue === 'bigint') &&
            (typeof input === 'number' || typeof input === 'bigint') &&
            input > minValue
        ) return input;
        if (minValue instanceof Date && input instanceof Date && input > minValue)
          return input;
        if (typeof minValue === 'string' && typeof input === 'string' &&
            (input > minValue ||
                (options?.caseInsensitive && input.toLowerCase() > minValue.toLowerCase())
            )
        ) return input;
        context.failure(`{{label}} must be greater than ${
            (typeof minValue === 'string' ? `"${minValue}"` : minValue)
        }`);
      }, options
  )
}

// *************************************************************

/**
 * Checks if value is grater than or equal to minValue
 * @validator isGte
 */
export function isGte(minValue: number, options?: ValidationOptions): Validator<number, number>
export function isGte(minValue: bigint, options?: ValidationOptions): Validator<bigint, bigint | number>
export function isGte(minValue: Date, options?: ValidationOptions): Validator<Date, Date>
export function isGte(minValue: string, options?: ValidationOptions & {
  caseInsensitive?: boolean
}): Validator<string, string>
export function isGte(minValue: any, options?: ValidationOptions & { caseInsensitive?: boolean }): Validator<any, any> {
  return validator<RangeInput, RangeInput>('isGte',
      function (input: unknown, context: Context): Nullish<RangeInput> {
        if ((typeof minValue === 'number' || typeof minValue === 'bigint') &&
            (typeof input === 'number' || typeof input === 'bigint') &&
            input >= minValue
        ) return input;
        if (minValue instanceof Date && input instanceof Date && input >= minValue)
          return input;
        if (typeof minValue === 'string' && typeof input === 'string' &&
            (input >= minValue ||
                (options?.caseInsensitive && input.toLowerCase() >= minValue.toLowerCase())
            )
        ) return input;
        context.failure(`{{label}} must be greater than or equal to ${
            (typeof minValue === 'string' ? `"${minValue}"` : minValue)
        }`);
      }, options
  )
}

// *************************************************************

/**
 * Checks if number value is lover than maxValue
 * @validator isLt
 */
export function isLt(maxValue: number, options?: ValidationOptions): Validator<number, number>
export function isLt(maxValue: bigint, options?: ValidationOptions): Validator<bigint, bigint | number>
export function isLt(maxValue: Date, options?: ValidationOptions): Validator<Date, Date>
export function isLt(maxValue: string, options?: ValidationOptions & {
  caseInsensitive?: boolean
}): Validator<string, string>
export function isLt(maxValue: any, options?: ValidationOptions & { caseInsensitive?: boolean }): Validator<any, any> {
  return validator<RangeInput, RangeInput>('isLt',
      function (input: unknown, context: Context): Nullish<RangeInput> {
        if ((typeof maxValue === 'number' || typeof maxValue === 'bigint') &&
            (typeof input === 'number' || typeof input === 'bigint') &&
            input < maxValue
        ) return input;
        if (maxValue instanceof Date && input instanceof Date && input < maxValue)
          return input;
        if (typeof maxValue === 'string' && typeof input === 'string' &&
            (input < maxValue ||
                (options?.caseInsensitive && input.toLowerCase() < maxValue.toLowerCase())
            )
        ) return input;
        context.failure(`{{label}} must be lover than ${
            (typeof maxValue === 'string' ? `"${maxValue}"` : maxValue)
        }`);
      }, options
  )
}

// *************************************************************

/**
 * Checks if value is lover than or equal to maxValue
 * @validator isLte
 */
export function isLte(maxValue: number, options?: ValidationOptions): Validator<number, number>
export function isLte(maxValue: bigint, options?: ValidationOptions): Validator<bigint, bigint | number>
export function isLte(maxValue: Date, options?: ValidationOptions): Validator<Date, Date>
export function isLte(maxValue: string, options?: ValidationOptions & {
  caseInsensitive?: boolean
}): Validator<string, string>
export function isLte(maxValue: any, options?: ValidationOptions & { caseInsensitive?: boolean }): Validator<any, any> {
  return validator<RangeInput, RangeInput>('isLt',
      function (input: unknown, context: Context): Nullish<RangeInput> {
        if ((typeof maxValue === 'number' || typeof maxValue === 'bigint') &&
            (typeof input === 'number' || typeof input === 'bigint') &&
            input <= maxValue
        ) return input;
        if (maxValue instanceof Date && input instanceof Date && input <= maxValue)
          return input;
        if (typeof maxValue === 'string' && typeof input === 'string' &&
            (input <= maxValue ||
                (options?.caseInsensitive && input.toLowerCase() <= maxValue.toLowerCase())
            )
        ) return input;
        context.failure(`{{label}} must be lover than or equal to ${
            (typeof maxValue === 'string' ? `"${maxValue}"` : maxValue)
        }`);
      }, options
  )
}


/**
 * Checks if value is between minValue and maxValue
 * @validator range
 */
export function range<T extends RangeInput>(
    minValue: T,
    maxValue: T,
    options?: ValidationOptions
) {
  return validator<T>('range',
      function (input: RangeInput, context: Context): Nullish<T> {
        if ((typeof minValue === 'number' || typeof minValue === 'bigint') &&
            (typeof maxValue === 'number' || typeof maxValue === 'bigint') &&
            (typeof input === 'number' || typeof input === 'bigint') &&
            input >= minValue && input <= maxValue)
          return input as T;
        if (minValue instanceof Date && maxValue instanceof Date &&
            input instanceof Date && input >= minValue && input <= maxValue)
          return input as T;
        if (typeof minValue === 'string' && typeof maxValue === 'string' &&
            typeof input === 'string' && input >= minValue && input <= maxValue)
          return input as T;
        context.failure(`{{label}} must be between ${minValue} and ${maxValue}`);
      }, options
  )
}