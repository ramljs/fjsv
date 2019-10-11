/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('NumberType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary();
  });

  it('should set "default" attribute as number', function() {
    const t = library.get({
      type: 'number',
      name: 'typ1',
      default: '1.2'
    });
    assert.strictEqual(t.default, 1.2);
    t.default = '0.5';
    assert.strictEqual(t.default, 0.5);
    t.default = null;
    assert.strictEqual(t.default, null);
    t.default = undefined;
    assert.strictEqual(t.default, undefined);
  });

  it('should throw if "default" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'number',
          name: 'typ1',
          default: 'abcd'
        }), /"abcd" is not a valid number value for default attribute/);
  });

  it('should set "enum" attribute as string array', function() {
    const t = library.get({
      type: 'number',
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
          type: 'number',
          name: 'typ1',
          enum: 1
        }), /Array type required for "enum" attribute/);
  });

  it('should set "format" attribute', function() {
    const t = library.get({
      type: 'number',
      name: 'typ1',
      format: 'int'
    });
    assert.strictEqual(t.format, 'int');
    t.format = 'float';
    assert.strictEqual(t.format, 'float');
    t.format = null;
    assert.strictEqual(t.format, null);
    t.format = undefined;
    assert.strictEqual(t.format, undefined);
  });

  it('should throw if "format" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'number',
          name: 'typ1',
          format: 'abcd'
        }), /Unknown number format \(abcd\)/);
  });

  it('should set "minimum" attribute', function() {
    const t = library.get({
      type: 'number',
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
          type: 'number',
          name: 'typ1',
          minimum: 'abcd'
        }), /"abcd" is not a valid number value for minimum attribute/);
  });

  it('should set "maximum" attribute', function() {
    const t = library.get({
      type: 'number',
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
          type: 'number',
          name: 'typ1',
          maximum: 'abcd'
        }), /"abcd" is not a valid number value for maximum attribute/);
  });

  it('should set "multipleOf" attribute', function() {
    const t = library.get({
      type: 'number',
      name: 'typ1',
      multipleOf: 1.2
    });
    assert.strictEqual(t.multipleOf, 1.2);
    t.multipleOf = '1.5';
    assert.deepStrictEqual(t.multipleOf, 1.5);
    t.multipleOf = null;
    assert.strictEqual(t.multipleOf, null);
    t.multipleOf = undefined;
    assert.strictEqual(t.multipleOf, undefined);
  });

  it('should throw if "multipleOf" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'number',
          name: 'typ1',
          multipleOf: 'abcd'
        }), /"abcd" is not a valid number value for multipleOf attribute/);
  });

  it('should generate validator', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number'
    });
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept strings and numbers in non-strict mode', function() {
    const t = library.get({
      name: 'typ1',
      type: 'number'
    });
    const validate = t.validator({throwOnError: true});
    assert.deepStrictEqual(validate(0), {valid: true, value: 0});
    assert.deepStrictEqual(validate(1.1), {valid: true, value: 1.1});
    if (global.BigInt)
      assert.deepStrictEqual(validate(BigInt(123)), {
        valid: true,
        value: BigInt(123)
      });
    assert.deepStrictEqual(validate('0'), {valid: true, value: '0'});
    assert.throws(() => validate(''), /Value must be a number or number formatted string/);
    assert.throws(() => validate(false), /Value must be a number or number formatted string/);
    assert.throws(() => validate([]), /Value must be a number or number formatted string/);
    assert.throws(() => validate({}), /Value must be a number or number formatted string/);
  });

  it('should validator accept only number value in strict mode', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number'
    });
    const validate = typ1.validator({strictTypes: true, throwOnError: true});
    validate(0);
    validate(null);
    validate(123.4);
    assert.throws(() => validate('0'), /Value must be a number/);
    assert.throws(() => validate(true), /Value must be a number/);
  });

  it('should validator accept enum values if set', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      enum: [1, 2, 3]
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate(1), {valid: true, value: 1});
    assert.deepStrictEqual(validate(2), {valid: true, value: 2});
    assert.throws(() => validate('4'), /Value must be a one of the enumerated values/);
    assert.throws(() => validate(4), /Value must be a one of the enumerated values/);
  });

  it('should validate minimum', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      minimum: 5.5
    });
    const validate = typ1.validator({throwOnError: true});
    validate(5.5);
    try {
      validate(5.4);
    } catch (e) {
      assert.strictEqual(e.message, 'Minimum accepted value is 5.5, actual 5.4');
      assert.strictEqual(e.min, 5.5);
      assert.strictEqual(e.actual, 5.4);
      return;
    }
    assert(0, 'Failed');
  });

  it('should validate maximum', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      maximum: 5.5
    });
    const validate = typ1.validator({throwOnError: true});
    validate(5.5);
    try {
      validate(5.6);
    } catch (e) {
      assert.strictEqual(e.message, 'Maximum accepted value is 5.5, actual 5.6');
      assert.strictEqual(e.max, 5.5);
      assert.strictEqual(e.actual, 5.6);
      return;
    }
    assert(0, 'Failed');
  });

  it('should validate multipleOf', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      multipleOf: 0.5
    });
    const validate = typ1.validator({throwOnError: true});
    validate(1.5);
    try {
      validate(1.6);
    } catch (e) {
      assert.strictEqual(e.message, 'Numeric value must be multiple of 0.5');
      return;
    }
    assert(0, 'Failed');
  });

  it('should validate integer formats', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      format: 'int'
    });
    const validate = typ1.validator({throwOnError: true});
    validate(1123);
    try {
      validate(1.1);
    } catch (e) {
      assert.strictEqual(e.message, 'Value must be an integer or integer formatted string');
      return;
    }
    assert(0, 'Failed');
  });

  it('should coerce value to number', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number'
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(validate('0'), {valid: true, value: 0});
    assert.deepStrictEqual(validate(0), {valid: true, value: 0});
    assert.deepStrictEqual(validate(1.1), {valid: true, value: 1.1});
    if (global.BigInt)
      assert.deepStrictEqual(validate(BigInt(123)), {valid: true, value: 123});
  });

  it('should coerce value to default if null', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      default: 1
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: 1});
  });

  it('should validate int8 format', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      format: 'int8'
    });
    const validate = typ1.validator({throwOnError: true});
    validate(-128);
    validate(127);
    assert.throws(() => validate(123.4),
        /Value must be an integer/);
    assert.throws(() => validate(128),
        /Maximum accepted value is/);
    assert.throws(() => validate(-129),
        /Minimum accepted value is/);
  });

  it('should validate uint8 format', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      format: 'uint8'
    });
    const validate = typ1.validator({throwOnError: true});
    validate(0);
    validate(255);
    assert.throws(() => validate(123.4),
        /Value must be an integer/);
    assert.throws(() => validate(256),
        /Maximum accepted value is/);
    assert.throws(() => validate(-1),
        /Minimum accepted value is/);
  });

  it('should validate int16 format', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      format: 'int16'
    });
    const validate = typ1.validator({throwOnError: true});
    validate(-32768);
    validate(32767);
    assert.throws(() => validate(123.4),
        /Value must be an integer/);
    assert.throws(() => validate(32768),
        /Maximum accepted value is/);
    assert.throws(() => validate(-32769),
        /Minimum accepted value is/);
  });

  it('should validate uint16 format', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      format: 'uint16'
    });
    const validate = typ1.validator({throwOnError: true});
    validate(0);
    validate(65535);
    assert.throws(() => validate(123.4),
        /Value must be an integer/);
    assert.throws(() => validate(65536),
        /Maximum accepted value is/);
    assert.throws(() => validate(-1),
        /Minimum accepted value is/);
  });

  it('should validate int format', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      format: 'int'
    });
    const validate = typ1.validator({throwOnError: true});
    validate(-9007199254740991);
    validate(9007199254740991);
    assert.throws(() => validate(123.4),
        /Value must be an integer/);
    assert.throws(() => validate(9007199254740992),
        /Maximum accepted value is/);
    assert.throws(() => validate(-9007199254740992),
        /Minimum accepted value is/);
  });

  it('should validate int32 format', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      format: 'int32'
    });
    const validate = typ1.validator({throwOnError: true});
    validate(-2147483648);
    validate(2147483647);
    assert.throws(() => validate(123.4),
        /Value must be an integer/);
    assert.throws(() => validate(2147483648),
        /Maximum accepted value is/);
    assert.throws(() => validate(-2147483649),
        /Minimum accepted value is/);
  });

  it('should validate uint32 format', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      format: 'uint32'
    });
    const validate = typ1.validator({throwOnError: true});
    validate(0);
    validate(4294967295);
    assert.throws(() => validate(123.4),
        /Value must be an integer/);
    assert.throws(() => validate(4294967296),
        /Maximum accepted value is/);
    assert.throws(() => validate(-4294967296),
        /Minimum accepted value is/);
  });

  it('should validate uint64 format', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'number',
      format: 'uint64'
    });
    if (!global.BigInt) {
      assert.throws(() => typ1.validator(),
          /Your JavaScript version does not support BigInt values/);
      return;
    }
    const validate = typ1.validator({throwOnError: true});
    validate(0);
    assert.throws(() => validate(123.4),
        /Value must be an integer or integer formatted string/);
    assert.throws(() => validate(-1),
        /Minimum accepted value is/);
  });

});
