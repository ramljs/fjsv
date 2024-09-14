import {
  type Context,
  type Nullish,
  type ValidationOptions,
  type Validator,
  validator,
} from '../../core/index.js';
import { getLength } from '../utility-rules/get-length.js';
import { allOf, pipe } from '../utility-rules/pipe.js';

type RangeInput = number | bigint | Date | string;

/**
 * Checks if value is between minValue and maxValue
 * @validator range
 */
export function range<T extends RangeInput>(
  minValue: T,
  maxValue: T,
  options?: ValidationOptions,
) {
  return validator<T>(
    'range',
    (input: RangeInput, context: Context, _this): Nullish<T> => {
      if (
        (typeof minValue === 'number' || typeof minValue === 'bigint') &&
        (typeof maxValue === 'number' || typeof maxValue === 'bigint') &&
        (typeof input === 'number' || typeof input === 'bigint') &&
        input >= minValue &&
        input <= maxValue
      ) {
        return input as T;
      }
      if (
        minValue instanceof Date &&
        maxValue instanceof Date &&
        input instanceof Date &&
        input >= minValue &&
        input <= maxValue
      ) {
        return input as T;
      }
      if (
        typeof minValue === 'string' &&
        typeof maxValue === 'string' &&
        typeof input === 'string' &&
        input >= minValue &&
        input <= maxValue
      ) {
        return input as T;
      }
      context.fail(
        _this,
        `Value must be between ${minValue} and ${maxValue}`,
        input,
      );
    },
    options,
  );
}

/**
 * Checks if value is grater than "minValue"
 * @validator iGt
 */
export function isGt(
  minValue: number,
  options?: ValidationOptions,
): Validator<number, number>;
export function isGt(
  minValue: bigint,
  options?: ValidationOptions,
): Validator<bigint, bigint | number>;
export function isGt(
  minValue: Date,
  options?: ValidationOptions,
): Validator<Date, Date>;
export function isGt(
  minValue: string,
  options?: ValidationOptions & {
    caseInsensitive?: boolean;
  },
): Validator<string, string>;
export function isGt(
  minValue: any,
  options?: ValidationOptions & { caseInsensitive?: boolean },
): Validator {
  return validator<RangeInput, RangeInput>(
    'isGt',
    (input: RangeInput, context: Context, _this): Nullish<RangeInput> => {
      if (
        (typeof minValue === 'number' || typeof minValue === 'bigint') &&
        (typeof input === 'number' || typeof input === 'bigint') &&
        input > minValue
      ) {
        return input;
      }
      if (
        minValue instanceof Date &&
        input instanceof Date &&
        input > minValue
      ) {
        return input;
      }
      if (
        typeof minValue === 'string' &&
        typeof input === 'string' &&
        (input > minValue ||
          (options?.caseInsensitive &&
            input.toLowerCase() > minValue.toLowerCase()))
      ) {
        return input;
      }
      context.fail(
        _this,
        `{{label}} must be greater than ${typeof minValue === 'string' ? `"${minValue}"` : minValue}`,
        input,
      );
    },
    options,
  );
}

// *************************************************************

/**
 * Checks if value is grater than or equal to minValue
 * @validator isGte
 */
export function isGte(
  minValue: number,
  options?: ValidationOptions,
): Validator<number, number>;
export function isGte(
  minValue: bigint,
  options?: ValidationOptions,
): Validator<bigint, bigint | number>;
export function isGte(
  minValue: Date,
  options?: ValidationOptions,
): Validator<Date, Date>;
export function isGte(
  minValue: string,
  options?: ValidationOptions & {
    caseInsensitive?: boolean;
  },
): Validator<string, string>;
export function isGte(
  minValue: any,
  options?: ValidationOptions & { caseInsensitive?: boolean },
): Validator {
  return validator<RangeInput, RangeInput>(
    'isGte',
    (input: unknown, context: Context, _this): Nullish<RangeInput> => {
      if (
        (typeof minValue === 'number' || typeof minValue === 'bigint') &&
        (typeof input === 'number' || typeof input === 'bigint') &&
        input >= minValue
      ) {
        return input;
      }
      if (
        minValue instanceof Date &&
        input instanceof Date &&
        input >= minValue
      ) {
        return input;
      }
      if (
        typeof minValue === 'string' &&
        typeof input === 'string' &&
        (input >= minValue ||
          (options?.caseInsensitive &&
            input.toLowerCase() >= minValue.toLowerCase()))
      ) {
        return input;
      }
      context.fail(
        _this,
        `{{label}} must be greater than or equal to ${typeof minValue === 'string' ? `"${minValue}"` : minValue}`,
        input,
      );
    },
    options,
  );
}

