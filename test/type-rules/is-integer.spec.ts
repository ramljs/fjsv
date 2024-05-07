import { isInteger } from 'valgen';

describe('isInteger', function () {
  it('should validate value is an integer', function () {
    expect(isInteger(1)).toStrictEqual(1);
    expect(isInteger(-1)).toStrictEqual(-1);
    expect(isInteger(0)).toStrictEqual(0);
    expect(() => isInteger(undefined)).toThrow('"undefined" is not a valid integer value');
    expect(() => isInteger(null)).toThrow('"null" is not a valid integer value');
    expect(() => isInteger(BigInt(5))).toThrow('BigInt "5" is not a valid integer value');
    expect(() => isInteger('1')).toThrow('String "1" is not a valid integer value');
    expect(() => isInteger(NaN)).toThrow('"NaN" is not a valid integer value');
  });

  it('should coerce to integer', function () {
    expect(isInteger('4', { coerce: true })).toStrictEqual(4);
    expect(isInteger('-3', { coerce: true })).toStrictEqual(-3);
    expect(isInteger(BigInt(5), { coerce: true })).toStrictEqual(5);
  });
});
