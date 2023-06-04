import type { Context } from './context.js';

export interface ErrorIssue {
  id: string;
  message: string;
  input: any;

  [key: string]: any;
}

export interface CodecOptions {
  maxErrors?: number;
  onFail?: (issue: ErrorIssue, context: Context) => string | Omit<ErrorIssue, 'id' | 'input'>;

  [key: string]: any;
}