// *************************************************************

/**
 * Checks if number value is lover than maxValue
 * @validator isLt
 */
export function isLt(
  maxValue: number,
  options?: ValidationOptions,
): Validator<number, number>;
export function isLt(
  maxValue: bigint,
  options?: ValidationOptions,
): Validator<bigint, bigint | number>;
export function isLt(
  maxValue: Date,
  options?: ValidationOptions,
): Validator<Date, Date>;
export function isLt(
  maxValue: string,
  options?: ValidationOptions & {
    caseInsensitive?: boolean;
  },
): Validator<string, string>;
export function isLt(
  maxValue: any,
  options?: ValidationOptions & { caseInsensitive?: boolean },
): Validator {
  return validator<RangeInput, RangeInput>(
    'isLt',
    (input: unknown, context: Context, _this): Nullish<RangeInput> => {
      if (
        (typeof maxValue === 'number' || typeof maxValue === 'bigint') &&
        (typeof input === 'number' || typeof input === 'bigint') &&
        input < maxValue
      ) {
        return input;
      }
      if (
        maxValue instanceof Date &&
        input instanceof Date &&
        input < maxValue
      ) {
        return input;
      }
      if (
        typeof maxValue === 'string' &&
        typeof input === 'string' &&
        (input < maxValue ||
          (options?.caseInsensitive &&
            input.toLowerCase() < maxValue.toLowerCase()))
      ) {
        return input;
      }
      context.fail(
        _this,
        `{{label}} must be lover than ${typeof maxValue === 'string' ? `"${maxValue}"` : maxValue}`,
        input,
      );
    },
    options,
  );
}

// *************************************************************

/**
 * Checks if value is lover than or equal to maxValue
 * @validator isLte
 */
export function isLte(
  maxValue: number,
  options?: ValidationOptions,
): Validator<number, number>;
export function isLte(
  maxValue: bigint,
  options?: ValidationOptions,
): Validator<bigint, bigint | number>;
export function isLte(
  maxValue: Date,
  options?: ValidationOptions,
): Validator<Date, Date>;
export function isLte(
  maxValue: string,
  options?: ValidationOptions & {
    caseInsensitive?: boolean;
  },
): Validator<string, string>;
export function isLte(
  maxValue: any,
  options?: ValidationOptions & { caseInsensitive?: boolean },
): Validator {
  return validator<RangeInput, RangeInput>(
    'isLte',
    (input: unknown, context: Context, _this): Nullish<RangeInput> => {
      if (
        (typeof maxValue === 'number' || typeof maxValue === 'bigint') &&
        (typeof input === 'number' || typeof input === 'bigint') &&
        input <= maxValue
      ) {
        return input;
      }
      if (
        maxValue instanceof Date &&
        input instanceof Date &&
        input <= maxValue
      ) {
        return input;
      }
      if (
        typeof maxValue === 'string' &&
        typeof input === 'string' &&
        (input <= maxValue ||
          (options?.caseInsensitive &&
            input.toLowerCase() <= maxValue.toLowerCase()))
      ) {
        return input;
      }
      context.fail(
        _this,
        `{{label}} must be lover than or equal to ${typeof maxValue === 'string' ? `"${maxValue}"` : maxValue}`,
        input,
      );
    },
    options,
  );
}

/**
 * Checks the length is at least "minValue"
 * @validator lengthMin
 */
export const lengthMin = (minValue: number) =>
  allOf([
    pipe([
      getLength(),
      isGte(minValue, {
        onFail: () => `The length of {{label}} must be at least ${minValue}`,
      }),
    ]),
  ]);

/**
 * Checks if the length is at most "maxValue"
 * @validator lengthMax
 */
export const lengthMax = (maxValue: number) =>
  allOf([
    pipe([
      getLength(),
      isLte(maxValue, {
        onFail: () => `The length of {{label}} must be at most ${maxValue}`,
      }),
    ]),
  ]);
