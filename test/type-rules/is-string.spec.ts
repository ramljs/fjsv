import { isString, vg } from 'valgen';

/*
 *
 */
describe('isString', () => {
  it('should validate value is a string', () => {
    expect(isString('1')).toStrictEqual('1');
    expect(isString('')).toStrictEqual('');
    expect(() => isString(undefined)).toThrow('"undefined" is not a string');
    expect(() => isString(null)).toThrow('"null" is not a string');
    expect(() => isString(1)).toThrow('"1" is not a string');
    expect(() => isString(true)).toThrow('"true" is not a string');
    expect(() => isString(NaN)).toThrow('"NaN" is not a string');
  });

  it('should coerce to string', () => {
    expect(isString(1, { coerce: true })).toStrictEqual('1');
    expect(isString(0, { coerce: true })).toStrictEqual('0');
    expect(isString('1', { coerce: true })).toStrictEqual('1');
    expect(isString('0', { coerce: true })).toStrictEqual('0');
    expect(isString({ toJSON: () => 'test' }, { coerce: true })).toStrictEqual(
      'test',
    );
    expect(isString({ x: 1 }, { coerce: true })).toStrictEqual('{"x":1}');
  });
});

/*
 *
 */
describe('stringReplace', () => {
  it('should process String.replace', () => {
    expect(vg.stringReplace(/-/g, '_')('a-b')).toStrictEqual('a_b');
    expect(vg.stringReplace('-', '_')('a-b')).toStrictEqual('a_b');
  });
});

/*
 *
 */
describe('stringTrim', () => {
  it('should trim string value', () => {
    expect(vg.trim()(' a ')).toStrictEqual('a');
    expect(vg.trim()(' a')).toStrictEqual('a');
    expect(vg.trim()('a ')).toStrictEqual('a');
  });
});

/*
 *
 */
describe('stringTrim', () => {
  it('should trim string value', () => {
    expect(vg.trimStart()(' a ')).toStrictEqual('a ');
    expect(vg.trimStart()(' a')).toStrictEqual('a');
  });
});

/*
 *
 */
describe('stringTrim', () => {
  it('should trim string value', () => {
    expect(vg.trimEnd()(' a ')).toStrictEqual(' a');
    expect(vg.trimEnd()('a ')).toStrictEqual('a');
  });
});

/*
 *
 */
describe('stringSplit', () => {
  it('should process String.replace', () => {
    expect(vg.stringSplit(',')('a,b')).toStrictEqual(['a', 'b']);
  });
});
