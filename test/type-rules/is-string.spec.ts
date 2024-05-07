import { isString, vg } from 'valgen';

/*
 *
 */
describe('isString', function () {
  it('should validate value is a string', function () {
    expect(isString('1')).toStrictEqual('1');
    expect(isString('')).toStrictEqual('');
    expect(() => isString(undefined)).toThrow('Value must be a string');
    expect(() => isString(null)).toThrow('Value must be a string');
    expect(() => isString(1)).toThrow('Value must be a string');
    expect(() => isString(true)).toThrow('Value must be a string');
    expect(() => isString(NaN)).toThrow('Value must be a string');
  });

  it('should coerce to string', function () {
    expect(isString(1, { coerce: true })).toStrictEqual('1');
    expect(isString(0, { coerce: true })).toStrictEqual('0');
    expect(isString('1', { coerce: true })).toStrictEqual('1');
    expect(isString('0', { coerce: true })).toStrictEqual('0');
    expect(isString({ toJSON: () => 'test' }, { coerce: true })).toStrictEqual('test');
    expect(isString({ x: 1 }, { coerce: true })).toStrictEqual('{"x":1}');
  });
});

/*
 *
 */
describe('stringReplace', function () {
  it('should process String.replace', function () {
    expect(vg.stringReplace(/-/g, '_')('a-b')).toStrictEqual('a_b');
    expect(vg.stringReplace('-', '_')('a-b')).toStrictEqual('a_b');
  });
});

/*
 *
 */
describe('stringTrim', function () {
  it('should trim string value', function () {
    expect(vg.trim()(' a ')).toStrictEqual('a');
    expect(vg.trim()(' a')).toStrictEqual('a');
    expect(vg.trim()('a ')).toStrictEqual('a');
  });
});

/*
 *
 */
describe('stringTrim', function () {
  it('should trim string value', function () {
    expect(vg.trimStart()(' a ')).toStrictEqual('a ');
    expect(vg.trimStart()(' a')).toStrictEqual('a');
  });
});

/*
 *
 */
describe('stringTrim', function () {
  it('should trim string value', function () {
    expect(vg.trimEnd()(' a ')).toStrictEqual(' a');
    expect(vg.trimEnd()('a ')).toStrictEqual('a');
  });
});

/*
 *
 */
describe('stringSplit', function () {
  it('should process String.replace', function () {
    expect(vg.stringSplit(',')('a,b')).toStrictEqual(['a', 'b']);
  });
});
