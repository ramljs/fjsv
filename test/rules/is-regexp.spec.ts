import { factories } from 'valgen';

describe("isRegExp", function () {
  it("should return undefined if nullish", function () {
    expect(factories.isRegExp('\\d+')(null)).toStrictEqual(undefined);
    expect(factories.isRegExp('\\d+')(undefined)).toStrictEqual(undefined);
  });

  it("should validate value matches given pattern", function () {
    expect(factories.isRegExp('\\d+')('0123')).toStrictEqual('0123');
    expect(factories.isRegExp(/\d+/)('0123')).toStrictEqual('0123');
    expect(() => factories.isRegExp(/\d+/)('abc')).toThrow('does not match requested format');
    expect(() => factories.isRegExp(/\d+/, {formatName: 'positive number'})('abc'))
        .toThrow('does not match positive number format');
  });

});
