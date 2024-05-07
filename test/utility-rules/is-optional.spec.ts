import { isNumber, isString, vg } from 'valgen';

describe('isOptional', function () {
  it('should validate optional value', function () {
    expect(vg.optional(isNumber)(0)).toStrictEqual(0);
    expect(vg.optional(isString)('')).toStrictEqual('');
    expect(vg.optional(isString)(undefined)).toStrictEqual(undefined);
    expect(vg.optional(isString)(null)).toStrictEqual(null);
  });
});
