import { isArray, isBoolean, isInteger, isString, vg } from 'valgen';

describe('isArray', () => {
  it('should validate value is an array', () => {
    expect(isArray([true])).toStrictEqual([true]);
    expect(isArray([1])).toStrictEqual([1]);
    expect(() => isArray(undefined)).toThrow(
      '"undefined" is not an array value',
    );
    expect(() => isArray(null)).toThrow('"null" is not an array value');
    expect(() => isArray(5 as any)).toThrow('"5" is not an array value');
    expect(() => isArray(NaN as any)).toThrow('"NaN" is not an array value');
  });

  it('should validate items according to item rule', () => {
    expect(vg.isArray(isInteger)([1, 2])).toStrictEqual([1, 2]);
    expect(() => vg.isArray(isInteger)(['1', '2'])).toThrow(
      'String "1" is not a valid integer value',
    );
  });

  it('should coerce value to array', () => {
    // expect(isArray()('x', {coerce: true})).toStrictEqual(['x']);
    expect(vg.isArray(isBoolean)([1], { coerce: true })).toStrictEqual([true]);
    expect(vg.isArray(isString)([false, '1'], { coerce: true })).toStrictEqual([
      'false',
      '1',
    ]);
  });
});
