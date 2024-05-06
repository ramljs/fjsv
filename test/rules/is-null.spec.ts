import { isNull, isNullish } from 'valgen';

describe("isNull", function () {

  it("should validate value is null", function () {
    expect(isNull(null)).toStrictEqual(null);
    expect(() => isNull(undefined)).toThrow('"undefined" is not null');
    expect(() => isNull('' as any)).toThrow('"" is not null');
    expect(() => isNull(5 as any)).toThrow('"5" is not null');
    expect(() => isNull(NaN as any)).toThrow('"NaN" is not null');
  });

  it("should coerce to null", function () {
    expect(isNull(0, {coerce: true})).toStrictEqual(null);
    expect(isNull(1, {coerce: true})).toStrictEqual(null);
    expect(isNull(undefined, {coerce: true})).toStrictEqual(null);
    expect(isNull(null, {coerce: true})).toStrictEqual(null);
  });

});


describe("isNullish", function () {

  it("should validate value is null", function () {
    expect(isNullish(null)).toStrictEqual(null);
    expect(isNullish(undefined)).toStrictEqual(undefined);
    expect(() => isNullish('' as any)).toThrow('"" is not nullish');
    expect(() => isNullish(5 as any)).toThrow('"5" is not nullish');
    expect(() => isNullish(NaN as any)).toThrow('"NaN" is not nullish');
  });

  it("should coerce to nullish", function () {
    expect(isNullish(undefined, {coerce: true})).toStrictEqual(undefined);
    expect(isNullish(0, {coerce: true})).toStrictEqual(null);
    expect(isNullish(1, {coerce: true})).toStrictEqual(null);
    expect(isNullish(null, {coerce: true})).toStrictEqual(null);
  });

});
