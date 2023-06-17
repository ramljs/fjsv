import { ErrorIssue } from './types.js';

export class ValidationError extends Error {

  issues: ErrorIssue[] = [];

  constructor(issues: ErrorIssue[]) {
    super(issues[0].message);
    this.issues = issues;
  }

}
