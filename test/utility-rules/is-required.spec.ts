import { isNumber, isString, vg } from 'valgen';

describe('isRequired', function () {
  it('should validate required value', function () {
    expect(vg.required(isNumber)(0)).toStrictEqual(0);
    expect(vg.required(isString)('')).toStrictEqual('');
    expect(() => vg.required(isString)(undefined)).toThrow('Value is required');
    expect(() => vg.required(isString)(null)).toThrow('Value is required');
  });
});
