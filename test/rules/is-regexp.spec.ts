import { vg } from 'valgen';

describe("isRegExp", function () {
  it("should return undefined if nullish", function () {
    expect(vg.isRegExp('\\d+')(null)).toStrictEqual(undefined);
    expect(vg.isRegExp('\\d+')(undefined)).toStrictEqual(undefined);
  });

  it("should validate value matches given pattern", function () {
    expect(vg.isRegExp('\\d+')('0123')).toStrictEqual('0123');
    expect(vg.isRegExp(/\d+/)('0123')).toStrictEqual('0123');
    expect(() => vg.isRegExp(/\d+/)('abc')).toThrow('does not match requested format');
    expect(() => vg.isRegExp(/\d+/, {formatName: 'positive number'})('abc'))
        .toThrow('does not match positive number format');
  });

});
