import { Nullish } from 'ts-gems';
import { camelCase } from '../helpers/string.utils.js';
import { kOptions, kValidatorFn } from './constants.js';
import { Context } from './context.js';
import { ErrorIssue, ExecutionOptions, ValidationOptions } from './types.js';
import { ValidationError } from './validation-error.js';

export type ValidateFunction<T, I = T, R extends Validator<T, I> = Validator<T, I>> =
    (input: I, context: Context, _this: R) => Nullish<T>;


export interface Validator<T, I = unknown, O extends ExecutionOptions = ExecutionOptions> {
  (input: I, options?: O, context?: Context): T;

  silent(input: I, options?: O, context?: Context): { value?: T, errors?: ErrorIssue[] };

  id: string;
  args?: Record<string, any>;
  [kValidatorFn]: ValidateFunction<T, I>;
}

export function validator<T, I = T, O extends ExecutionOptions = ExecutionOptions>(
    fn: ValidateFunction<T, I>,
    validatorOptions?: ValidationOptions
): Validator<T, I, O>
export function validator<T, I = T, O extends ExecutionOptions = ExecutionOptions>(
    id: string,
    fn: ValidateFunction<T, I>,
    validatorOptions?: ValidationOptions
): Validator<T, I, O>
export function validator(arg0, arg1?, arg2?) {
  let id = '';
  let fn: ValidateFunction<any>;
  let validatorOptions: ValidationOptions | undefined;
  if (typeof arg0 === 'string') {
    id = arg0;
    fn = arg1;
    validatorOptions = arg2;
  } else {
    fn = arg0;
    validatorOptions = arg1;
  }
  if (typeof fn !== 'function')
    throw new TypeError('You must provide a rule function argument');
  id = id || fn.name || 'unnamed-rule';
  const name = fn.name || camelCase(id);
  const _rule = ({
    [name](input: unknown, options?: ExecutionOptions, parent?: Context): any {
      const ctx = parent ? parent.extend(_rule, options) : new Context(_rule, options);
      let value;
      try {
        ctx.input.value = input;
        value = fn(input, ctx, _rule as any);
      } catch (e: any) {
        if (!parent && e instanceof ValidationError)
          throw e;
        ctx.failure(e);
      }
      if (!parent && ctx.errors.length)
        throw new ValidationError(ctx.errors);
      return value;
    }
  })[name] as Validator<any, any>;

  _rule.id = id;
  _rule[kValidatorFn] = fn;
  _rule[kOptions] = validatorOptions || {};

  _rule.silent = (input: any, options?: ExecutionOptions, context?: Context) => {
    try {
      const value = _rule(input, options, context);
      return {value};
    } catch (e) {
      return {errors: (e as ValidationError).issues}
    }
  }

  return _rule;
}

export function isValidator(x: any): x is Validator<any, any> {
  return !!(typeof x === 'function' && x.id && x[kValidatorFn]);
}
