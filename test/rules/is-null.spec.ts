import { isNull } from 'valgen';

describe("isNull", function () {

  it("should validate value is null", function () {
    expect(isNull()(null)).toStrictEqual(null);
    expect(() => isNull()(undefined)).toThrow('Value is not null');
    expect(() => isNull()('' as any)).toThrow('Value is not null');
    expect(() => isNull()(5 as any)).toThrow('Value is not null');
    expect(() => isNull()(NaN as any)).toThrow('Value is not null');
  });

  it("should coerce to null", function () {
    expect(isNull()(0, {coerce: true})).toStrictEqual(null);
    expect(isNull()(1, {coerce: true})).toStrictEqual(null);
    expect(isNull()(undefined, {coerce: true})).toStrictEqual(null);
    expect(isNull()(null, {coerce: true})).toStrictEqual(null);
  });

});
