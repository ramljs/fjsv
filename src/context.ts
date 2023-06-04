import { CodecOptions, ErrorIssue } from './types.js';
import { ValidationError } from './validation-error.js';

interface CurrentInfo {
  id: string;
  input: any;
  location?: string;
  property?: string;
}

const VARIABLE_REPLACE_PATTERN = /{{([^}]*)}}/g;
const OPTIONAL_VAR_PATTERN = /^([^?]+)(?:\?(.*))?$/;

export class Context {
  options: CodecOptions;
  errors: ErrorIssue[] = [];
  current: CurrentInfo;
  crc?: Map<object, object>;

  constructor(current: CurrentInfo, options?: CodecOptions) {
    this.options = options || {};
    this.current = current;
  }

  failure(message: Partial<ErrorIssue> | string | Error): void {
    const issue: ErrorIssue =
        (typeof message === 'object'
                ? {...message}
                : {message: '' + message}
        ) as ErrorIssue;
    issue.id = this.current.id;
    issue.input = this.current.input;
    if (this.options.onFail) {
      const x = this.options.onFail(issue, this);
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
      const v = this.current[m[1]];
      if (v)
        return (m[1] === 'location' || m[1] === 'input' ? '"' + v + '"' : v);
      if (m[2])
        return m[2];
      return m[1] === 'location' ? 'Value' : x;
    })

    this.errors.push(issue);
    if (this.errors.length >= this.maxErrors)
      throw new ValidationError(this.errors);
  }

  get maxErrors(): number {
    return this.options.maxErrors ?? Infinity;
  }

}
