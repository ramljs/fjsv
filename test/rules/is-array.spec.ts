import { isArray, isBoolean, isInteger, isString, vg } from 'valgen';

describe("isArray", function () {

  it("should validate value is an array", function () {
    expect(isArray([true])).toStrictEqual([true]);
    expect(isArray([1])).toStrictEqual([1]);
    expect(() => isArray(undefined)).toThrow('must be an array');
    expect(() => isArray(null)).toThrow('must be an array');
    expect(() => isArray(5 as any)).toThrow('must be an array');
    expect(() => isArray(NaN as any)).toThrow('must be an array');
  });

  it("should validate items according to item rule", function () {
    expect(vg.isArray(isInteger)([1, 2])).toStrictEqual([1, 2]);
    expect(() => vg.isArray(isInteger)(['1', '2']))
        .toThrow('`<Array>[0]` must be an integer number');
  })

  it("should coerce value to array", function () {
    // expect(isArray()('x', {coerce: true})).toStrictEqual(['x']);
    expect(vg.isArray(isBoolean)([1], {coerce: true})).toStrictEqual([true]);
    expect(vg.isArray(isString)([false, '1'], {coerce: true})).toStrictEqual(['false', '1']);
  });

});
