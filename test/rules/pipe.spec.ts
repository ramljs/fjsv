import {
  factories, isBoolean, isNumber, isString,
} from 'valgen';

describe("pipe", function () {

  it("should pipe validations", function () {
    expect(factories.pipe(isString, factories.isRegExp(/^[a-z]+$/),)('abc')).toStrictEqual('abc');
    expect(() =>
        factories.pipe(isString, factories.isRegExp(/^[a-z]+$/),)('123')
    ).toThrow('Value does not match requested format');
    expect(factories.pipe(isString, isNumber, isBoolean)(1 as any, {coerce: true})).toStrictEqual(true);
    expect(factories.pipe(isString, isNumber, isString)(1 as any, {coerce: true})).toStrictEqual('1');
  });

})


describe("allOf", function () {
  it("should check all validation rules passes", function () {
    const codec = factories.allOf(isNumber, factories.isGt(5), factories.isLt(10));
    expect(() => codec(6)).not.toThrow();
    expect(() => codec('x')).toThrow('Value must be a number');
    expect(() => codec(5)).toThrow('must be greater than');
    expect(() => codec(10)).toThrow('must be lover than');
  });
});


