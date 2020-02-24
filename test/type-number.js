/* eslint-disable */
const assert = require('assert');
const {Valgen} = require('..');

describe('NumberFactory', function() {

  let library;
  beforeEach(function() {
    library = new Valgen({throwOnError: true});
  });

  it('should create NumberFactory instance', function() {
    let t = library.getType({
      type: 'number',
      other: 123
    });
    assert.strictEqual(t.typeName, 'number');
    assert.strictEqual(t.get('other'), undefined);
  });

  it('should set "default" attribute as number', function() {
    const t = library.getType({
      type: 'number',
      name: 'typ1',
      default: '1.2'
    });
    assert.strictEqual(t.get('default'), 1.2);
  });

  it('should throw if "default" value is not valid', function() {
    assert.throws(() =>
        library.getType({
          type: 'number',
          name: 'typ1',
          default: 'abcd'
        }), /"abcd" is not a valid number value/);
  });

  it('should set "enum" attribute as string array', function() {
    const t = library.getType({
      type: 'number',
      enum: [1, 2, '3']
    });
    assert.deepStrictEqual(t.get('enum'), [1, 2, 3]);
  });

  it('should throw if "enum" value is not an array', function() {
    assert.throws(() =>
        library.getType({
          type: 'number',
          enum: 'abcd'
        }), /"abcd" is not an array value/);
  });

  it('should set "format" attribute', function() {
    const t = library.getType({
      type: 'number',
      format: 'int'
    });
    assert.strictEqual(t.get('format'), 'int');
  });

  it('should throw if "format" value is not valid', function() {
    assert.throws(() =>
        library.getType({
          type: 'number',
          format: 'abcd'
        }), /"abcd" is not a valid number format identifier/);
  });

  it('should set "format" attribute', function() {
    const t = library.getType({
      type: 'number',
      strictFormat: 1
    });
    assert.strictEqual(t.get('strictFormat'), true);
  });

  it('should set "minimum" attribute', function() {
    const t = library.getType({
      type: 'number',
      minimum: '0'
    });
    assert.strictEqual(t.get('minimum'), 0);
  });

  it('should throw if "minimum" value is not valid', function() {
    assert.throws(() =>
        library.getType({
          type: 'number',
          minimum: 'abcd'
        }), /"abcd" is not a valid number value/);
  });

  it('should set "maximum" attribute', function() {
    const t = library.getType({
      type: 'number',
      maximum: '10.5'
    });
    assert.strictEqual(t.get('maximum'), 10.5);
  });

  it('should throw if "maximum" value is not valid', function() {
    assert.throws(() =>
        library.getType({
          type: 'number',
          maximum: 'abcd'
        }), /"abcd" is not a valid number value/);
  });

  it('should set "multipleOf" attribute', function() {
    const t = library.getType({
      type: 'number',
      multipleOf: '1.2'
    });
    assert.strictEqual(t.get('multipleOf'), 1.2);
  });

  it('should throw if "multipleOf" value is not valid', function() {
    assert.throws(() =>
        library.getType({
          type: 'number',
          multipleOf: 'abcd'
        }), /"abcd" is not a valid number value/);
  });

  it('should generate validator', function() {
    const validate = library.generate('number');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept strings and numbers in non-strict mode', function() {
    const validate = library.generate('number');
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
    const validate = library.generate('number', {strictFormat: true});
    validate(0);
    validate(null);
    validate(123.4);
    assert.throws(() => validate('0'), /Value must be a number/);
    assert.throws(() => validate(true), /Value must be a number/);
  });

  it('should validator accept enum values if set', function() {
    const validate = library.generate({
      type: 'number',
      enum: [1, 2, 3]
    });
    assert.deepStrictEqual(validate(1), {valid: true, value: 1});
    assert.deepStrictEqual(validate(2), {valid: true, value: 2});
    assert.throws(() => validate('4'), /Value must be a one of the enumerated values/);
    assert.throws(() => validate(4), /Value must be a one of the enumerated values/);
  });

  it('should validate minimum', function() {
    const validate = library.generate({
      type: 'number',
      minimum: 5.5
    });
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
    const validate = library.generate({
      type: 'number',
      maximum: 5.5
    });
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
    const validate = library.generate({
      type: 'number',
      multipleOf: 0.5
    });
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
    const validate = library.generate({
      type: 'number',
      format: 'int'
    });
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
    const validate = library.generate('number', {coerceTypes: true});
    assert.deepStrictEqual(validate('0'), {valid: true, value: 0});
    assert.deepStrictEqual(validate(0), {valid: true, value: 0});
    assert.deepStrictEqual(validate(1.1), {valid: true, value: 1.1});
    if (global.BigInt)
      assert.deepStrictEqual(validate(BigInt(123)), {valid: true, value: 123});
  });

  it('should coerce value to default if null', function() {
    const validate = library.generate({
      type: 'number',
      default: 1
    }, {coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: 1});
  });

  it('should validate int8 format', function() {
    const validate = library.generate({
      type: 'number',
      format: 'int8'
    });
    validate(-128);
    validate(127);
    assert.throws(() => validate(123.4),
        /Value must be an integer/);
    assert.throws(() =>
            validate(128),
        /Maximum accepted value is/);
    assert.throws(() => validate(-129),
        /Minimum accepted value is/);
  });

  it('should validate uint8 format', function() {
    const validate = library.generate({
      type: 'number',
      format: 'uint8'
    });
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
    const validate = library.generate({
      type: 'number',
      format: 'int16'
    });
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
    const validate = library.generate({
      type: 'number',
      format: 'uint16'
    });
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
    const validate = library.generate({
      type: 'number',
      format: 'int'
    });
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
    const validate = library.generate({
      type: 'number',
      format: 'int32'
    });
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
    const validate = library.generate({
      type: 'number',
      format: 'uint32'
    });
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
    if (!global.BigInt) {
      assert.throws(() => library.generate({
            type: 'number',
            format: 'uint64'
          }),
          /Your JavaScript version does not support BigInt values/);
      return;
    }
    const validate = library.generate({
      type: 'number',
      format: 'uint64'
    });
    validate(0);
    assert.throws(() => validate(123.4),
        /Value must be an integer or integer formatted string/);
    assert.throws(() => validate(-1),
        /Minimum accepted value is/);
  });

});
