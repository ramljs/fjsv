import { isNull } from 'valgen';

describe("isNull", function () {

  it("should validate value is null", function () {
    expect(isNull()(null)).toStrictEqual(null);
    expect(() => isNull()(undefined)).toThrow('Value is not null');
    expect(() => isNull()('' as any)).toThrow('Value is not null');
    expect(() => isNull()(5 as any)).toThrow('Value is not null');
    expect(() => isNull()(NaN as any)).toThrow('Value is not null');
  });

});
