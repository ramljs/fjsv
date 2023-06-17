import { exists, isNumber, isObject, isString, optional, required } from 'valgen';

describe("optional", function () {
  it("should validate value is not nullish", function () {
    expect(optional(isNumber())(0)).toStrictEqual(0);
    expect(optional(isString())('')).toStrictEqual('');
    expect(optional(isString())(undefined)).toStrictEqual(undefined);
    expect(optional(isString())(null)).toStrictEqual(null);
  });
});


describe("optional", function () {
  it("should validate value is not nullish", function () {
    expect(required(isNumber())(0)).toStrictEqual(0);
    expect(required(isString())('')).toStrictEqual('');
    expect(() => required(isString())(undefined)).toThrow('Value is required');
    expect(() => required(isString())(null)).toThrow('Value is required');
  });
});

describe("exists", function () {
  it("should validate value is defined", function () {
    expect(exists()(0)).toStrictEqual(0);
    expect(exists()(null)).toStrictEqual(null);
    expect(() => exists()(undefined)).toThrow('Value must exist');
    const objVal = isObject({
      a: exists()
    })
    expect(objVal({a: 1})).toStrictEqual({a: 1});
    expect(() => objVal({})).toThrow('`a` must exist');
  });

});
