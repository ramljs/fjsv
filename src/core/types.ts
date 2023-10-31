import type { Context } from './context';

export interface ErrorIssue {
  message: string;
  rule: string;
  value: any;
  root?: string;
  location?: string;
  context?: string;
  property?: string;
  index?: number;
  label?: string;

  [key: string]: any;
}

export type OnFailFunction =
    (issue: ErrorIssue, context: Context, _super?: OnFailFunction) => string | Omit<ErrorIssue, 'id' | 'input'>;

export interface ValidationOptions {
  onFail?: OnFailFunction;
}

export interface ExecutionOptions extends ValidationOptions {
  coerce?: boolean;
  maxErrors?: number;
  label?: string;
}
