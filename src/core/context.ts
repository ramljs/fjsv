import { kOptions } from './constants.js';
import type { ErrorIssue, ExecutionOptions, OnFailFunction } from './types';
import { ValidationError } from './validation-error.js';
import type { Validator } from './validator';

const VARIABLE_REPLACE_PATTERN = /{{([^}]*)}}/g;
const OPTIONAL_VAR_PATTERN = /^([^?]+)(?:\||(.*))?$/;


export namespace Context {

  export interface InputDetails {
    context?: string;
    root?: string;
    value?: any;
    label?: string;
    location?: string;
    property?: string | number;

    [key: string]: any;
  }
}

export class Context implements ExecutionOptions {
  rule: Validator<any>;
  errors: ErrorIssue[] = [];
  maxErrors?: number;
  onFail?: OnFailFunction;
  coerce?: boolean;
  input: Context.InputDetails = {};
  parent?: Context;
  root?: Context;

  constructor(rule: Validator<any>, options?: ExecutionOptions) {
    this.rule = rule;
    if (options?.maxErrors != null)
      this.maxErrors = options.maxErrors;
    if (typeof options?.onFail === 'function')
      this.onFail = options.onFail;
    if (options?.coerce != null)
      this.coerce = options?.coerce;
  }

  failure(message: Partial<ErrorIssue> | string | Error): void {
    const issue: ErrorIssue =
        (typeof message === 'object'
                ? {...message, message: message.message}
                : {message: '' + message}
        ) as ErrorIssue;
    issue.rule = this.rule.id;
    Object.assign(issue, this.input);
    if (this.onFail) {
      const proto = Object.getPrototypeOf(this);
      const x = this.onFail(issue, this, proto.onFail);
      if (!x)
        return;
      if (typeof x === 'object') {
        delete x.id;
        delete x.input;
        Object.assign(issue, x);
      } else
        issue.message = String(x);
    }
    issue.message = ('' + issue.message).replace(VARIABLE_REPLACE_PATTERN, (x, g: string) => {
      const m = OPTIONAL_VAR_PATTERN.exec(g);
      if (!m)
        return x;
      const k = m[1];
      const v = this.input[k] ??
          (m[1] === 'label' ? this.input.property : undefined);
      if (v != null) return '`' + v + '`';
      if (m[2])
        return m[2];
      return m[1] === 'label' ? 'Value' : x;
    })

    this.errors.push(issue);
    if (this.errors.length >= (this.maxErrors ?? Infinity))
      throw new ValidationError(this.errors);
  }

  extend(rule: Validator<any, any>, options?: ExecutionOptions): Context {
    const extended = new Context(rule, {onFail: undefined, ...rule[kOptions], ...options});
    Object.setPrototypeOf(extended, this);
    delete (extended as any).errors;
    extended.parent = this;
    extended.root = this.root || this;
    return extended;
  }

}
