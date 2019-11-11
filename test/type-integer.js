/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, IntegerType} = require('..');

describe('IntegerType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary({defaults: {throwOnError: true}});
    library.addDataType('integer', new IntegerType());
  });

  it('should create IntegerType instance', function() {
    let t = library.get({
      type: 'integer',
      name: 'typ1'
    });
    assert.strictEqual(t.name, 'typ1');
    assert.strictEqual(t.typeName, 'integer');
  });

  it('should set "default" attribute as integer', function() {
    const t = library.get({
      type: 'integer',
      name: 'typ1',
      default: '5.1'
    });
    assert.strictEqual(t.default, 5);
  });

  it('should throw if "default" value is not valid', function() {
    assert.throws(() =>
        library.compile({
          type: 'integer',
          name: 'typ1',
          default: 'abcd'
        }), /Schema error at typ1\.default\. "abcd" is not a valid integer value/);
  });

  it('should set "enum" attribute as string array', function() {
    const t = library.get({
      type: 'integer',
      name: 'typ1',
      enum: [1, 2, '3']
    });
    assert.deepStrictEqual(t.enum, [1, 2, 3]);
    t.enum = [1, 0];
    assert.deepStrictEqual(t.enum, [1, 0]);
    t.enum = null;
    assert.strictEqual(t.enum, null);
    t.enum = undefined;
    assert.strictEqual(t.enum, undefined);
  });

  it('should throw if "enum" value is not array', function() {
    assert.throws(() =>
        library.compile({
          type: 'integer',
          name: 'typ1',
          enum: 1
        }), /Schema error at typ1\.enum\. "1" is not an array value./);
  });

  it('should set "format" attribute', function() {
    const t = library.get({
      type: 'integer',
      name: 'typ1',
      format: 'int'
    });
    assert.strictEqual(t.format, 'int');
    t.format = 'int8';
    assert.strictEqual(t.format, 'int8');
    t.format = null;
    assert.strictEqual(t.format, null);
    t.format = undefined;
    assert.strictEqual(t.format, undefined);
  });

  it('should throw if "format" value is not valid', function() {
    assert.throws(() =>
        library.compile({
          type: 'integer',
          name: 'typ1',
          format: 'abcd'
        }), /Schema error at typ1\.format\. "abcd" is not a valid integer format identifier/);
  });

  it('should set "minimum" attribute', function() {
    const t = library.get({
      type: 'integer',
      name: 'typ1',
      minimum: 0.1
    });
    assert.strictEqual(t.minimum, 0);
  });

  it('should throw if "minimum" value is not valid', function() {
    assert.throws(() =>
        library.compile({
          type: 'integer',
          name: 'typ1',
          minimum: 'abcd'
        }), /Schema error at typ1\.minimum\. "abcd" is not a valid integer value/);
  });

  it('should set "maximum" attribute', function() {
    const t = library.get({
      type: 'integer',
      name: 'typ1',
      maximum: 10.1
    });
    assert.strictEqual(t.maximum, 10);
  });

  it('should throw if "maximum" value is not valid', function() {
    assert.throws(() =>
        library.compile({
          type: 'integer',
          name: 'typ1',
          maximum: 'abcd'
        }), /Schema error at typ1\.maximum\. "abcd" is not a valid integer value/);
  });

  it('should set "multipleOf" attribute', function() {
    const t = library.get({
      type: 'integer',
      name: 'typ1',
      multipleOf: 1.2
    });
    assert.strictEqual(t.multipleOf, 1);
  });

  it('should throw if "multipleOf" value is not valid', function() {
    assert.throws(() =>
        library.compile({
          type: 'integer',
          name: 'typ1',
          multipleOf: 'abcd'
        }), /Schema error at typ1\.multipleOf\. "abcd" is not a valid integer value/);
  });

  it('should generate validator', function() {
    const validate = library.compile('integer');
    assert.strictEqual(typeof validate, 'function');
  });

  if (global.BigInt) {
    it('should validator accept strings and numbers in non-strict mode', function() {
      const validate = library.compile('integer');
      assert.deepStrictEqual(validate(0), {valid: true, value: 0});
      assert.deepStrictEqual(validate(BigInt(123)), {
        valid: true,
        value: BigInt(123)
      });
      assert.deepStrictEqual(validate('0'), {valid: true, value: '0'});
      assert.throws(() => validate(''), /Value must be an integer or integer formatted string/);
      assert.throws(() => validate(0.5), /Value must be an integer or integer formatted string/);
      assert.throws(() => validate(false), /Value must be an integer or integer formatted string/);
      assert.throws(() => validate([]), /Value must be an integer or integer formatted string/);
      assert.throws(() => validate({}), /Value must be an integer or integer formatted string/);
    });
  }

  it('should validator accept only number value in strict mode', function() {
    const validate = library.compile('integer', {strictFormat: true});
    validate(0);
    validate(null);
    validate(123);
    assert.throws(() => validate('0'), /Value must be an integer/);
    assert.throws(() => validate(true), /Value must be an integer/);
  });

  it('should validator accept enum values if set', function() {
    const validate = library.compile({
      type: 'integer',
      enum: [1, 2, 3]
    });
    assert.deepStrictEqual(validate(1), {valid: true, value: 1});
    assert.deepStrictEqual(validate(2), {valid: true, value: 2});
    assert.throws(() => validate('4'), /Value must be a one of the enumerated values/);
    assert.throws(() => validate(4), /Value must be a one of the enumerated values/);
  });

  it('should validate minimum', function() {
    const validate = library.compile({
      type: 'integer',
      minimum: 5
    });
    validate(5);
    try {
      validate(4);
    } catch (e) {
      assert.strictEqual(e.message, 'Minimum accepted value is 5, actual 4');
      assert.strictEqual(e.min, 5);
      assert.strictEqual(e.actual, 4);
      return;
    }
    assert(0, 'Failed');
  });

  it('should validate maximum', function() {
    const validate = library.compile({
      type: 'integer',
      maximum: 5
    });
    validate(5);
    try {
      validate(6);
    } catch (e) {
      assert.strictEqual(e.message, 'Maximum accepted value is 5, actual 6');
      assert.strictEqual(e.max, 5);
      assert.strictEqual(e.actual, 6);
      return;
    }
    assert(0, 'Failed');
  });

  it('should validate multipleOf', function() {
    const validate = library.compile({
      type: 'integer',
      multipleOf: 2
    });
    validate(4);
    try {
      validate(3);
    } catch (e) {
      assert.strictEqual(e.message, 'Numeric value must be multiple of 2');
      return;
    }
    assert(0, 'Failed');
  });

  it('should coerce value to integer', function() {
    const validate = library.compile('integer', {coerceTypes: true});
    assert.deepStrictEqual(validate('0'), {valid: true, value: 0});
    assert.deepStrictEqual(validate(0), {valid: true, value: 0});
    if (global.BigInt)
      assert.deepStrictEqual(validate(BigInt(123)), {valid: true, value: 123});
  });

  it('should coerce value to default if null', function() {
    const validate = library.compile({
      type: 'integer',
      default: 1
    }, {coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: 1});
  });

});
