import { factories, isBoolean, isInteger, isNumber, isString } from 'valgen';

describe("isTuple", function () {

  it("should validate value is an array", function () {
    expect(factories.isTuple([isBoolean])([true])).toStrictEqual([true]);
    expect(factories.isTuple([isInteger])([1])).toStrictEqual([1]);
    expect(() => factories.isTuple([isBoolean])(undefined)).toThrow('Value must be a tuple');
    expect(() => factories.isTuple([isBoolean])(null)).toThrow('Value must be a tuple');
    expect(() => factories.isTuple([isBoolean])(5 as any)).toThrow('Value must be a tuple');
    expect(() => factories.isTuple([isBoolean])(NaN as any)).toThrow('Value must be a tuple');
  });

  it("should validate items according to item rule", function () {
    expect(() => factories.isTuple([isInteger])(['1'])).toThrow('Value at [0] must be an integer number');
  });

  it("should coerce value to tuple", function () {
    expect(factories.isTuple([isString])([0], {coerce: true})).toStrictEqual(['0']);
    expect(factories.isTuple([isString, isNumber, isBoolean])([1, '2', 0], {coerce: true}))
        .toStrictEqual(['1', 2, false]);
  });

});
