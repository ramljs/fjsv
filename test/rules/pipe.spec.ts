import {
  allOf, isBoolean, isGt, isLt, isMatches, isNumber,
  isString, pipe
} from 'valgen';

describe("pipe", function () {

  it("should pipe validations", function () {
    expect(pipe(isString(), isMatches(/^[a-z]+$/),)('abc')).toStrictEqual('abc');
    expect(() =>
        pipe(isString(), isMatches(/^[a-z]+$/),)('123')
    ).toThrow('Value does not match requested format');
    expect(pipe(isString(), isNumber(), isBoolean())(1 as any, {coerce: true})).toStrictEqual(true);
    expect(pipe(isString(), isNumber(), isString())(1 as any, {coerce: true})).toStrictEqual('1');
  });

})


describe("allOf", function () {
  it("should check all validation rules passes", function () {
    const codec = allOf(isNumber(), isGt(5), isLt(10));
    expect(() => codec(6)).not.toThrow();
    expect(() => codec('x')).toThrow('Value not a valid number');
    expect(() => codec(5)).toThrow('must be greater than');
    expect(() => codec(10)).toThrow('must be lover than');
  });
});


