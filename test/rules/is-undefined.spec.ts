import { isUndefined } from 'valgen';

describe("isUndefined", function () {
  it("should validate value is undefined", function () {
    expect(isUndefined()(undefined)).toStrictEqual(undefined);
    expect(() => isUndefined()('' as any)).toThrow('Value defined');
    expect(() => isUndefined()(5 as any)).toThrow('Value defined');
    expect(() => isUndefined()(null as any)).toThrow('Value defined');
    expect(() => isUndefined()(NaN as any)).toThrow('Value defined');
  });

});
