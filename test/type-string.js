/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('StringType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary({defaults: {throwOnError: true}});
  });

  it('should create StringType instance', function() {
    let t = library.get({
      type: 'string',
      name: 'typ1',
      enum: [1, 2, '3']
    });
    assert.strictEqual(t.name, 'typ1');
    assert.strictEqual(t.typeName, 'string');
  });

  it('should set "default" attribute as string', function() {
    const t = library.get({
      type: 'string',
      name: 'typ1',
      default: 1
    });
    assert.strictEqual(t.default, '1');
  });

  it('should set "enum" attribute as string', function() {
    const t = library.get({
      type: 'string',
      name: 'typ1',
      enum: [1, 2, '3']
    });
    assert.deepStrictEqual(t.enum, ['1', '2', '3']);
  });

  it('should set "minLength" attribute', function() {
    const t = library.get({
      type: 'string',
      name: 'typ1',
      minLength: 0
    });
    assert.strictEqual(t.minLength, 0);
  });

  it('should throw if "minLength" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'string',
          name: 'typ1',
          minLength: 'abcd'
        }), /Schema error at typ1\.minLength\. "abcd" is not a valid integer value/);
  });

  it('should set "maxLength" attribute', function() {
    const t = library.get({
      type: 'string',
      name: 'typ1',
      maxLength: 0
    });
    assert.strictEqual(t.maxLength, 0);
  });

  it('should throw if "maxLength" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'string',
          name: 'typ1',
          maxLength: 'abcd'
        }), /Schema error at typ1\.maxLength\. "abcd" is not a valid integer value/);
  });

  it('should create mixin types', function() {
    let t = library.get({
      type: [{
        type: 'string',
        default: '1'
      }, {
        type: 'string',
        pattern: 'abc'
      }],
      pattern: 'abcd'
    });
    assert.strictEqual(t.default, '1');
    assert.deepStrictEqual(t.pattern, [/abcd/]);
  });

  it('should generate validator', function() {
    const validate = library.compile('string');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept strings and numbers in non-strict mode', function() {
    const t = library.get({
      name: 'typ1',
      type: 'string'
    });
    const validate = t.compile({throwOnError: true});
    assert.deepStrictEqual(validate(''), {valid: true, value: ''});
    assert.deepStrictEqual(validate(0), {valid: true, value: 0});
    assert.deepStrictEqual(validate(1.1), {valid: true, value: 1.1});
    assert.throws(() => validate(false), /Value must be a string/);
    assert.throws(() => validate([]), /Value must be a string/);
    assert.throws(() => validate({}), /Value must be a string/);
  });

  it('should validator accept only strings in strict mode', function() {
    const validate = library.compile('string', {strictFormat: true});
    validate('');
    validate(null);
    assert.throws(() => validate(0), /Value must be a string/);
    assert.throws(() => validate(1.1), /Value must be a string/);
    assert.throws(() => validate(true), /Value must be a string/);
  });

  it('should validator accept enum values if set', function() {
    const validate = library.compile({
      type: 'string',
      enum: ['a', 'b']
    });
    assert.deepStrictEqual(validate('a'), {valid: true, value: 'a'});
    assert.deepStrictEqual(validate('b'), {valid: true, value: 'b'});
    assert.throws(() => validate(''), /Value must be a one of the enumerated values/);
    assert.throws(() => validate('c'), /Value must be a one of the enumerated values/);
  });

  it('should validate min length', function() {
    const validate = library.compile({
      type: 'string',
      minLength: 5
    });
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
    const validate = library.compile({
      type: 'string',
      maxLength: 5
    });
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
    const validate = library.compile({
      type: 'string',
      pattern: ['[abcd]+', '[1234]']
    });
    validate(1234);
    validate('ab');
    assert.throws(() => validate('xyz'),
        /Value does not match required format/);
  });

  it('should coerce value to string', function() {
    const validate = library.compile('string', {coerceTypes: true});
    assert.deepStrictEqual(validate(''), {valid: true, value: ''});
    assert.deepStrictEqual(validate('0'), {valid: true, value: '0'});
    assert.deepStrictEqual(validate(0), {valid: true, value: '0'});
    assert.deepStrictEqual(validate(1.1), {valid: true, value: '1.1'});
  });

  it('should coerce value to default if null', function() {
    const validate = library.compile({
      type: 'string',
      default: 1
    }, {coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: '1'});
  });

  it('should return "errors" property on error', function() {
    const validate = library.compile({
      type: 'string',
      pattern: '\\d+'
    }, {throwOnError: false});
    assert.deepStrictEqual(validate('abc'), {
      valid: false,
      errors: [{
        errorType: 'invalid-value-format',
        message: 'Value does not match required format',
        path: ''
      }]
    });
  });

  it('should extend', function() {
    library.addSchema('Type1', {
      type: 'string',
      default: '12345'
    });
    const validate = library.compile({
      type: 'Type1'
    }, {coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: '12345'});
  });

});
