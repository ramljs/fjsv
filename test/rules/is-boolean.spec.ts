import { isBoolean } from 'valgen';

describe("isBoolean", function () {

  it("should validate value is a boolean", function () {
    expect(isBoolean()(true)).toStrictEqual(true);
    expect(isBoolean()(false)).toStrictEqual(false);
    expect(() => isBoolean()(undefined)).toThrow('Value is not a valid boolean');
    expect(() => isBoolean()(null)).toThrow('Value is not a valid boolean');
    expect(() => isBoolean()(1)).toThrow('Value is not a valid boolean');
    expect(() => isBoolean()('true')).toThrow('Value is not a valid boolean');
    expect(() => isBoolean()(NaN)).toThrow('Value is not a valid boolean');
    expect(() => isBoolean()(5 as any)).toThrow('Value is not a valid boolean');
  });

  it("should coerce to boolean", function () {
    expect(isBoolean()(true, {coerce: true})).toStrictEqual(true);
    expect(isBoolean()(false, {coerce: true})).toStrictEqual(false);
    expect(isBoolean()(1, {coerce: true})).toStrictEqual(true);
    expect(isBoolean()(0, {coerce: true})).toStrictEqual(false);
    expect(isBoolean()('1', {coerce: true})).toStrictEqual(true);
    expect(isBoolean()('0', {coerce: true})).toStrictEqual(false);
    expect(isBoolean()('t', {coerce: true})).toStrictEqual(true);
    expect(isBoolean()('f', {coerce: true})).toStrictEqual(false);
    expect(isBoolean()('y', {coerce: true})).toStrictEqual(true);
    expect(isBoolean()('n', {coerce: true})).toStrictEqual(false);
    expect(isBoolean()('yes', {coerce: true})).toStrictEqual(true);
    expect(isBoolean()('no', {coerce: true})).toStrictEqual(false);
    expect(isBoolean()('true', {coerce: true})).toStrictEqual(true);
    expect(isBoolean()('false', {coerce: true})).toStrictEqual(false);
  });


});