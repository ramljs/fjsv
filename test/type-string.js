const assert = require('assert');
const {Valgen} = require('..');

describe('StringFactory', function() {

  let library;
  beforeEach(function() {
    library = new Valgen({throwOnError: true});
  });

  it('should create StringFactory instance', function() {
    let t = library.getType({
      type: 'string'
    });
    assert.strictEqual(t.typeName, 'string');
  });

  it('should set "default" attribute as string', function() {
    const t = library.getType({
      type: 'string',
      default: 1,
      enum: undefined
    });
    assert.strictEqual(t.get('default'), '1');
  });

  it('should set "enum" attribute as string', function() {
    const t = library.getType({
      type: 'string',
      enum: [1, 2, '3']
    });
    assert.deepStrictEqual(t.get('enum'), ['1', '2', '3']);
  });

  it('should throw if "enum" value is not an array', function() {
    assert.throws(() =>
        library.getType({
          type: 'string',
          enum: 'abcd'
        }), /"abcd" is not an array value/);
  });

  it('should set "minLength" attribute', function() {
    const t = library.getType({
      type: 'string',
      minLength: 0
    });
    assert.strictEqual(t.get('minLength'), 0);
  });

  it('should throw if "minLength" value is not valid', function() {
    assert.throws(() =>
        library.getType({
          type: 'string',
          minLength: 'abcd'
        }), /"abcd" is not a valid integer value/);
  });

  it('should set "maxLength" attribute', function() {
    const t = library.getType({
      type: 'string',
      maxLength: 0
    });
    assert.strictEqual(t.get('maxLength'), 0);
  });

  it('should throw if "maxLength" value is not valid', function() {
    assert.throws(() =>
        library.getType({
          type: 'string',
          maxLength: 'abcd'
        }), /"abcd" is not a valid integer value/);
  });

  it('should create mixin types', function() {
    let t = library.getType({
      type: [{
        type: 'string',
        default: '1'
      }, {
        type: 'string',
        pattern: 'abc',
        maxLength: 10
      }],
      pattern: 'abcd'
    });
    assert.strictEqual(t.get('default'), '1');
    assert.strictEqual(t.get('maxLength'), 10);
    assert.deepStrictEqual(t.get('pattern'), 'abcd');
  });

  it('should generate validator', function() {
    const validate = library.generate('string');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept strings and numbers in non-strict mode', function() {
    const t = library.getType({type: 'string'});
    const validate = t.generate({throwOnError: true});
    assert.deepStrictEqual(validate(''), {valid: true, value: ''});
    assert.deepStrictEqual(validate(0), {valid: true, value: 0});
    assert.deepStrictEqual(validate(1.1), {valid: true, value: 1.1});
    assert.deepStrictEqual(validate(false), {valid: true, value: false});
    assert.throws(() => validate([]), /Value must be a string/);
    assert.throws(() => validate({}), /Value must be a string/);
  });

  it('should validator accept only strings in strict mode', function() {
    const validate = library.generate('string', {strictFormat: true});
    validate('');
    validate(null);
    assert.throws(() => validate(0), /Value must be a string/);
    assert.throws(() => validate(1.1), /Value must be a string/);
    assert.throws(() => validate(true), /Value must be a string/);
  });

  it('should validator accept enum values if set', function() {
    const validate = library.generate({
      type: 'string',
      enum: ['a', 'b']
    });
    assert.deepStrictEqual(validate('a'), {valid: true, value: 'a'});
    assert.deepStrictEqual(validate('b'), {valid: true, value: 'b'});
    assert.throws(() => validate(''), /Value must be a one of the enumerated values/);
    assert.throws(() => validate('c'), /Value must be a one of the enumerated values/);
  });

  it('should validate min length', function() {
    const validate = library.generate({
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
    const validate = library.generate({
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
    const validate = library.generate({
      type: 'string',
      pattern: ['[abcd1234]+']
    });
    validate(1234);
    validate('ab');
    assert.throws(() => validate('xyz'),
        /Value does not match required format/);
  });

  it('should coerce value to string', function() {
    const validate = library.generate('string', {coerceTypes: true});
    assert.deepStrictEqual(validate(''), {valid: true, value: ''});
    assert.deepStrictEqual(validate('0'), {valid: true, value: '0'});
    assert.deepStrictEqual(validate(0), {valid: true, value: '0'});
    assert.deepStrictEqual(validate(1.1), {valid: true, value: '1.1'});
    assert.deepStrictEqual(validate(false), {valid: true, value: 'false'});
  });

  it('should coerce value to default if null', function() {
    const validate = library.generate({
      type: 'string',
      default: 1
    }, {coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: '1'});
  });

  it('should return "errors" property on error', function() {
    const validate = library.generate({
      type: 'string',
      pattern: '\\d+'
    }, {throwOnError: false});
    assert.deepStrictEqual(validate('abc'), {
      valid: false,
      errors: [{
        errorType: 'invalid-value-format',
        message: 'Value does not match required format'
      }]
    });
  });

  it('should extend', function() {
    library.addSchema('Type1', {
      type: 'string',
      default: '12345'
    });
    const validate = library.generate({
      type: 'Type1'
    }, {coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: '12345'});
  });

});
