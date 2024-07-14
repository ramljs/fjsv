import { isBoolean, isInteger, isNumber, isString, vg } from 'valgen';

describe('isTuple', () => {
  it('should validate value is an array', () => {
    expect(vg.isTuple([isBoolean])([true])).toStrictEqual([true]);
    expect(vg.isTuple([isInteger])([1])).toStrictEqual([1]);
    expect(() => vg.isTuple([isBoolean])(undefined)).toThrow(
      '"undefined" is not a valid tuple',
    );
    expect(() => vg.isTuple([isBoolean])(null)).toThrow(
      '"null" is not a valid tuple',
    );
    expect(() => vg.isTuple([isBoolean])(5 as any)).toThrow(
      '"5" is not a valid tuple',
    );
    expect(() => vg.isTuple([isBoolean])(NaN as any)).toThrow(
      '"NaN" is not a valid tuple',
    );
  });

  it('should validate items according to item rule', () => {
    expect(() => vg.isTuple([isInteger])(['1'])).toThrow(
      'String "1" is not a valid integer value',
    );
  });

  it('should coerce value to tuple', () => {
    expect(vg.isTuple([isString])([0], { coerce: true })).toStrictEqual(['0']);
    expect(
      vg.isTuple([isString, isNumber, isBoolean])([1, '2', 0], {
        coerce: true,
      }),
    ).toStrictEqual(['1', 2, false]);
  });
});
