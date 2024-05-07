import { isNotEmpty } from 'valgen';

describe('isNotEmpty', function () {
  it('should validate value is an empty string', function () {
    expect(isNotEmpty('abc')).toStrictEqual('abc');
    expect(() => isNotEmpty('')).toThrow('Value is an empty string');
  });

  it('should validate value is an empty array', function () {
    expect(isNotEmpty([0])).toStrictEqual([0]);
    expect(() => isNotEmpty([])).toThrow('Value is an empty array');
  });

  it('should validate value is an empty Object', function () {
    expect(isNotEmpty({ a: 1 })).toStrictEqual({ a: 1 });
    expect(() => isNotEmpty({})).toThrow('Value is an empty Object');
  });

  it('should validate value is an empty Set', function () {
    expect(isNotEmpty(new Set([0]))).toBeInstanceOf(Set);
    expect(() => isNotEmpty(new Set())).toThrow('Value is an empty Set');
  });

  it('should validate value is an empty Map', function () {
    expect(isNotEmpty(new Map([['a', 0]]))).toBeInstanceOf(Map);
    expect(() => isNotEmpty(new Map())).toThrow('Value is an empty Map');
  });

  it('should throw if unknown type passed', function () {
    expect(() => isNotEmpty(NaN as any)).toThrow('Value is empty');
  });
});
