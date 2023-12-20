import { isNotEmpty } from 'valgen';

describe("isNotEmpty", function () {

  it("should validate value is an empty string", function () {
    expect(isNotEmpty('abc')).toStrictEqual('abc');
    expect(() => isNotEmpty('')).toThrow('Value mustn\'t be');
  });

  it("should validate value is an empty array", function () {
    expect(isNotEmpty([0])).toStrictEqual([0]);
    expect(() => isNotEmpty([])).toThrow('Value mustn\'t be');
  });

  it("should validate value is an empty Object", function () {
    expect(isNotEmpty({a: 1})).toStrictEqual({a: 1});
    expect(() => isNotEmpty({})).toThrow('Value mustn\'t be');
  });

  it("should validate value is an empty Set", function () {
    expect(isNotEmpty(new Set([0]))).toBeInstanceOf(Set);
    expect(() => isNotEmpty(new Set())).toThrow('Value mustn\'t be');
  });

  it("should validate value is an empty Map", function () {
    expect(isNotEmpty(new Map([['a', 0]]))).toBeInstanceOf(Map);
    expect(() => isNotEmpty(new Map())).toThrow('Value mustn\'t be');
  });

  it("should throw if unknown type passed", function () {
    expect(() => isNotEmpty(NaN as any)).toThrow('Value mustn\'t be');
  });

});
