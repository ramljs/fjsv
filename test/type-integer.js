/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, IntegerType} = require('..');

describe('IntegerType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary();
    library.register('integer', IntegerType);
  });

  it('should set "default" attribute as number', function() {
    const t = library.get({
      type: 'integer',
      name: 'typ1',
      default: '1'
    });
    assert.strictEqual(t.default, 1);
    t.default = '5.1';
    assert.strictEqual(t.default, 5);
    t.default = null;
    assert.strictEqual(t.default, null);
    t.default = undefined;
    assert.strictEqual(t.default, undefined);
  });

  it('should throw if "default" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'integer',
          name: 'typ1',
          default: 'abcd'
        }), /"abcd" is not a valid integer value for default attribute/);
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
        library.get({
          type: 'integer',
          name: 'typ1',
          enum: 1
        }), /Array type required for "enum" attribute/);
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
        library.get({
          type: 'integer',
          name: 'typ1',
          format: 'abcd'
        }), /Unknown integer format \(abcd\)/);
  });

  it('should set "minimum" attribute', function() {
    const t = library.get({
      type: 'integer',
      name: 'typ1',
      minimum: 0
    });
    assert.strictEqual(t.minimum, 0);
    t.minimum = '1';
    assert.deepStrictEqual(t.minimum, 1);
    t.minimum = null;
    assert.strictEqual(t.minimum, null);
    t.minimum = undefined;
    assert.strictEqual(t.minimum, undefined);
  });

  it('should throw if "minimum" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'integer',
          name: 'typ1',
          minimum: 'abcd'
        }), /"abcd" is not a valid number value for minimum attribute/);
  });

  it('should set "maximum" attribute', function() {
    const t = library.get({
      type: 'integer',
      name: 'typ1',
      maximum: 10
    });
    assert.strictEqual(t.maximum, 10);
    t.maximum = '1';
    assert.deepStrictEqual(t.maximum, 1);
    t.maximum = null;
    assert.strictEqual(t.maximum, null);
    t.maximum = undefined;
    assert.strictEqual(t.maximum, undefined);
  });

  it('should throw if "maximum" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'integer',
          name: 'typ1',
          maximum: 'abcd'
        }), /"abcd" is not a valid number value for maximum attribute/);
  });

  it('should set "multipleOf" attribute', function() {
    const t = library.get({
      type: 'integer',
      name: 'typ1',
      multipleOf: 1.2
    });
    assert.strictEqual(t.multipleOf, 1);
    t.multipleOf = '2';
    assert.deepStrictEqual(t.multipleOf, 2);
    t.multipleOf = null;
    assert.strictEqual(t.multipleOf, null);
    t.multipleOf = undefined;
    assert.strictEqual(t.multipleOf, undefined);
  });

  it('should throw if "multipleOf" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'integer',
          name: 'typ1',
          multipleOf: 'abcd'
        }), /"abcd" is not a valid number value for multipleOf attribute/);
  });

  it('should generate validator', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'integer'
    });
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

  if (global.BigInt) {
    it('should validator accept strings and numbers in non-strict mode', function() {
      const t = library.get({
        name: 'typ1',
        type: 'integer'
      });
      const validate = t.validator({throwOnError: true});
      assert.deepStrictEqual(validate(0), {valid: true, value: 0});
      assert.deepStrictEqual(validate(BigInt(123)), {
        valid: true,
        value: BigInt(123)
      });
      assert.deepStrictEqual(validate('0'), {valid: true, value: '0'});
      assert.throws(() => validate(''), / Value must be an integer or integer formatted string/);
      assert.throws(() => validate(0.5), / Value must be an integer or integer formatted string/);
      assert.throws(() => validate(false), /Value must be an integer or integer formatted string/);
      assert.throws(() => validate([]), /Value must be an integer or integer formatted string/);
      assert.throws(() => validate({}), /Value must be an integer or integer formatted string/);
    });
  }

  it('should validator accept only number value in strict mode', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'integer'
    });
    const validate = typ1.validator({strictTypes: true, throwOnError: true});
    validate(0);
    validate(null);
    validate(123);
    assert.throws(() => validate('0'), /Value must be an integer/);
    assert.throws(() => validate(true), /Value must be an integer/);
  });

  it('should validator accept enum values if set', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'integer',
      enum: [1, 2, 3]
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate(1), {valid: true, value: 1});
    assert.deepStrictEqual(validate(2), {valid: true, value: 2});
    assert.throws(() => validate('4'), /Value for "typ1" must be a one of enumerated value/);
    assert.throws(() => validate(4), /Value for "typ1" must be a one of enumerated value/);
  });

  it('should validate minimum', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'integer',
      minimum: 5
    });
    const validate = typ1.validator({throwOnError: true});
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
    const typ1 = library.get({
      name: 'typ1',
      type: 'integer',
      maximum: 5
    });
    const validate = typ1.validator({throwOnError: true});
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
    const typ1 = library.get({
      name: 'typ1',
      type: 'integer',
      multipleOf: 2
    });
    const validate = typ1.validator({throwOnError: true});
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
    const typ1 = library.get({
      name: 'typ1',
      type: 'integer'
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(validate('0'), {valid: true, value: 0});
    assert.deepStrictEqual(validate(0), {valid: true, value: 0});
    if (global.BigInt)
      assert.deepStrictEqual(validate(BigInt(123)), {valid: true, value: 123});
  });

  it('should coerce value to default if null', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'integer',
      default: 1
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: 1});
  });

});
