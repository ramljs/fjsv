import { forwardRef, isString } from 'valgen';

describe('forwardRef', () => {
  it('should forward reference', () => {
    expect(forwardRef(() => isString)(1, { coerce: true })).toStrictEqual('1');
  });
});
