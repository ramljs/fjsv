import { isDefined } from 'valgen';

describe("isDefined", function () {
  it("should validate value is defined", function () {
    expect(isDefined(0)).toStrictEqual(0);
    expect(isDefined(null)).toStrictEqual(null);
    expect(isDefined('')).toStrictEqual('');
    expect(() => isDefined(undefined)).toThrow('Is not defined');
  });

});
