import { isNumber, isString, vg } from 'valgen';

describe("optional", function () {
  it("should validate value is not nullish", function () {
    expect(vg.optional(isNumber)(0)).toStrictEqual(0);
    expect(vg.optional(isString)('')).toStrictEqual('');
    expect(vg.optional(isString)(undefined)).toStrictEqual(undefined);
    expect(vg.optional(isString)(null)).toStrictEqual(null);
  });
});


describe("optional", function () {
  it("should validate value is not nullish", function () {
    expect(vg.required(isNumber)(0)).toStrictEqual(0);
    expect(vg.required(isString)('')).toStrictEqual('');
    expect(() => vg.required(isString)(undefined)).toThrow('Value is required');
    expect(() => vg.required(isString)(null)).toThrow('Value is required');
  });
});

describe("exists", function () {
  it("should validate value is defined", function () {
    expect(vg.exists()(0)).toStrictEqual(0);
    expect(vg.exists()(null)).toStrictEqual(null);
    expect(() => vg.exists()(undefined)).toThrow('Value must exist');
    const objVal = vg.isObject({
      a: vg.exists()
    })
    expect(objVal({a: 1})).toStrictEqual({a: 1});
    expect(() => objVal({})).toThrow('`a` must exist');
  });

});
