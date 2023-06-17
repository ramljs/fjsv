import { isMatches } from 'valgen';

describe("isMatches", function () {
  it("should return undefined if nullish", function () {
    expect(isMatches('\\d+')(null)).toStrictEqual(undefined);
    expect(isMatches('\\d+')(undefined)).toStrictEqual(undefined);
  });

  it("should validate value matches given pattern", function () {
    expect(isMatches('\\d+')('0123')).toStrictEqual('0123');
    expect(isMatches(/\d+/)('0123')).toStrictEqual('0123');
    expect(() => isMatches(/\d+/)('abc')).toThrow('does not match requested format');
    expect(() => isMatches(/\d+/, {formatName: 'positive number'})('abc'))
        .toThrow('does not match positive number format');
  });

});
