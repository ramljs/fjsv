import { isEmpty } from 'valgen';

describe('isEmpty', function () {
  it('should validate value is an empty string', function () {
    expect(isEmpty('')).toStrictEqual('');
    expect(() => isEmpty('dd')).toThrow('Is not an empty string');
  });

  it('should validate value is an empty array', function () {
    expect(isEmpty([])).toStrictEqual([]);
    expect(() => isEmpty([0])).toThrow('Is not an empty array');
  });

  it('should validate value is an empty Object', function () {
    expect(isEmpty({})).toStrictEqual({});
    expect(() => isEmpty({ a: 1 })).toThrow('Is not an empty Object');
  });

  it('should validate value is an empty Set', function () {
    expect(isEmpty(new Set())).toBeInstanceOf(Set);
    expect(() => isEmpty(new Set([0]))).toThrow('Is not an empty Set');
  });

  it('should validate value is an empty Map', function () {
    expect(isEmpty(new Map())).toBeInstanceOf(Map);
    expect(() => isEmpty(new Map([['a', 0]]))).toThrow('Is not an empty Map');
  });

  it('should throw if unknown type passed', function () {
    expect(() => isEmpty(NaN as any)).toThrow('Is not empty');
  });
});
