/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('StringType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary();
  });

  it('should set "default" attribute as string', function() {
    const t = library.get({
      type: 'string',
      name: 'typ1',
      default: 1
    });
    assert.strictEqual(t.default, '1');
    t.default = null;
    assert.strictEqual(t.default, null);
    t.default = undefined;
    assert.strictEqual(t.default, undefined);
  });

  it('should set "enum" attribute as string array', function() {
    const t = library.get({
      type: 'string',
      name: 'typ1',
      enum: [1, 2, '3']
    });
    assert.deepStrictEqual(t.enum, ['1', '2', '3']);
    t.enum = [null, 'a', 'b'];
    assert.deepStrictEqual(t.enum, ['null', 'a', 'b']);
    t.enum = null;
    assert.strictEqual(t.enum, null);
    t.enum = undefined;
    assert.strictEqual(t.enum, undefined);
  });

  it('should throw if "enum" value is not array', function() {
    assert.throws(() =>
        library.get({
          type: 'string',
          name: 'typ1',
          enum: 1
        }), /Array type required for "enum" attribute/);
  });

  it('should set "pattern" attribute as string array', function() {
    const t = library.get({
      type: 'string',
      name: 'typ1',
      pattern: '\\d+'
    });
    assert.deepStrictEqual(t.pattern, ['\\d+']);
    t.pattern = ['a', 'b'];
    assert.deepStrictEqual(t.pattern, ['a', 'b']);
    t.pattern = null;
    assert.strictEqual(t.pattern, null);
    t.pattern = undefined;
    assert.strictEqual(t.pattern, undefined);
  });

  it('should set "minLength" attribute', function() {
    const t = library.get({
      type: 'string',
      name: 'typ1',
      minLength: 0
    });
    assert.strictEqual(t.minLength, 0);
    t.minLength = '1';
    assert.deepStrictEqual(t.minLength, 1);
    t.minLength = null;
    assert.strictEqual(t.minLength, null);
    t.minLength = undefined;
    assert.strictEqual(t.minLength, undefined);
  });

  it('should throw if "minLength" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'string',
          name: 'typ1',
          minLength: 'abcd'
        }), /"abcd" is not a valid number value for minLength attribute/);
  });

  it('should set "maxLength" attribute', function() {
    const t = library.get({
      type: 'string',
      name: 'typ1',
      maxLength: 0
    });
    assert.strictEqual(t.maxLength, 0);
    t.maxLength = '1';
    assert.deepStrictEqual(t.maxLength, 1);
    t.maxLength = null;
    assert.strictEqual(t.maxLength, null);
    t.maxLength = undefined;
    assert.strictEqual(t.maxLength, undefined);
  });

  it('should throw if "maxLength" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'string',
          name: 'typ1',
          maxLength: 'abcd'
        }), /"abcd" is not a valid number value for maxLength attribute/);
  });

  it('should generate validator', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'string'
    });
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept strings and numbers in non-strict mode', function() {
    const t = library.get({
      name: 'typ1',
      type: 'string'
    });
    const validate = t.validator({throwOnError: true});
    assert.deepStrictEqual(validate(''), {valid: true, value: ''});
    assert.deepStrictEqual(validate(0), {valid: true, value: 0});
    assert.deepStrictEqual(validate(1.1), {valid: true, value: 1.1});
    assert.throws(() => validate(false), /Value must be a string/);
    assert.throws(() => validate([]), /Value must be a string/);
    assert.throws(() => validate({}), /Value must be a string/);
  });

  it('should validator accept only strings in strict mode', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'string'
    });
    const validate = typ1.validator({strictTypes: true, throwOnError: true});
    validate('');
    validate(null);
    assert.throws(() => validate(0), /Value must be a string/);
    assert.throws(() => validate(1.1), /Value must be a string/);
    assert.throws(() => validate(true), /Value must be a string/);
  });

  it('should validator accept enum values if set', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'string',
      enum: ['a', 'b']
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate('a'), {valid: true, value: 'a'});
    assert.deepStrictEqual(validate('b'), {valid: true, value: 'b'});
    assert.throws(() => validate(''), /Value for "typ1" must be a one of enumerated value/);
    assert.throws(() => validate('c'), /Value for "typ1" must be a one of enumerated value/);
  });

  it('should validate min length', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'string',
      minLength: 5
    });
    const validate = typ1.validator({throwOnError: true});
    validate('12345');
    try {
      validate('1234');
    } catch (e) {
      assert.strictEqual(e.message, 'Minimum accepted length is 5, actual 4');
      assert.strictEqual(e.min, 5);
      assert.strictEqual(e.actual, 4);
      return;
    }
    assert(0, 'Failed');
  });

  it('should validate max length', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'string',
      maxLength: 5
    });
    const validate = typ1.validator({throwOnError: true});
    validate('1234');
    try {
      validate('123456');
    } catch (e) {
      assert.strictEqual(e.message, 'Maximum accepted length is 5, actual 6');
      assert.strictEqual(e.max, 5);
      assert.strictEqual(e.actual, 6);
      return;
    }
    assert(0, 'Failed');
  });

  it('should validate patterns', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'string',
      pattern: ['[abcd]+', '[1234]']
    });
    const validate = typ1.validator({throwOnError: true});
    validate(1234);
    validate('ab');
    assert.throws(() => validate('xyz'),
        /Value does not match required format/);
  });

  it('should coerce value to string', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'string'
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(validate(''), {valid: true, value: ''});
    assert.deepStrictEqual(validate('0'), {valid: true, value: '0'});
    assert.deepStrictEqual(validate(0), {valid: true, value: '0'});
    assert.deepStrictEqual(validate(1.1), {valid: true, value: '1.1'});
  });

  it('should coerce value to default if null', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'string',
      default: 1
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: '1'});
  });

});
