import { isInteger } from 'valgen';

describe("isInteger", function () {

  it("should validate value is an integer", function () {
    expect(isInteger(1)).toStrictEqual(1);
    expect(isInteger(-1)).toStrictEqual(-1);
    expect(isInteger(0)).toStrictEqual(0);
    expect(() => isInteger(undefined)).toThrow('Value must be an integer number');
    expect(() => isInteger(null)).toThrow('Value must be an integer number');
    expect(() => isInteger(BigInt(5))).toThrow('Value must be an integer number');
    expect(() => isInteger('1')).toThrow('Value must be an integer number');
    expect(() => isInteger('1.3')).toThrow('Value must be an integer number');
    expect(() => isInteger('x5')).toThrow('Value must be an integer number');
    expect(() => isInteger(NaN)).toThrow('Value must be an integer number');
  });

  it("should coerce to integer", function () {
    expect(isInteger('4', {coerce: true})).toStrictEqual(4);
    expect(isInteger('-3', {coerce: true})).toStrictEqual(-3);
    expect(isInteger(BigInt(5), {coerce: true})).toStrictEqual(5);
  });

});
