import { isNumber } from 'valgen';

describe('isNumber', () => {
  it('should validate value is a number', () => {
    expect(isNumber(1.1)).toStrictEqual(1.1);
    expect(isNumber(-1.4)).toStrictEqual(-1.4);
    expect(isNumber(0)).toStrictEqual(0);
    expect(() => isNumber(undefined)).toThrow(
      '"undefined" is not a valid number value',
    );
    expect(() => isNumber(null)).toThrow('"null" is not a valid number value');
    expect(() => isNumber(BigInt(5))).toThrow(
      'BigInt "5" is not a valid number value',
    );
    expect(() => isNumber('1')).toThrow(
      'String "1" is not a valid number value',
    );
    expect(() => isNumber(NaN)).toThrow('"NaN" is not a valid number value');
  });

  it('should coerce to integer', () => {
    expect(isNumber('4.5', { coerce: true })).toStrictEqual(4.5);
    expect(isNumber('-3.2', { coerce: true })).toStrictEqual(-3.2);
    expect(isNumber(BigInt(5), { coerce: true })).toStrictEqual(5);
  });
});
