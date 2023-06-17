import { isNumber } from 'valgen';

describe("isNumber", function () {

  it("should validate value is a number", function () {
    expect(isNumber()(1.1)).toStrictEqual(1.1);
    expect(isNumber()(-1.4)).toStrictEqual(-1.4);
    expect(isNumber()(0)).toStrictEqual(0);
    expect(() => isNumber()(undefined)).toThrow('Value not a valid number');
    expect(() => isNumber()(null)).toThrow('Value not a valid number');
    expect(() => isNumber()(BigInt(5))).toThrow('Value not a valid number');
    expect(() => isNumber()('1')).toThrow('Value not a valid number');
    expect(() => isNumber()('1.3')).toThrow('Value not a valid number');
    expect(() => isNumber()('x5')).toThrow('Value not a valid number');
    expect(() => isNumber()(NaN)).toThrow('Value not a valid number');
  });

  it("should coerce to integer", function () {
    expect(isNumber()('4.5', {coerce: true})).toStrictEqual(4.5);
    expect(isNumber()('-3.2', {coerce: true})).toStrictEqual(-3.2);
    expect(isNumber()(BigInt(5), {coerce: true})).toStrictEqual(5);
  });
});
