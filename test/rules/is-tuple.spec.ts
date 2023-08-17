import { isBoolean, isInteger, isNumber, isString, isTuple } from 'valgen';

describe("isTuple", function () {

  it("should validate value is an array", function () {
    expect(isTuple([isBoolean()])([true])).toStrictEqual([true]);
    expect(isTuple([isInteger()])([1])).toStrictEqual([1]);
    expect(() => isTuple([isBoolean()])(undefined)).toThrow('Value is not a tuple');
    expect(() => isTuple([isBoolean()])(null)).toThrow('Value is not a tuple');
    expect(() => isTuple([isBoolean()])(5 as any)).toThrow('Value is not a tuple');
    expect(() => isTuple([isBoolean()])(NaN as any)).toThrow('Value is not a tuple');
  });

  it("should validate items according to item rule", function () {
    expect(() => isTuple([isInteger()])(['1'])).toThrow('Value at [0] is not a valid integer number');
  });

  it("should coerce value to tuple", function () {
    expect(isTuple([isString()])([0], {coerce: true})).toStrictEqual(['0']);
    expect(isTuple([isString(), isNumber(), isBoolean()])([1, '2', 0], {coerce: true}))
        .toStrictEqual(['1', 2, false]);
  });

});
