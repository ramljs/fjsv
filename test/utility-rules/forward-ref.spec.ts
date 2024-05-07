import { forwardRef, isString } from 'valgen';

describe('forwardRef', function () {
  it('should forward reference', function () {
    expect(forwardRef(() => isString)(1, { coerce: true })).toStrictEqual('1');
  });
});
