import { isAny, isMatches, isRecord, isString } from 'valgen';

describe("isRecord", function () {

  it("should validate value is an object", function () {
    const validate = isRecord(isString(), isAny());
    expect(() => validate(null)).toThrow('must be an object')
    expect(() => validate(undefined)).toThrow('must be an object');
  });

  it("should validates keys according to given codec", function () {
    expect(() => isRecord(isMatches(/^[a-z]+$/), isAny())({'UpperKey': 'a'}))
        .toThrow('`@UpperKey` does not match requested format')
  });

  it("should validates values according to given codec", function () {
    expect(() => isRecord(isString(), isMatches(/^[a-z]+$/))({'id': 'UpperValue'}))
        .toThrow('`id` does not match requested format')
  });

  it("should coerce values according to given codec", function () {
    expect(isRecord(isString(), isString())({a: 1 as any, b: true as any}, {coerce: true}))
        .toEqual({'a': '1', 'b': 'true'});
  });

});
