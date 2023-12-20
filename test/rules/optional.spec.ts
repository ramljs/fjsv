import { factories, isNumber, isString } from 'valgen';

describe("optional", function () {
  it("should validate value is not nullish", function () {
    expect(factories.optional(isNumber)(0)).toStrictEqual(0);
    expect(factories.optional(isString)('')).toStrictEqual('');
    expect(factories.optional(isString)(undefined)).toStrictEqual(undefined);
    expect(factories.optional(isString)(null)).toStrictEqual(null);
  });
});


describe("optional", function () {
  it("should validate value is not nullish", function () {
    expect(factories.required(isNumber)(0)).toStrictEqual(0);
    expect(factories.required(isString)('')).toStrictEqual('');
    expect(() => factories.required(isString)(undefined)).toThrow('Value is required');
    expect(() => factories.required(isString)(null)).toThrow('Value is required');
  });
});

describe("exists", function () {
  it("should validate value is defined", function () {
    expect(factories.exists()(0)).toStrictEqual(0);
    expect(factories.exists()(null)).toStrictEqual(null);
    expect(() => factories.exists()(undefined)).toThrow('Value must exist');
    const objVal = factories.isObject({
      a: factories.exists()
    })
    expect(objVal({a: 1})).toStrictEqual({a: 1});
    expect(() => objVal({})).toThrow('`a` must exist');
  });

});
