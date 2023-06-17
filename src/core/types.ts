import type { Context } from './context';

export interface ErrorIssue {
  rule: string;
  message: string;
  value: any;
  root?: string;
  context?: string;
  property?: string;

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
}
