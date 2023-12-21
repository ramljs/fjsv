import { isBoolean, isInteger, isNumber, isString, vg } from 'valgen';

describe("isTuple", function () {

  it("should validate value is an array", function () {
    expect(vg.isTuple([isBoolean])([true])).toStrictEqual([true]);
    expect(vg.isTuple([isInteger])([1])).toStrictEqual([1]);
    expect(() => vg.isTuple([isBoolean])(undefined)).toThrow('Value must be a tuple');
    expect(() => vg.isTuple([isBoolean])(null)).toThrow('Value must be a tuple');
    expect(() => vg.isTuple([isBoolean])(5 as any)).toThrow('Value must be a tuple');
    expect(() => vg.isTuple([isBoolean])(NaN as any)).toThrow('Value must be a tuple');
  });

  it("should validate items according to item rule", function () {
    expect(() => vg.isTuple([isInteger])(['1'])).toThrow('Value at [0] must be an integer number');
  });

  it("should coerce value to tuple", function () {
    expect(vg.isTuple([isString])([0], {coerce: true})).toStrictEqual(['0']);
    expect(vg.isTuple([isString, isNumber, isBoolean])([1, '2', 0], {coerce: true}))
        .toStrictEqual(['1', 2, false]);
  });

});
