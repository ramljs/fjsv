/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('ArrayType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary({defaults: {throwOnError: true}});
  });

  it('should create array type if there is [] after type name', function() {
    const t = library._create({
      type: 'string[]'
    });
    assert.deepStrictEqual(t.typeName, 'array');
    assert.deepStrictEqual(t.items.typeName, 'string');
  });

  it('should set "items" attribute', function() {
    const t = library._create({
      name: 'typ1',
      items: 'string'
    });
    assert.deepStrictEqual(t.items.name, 'string');
  });

  it('should ignore "enum" attribute', function() {
    const t = library._create({
      type: 'array',
      name: 'typ1',
      enum: [1, 2],
      other: 123,
      items: null
    });
    assert.deepStrictEqual(t.enum, undefined);
    assert.deepStrictEqual(t.items, null);
  });

  it('should set "minItems" attribute', function() {
    const t = library._create({
      type: 'array',
      name: 'typ1',
      minItems: 0
    });
    assert.strictEqual(t.minItems, 0);
  });

  it('should throw if "minItems" value is not valid', function() {
    assert.throws(() =>
        library._create({
          type: 'array',
          name: 'typ1',
          minItems: 'abcd'
        }), /Schema error at typ1\.minItems\. "abcd" is not a valid integer value/);
  });

  it('should set "maxItems" attribute', function() {
    const t = library._create({
      type: 'array',
      name: 'typ1',
      maxItems: 0
    });
    assert.strictEqual(t.maxItems, 0);
  });

  it('should throw if "maxItems" value is not valid', function() {
    assert.throws(() =>
        library.compile({
          type: 'array',
          name: 'typ1',
          maxItems: 'abcd'
        }), /Schema error at typ1\.maxItems\. "abcd" is not a valid integer value/);
  });

  it('should set "uniqueItems" attribute', function() {
    const t = library._create({
      type: 'array',
      name: 'typ1',
      uniqueItems: 1
    });
    assert.strictEqual(t.uniqueItems, true);
  });

  it('should generate validator', function() {
    const validate = library.compile('array');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept any type in non-strict mode', function() {
    const arr = [1, 2, 3];
    const validate = library.compile('array');
    assert.deepStrictEqual(validate(arr), {valid: true, value: arr});
    assert.strictEqual(validate(arr).value, arr);
    assert.deepStrictEqual(validate(''), {valid: true, value: ''});
    assert.deepStrictEqual(validate(false), {valid: true, value: false});
    assert.deepStrictEqual(validate({}), {valid: true, value: {}});
  });

  it('should validator accept only array type in strict mode', function() {
    const arr = [1, 2, 3];
    const validate = library.compile('array', {strictFormat: true});
    assert.deepStrictEqual(validate(arr), {valid: true, value: arr});
    assert.strictEqual(validate(arr).value, arr);
    assert.throws(() => validate(''), /Value must be an array/);
    assert.throws(() => validate(false), /Value must be an array/);
    assert.throws(() => validate({}), /Value must be an array/);
  });

  it('should validate sub items', function() {
    const validate = library.compile({
      type: 'array',
      items: 'string'
    });
    assert.deepStrictEqual(validate('abc'), {valid: true, value: 'abc'});
    assert.deepStrictEqual(validate(['abc']), {valid: true, value: ['abc']});
    assert.throws(() => validate([{}]),
        /Value must be a string/);
  });

  it('should validate minItems', function() {
    const validate = library.compile({
      type: 'array',
      minItems: 2
    });
    validate([1, 2]);
    assert.throws(() => validate([1]),
        /Minimum accepted array length is 2, actual 1/);
  });

  it('should validate maxItems', function() {
    const validate = library.compile({
      type: 'array',
      maxItems: 2
    });
    validate([1, 2]);
    assert.throws(() => validate([1, 2, 3]),
        /Maximum accepted array length is 2, actual 3/);
  });

  it('should validate unique items', function() {
    const validate = library.compile({
      type: 'array',
      uniqueItems: true
    });
    validate([1, 2]);
    assert.throws(() =>
            validate([1, 2, 3, 3]),
        /Items must be unique/);
  });

  it('should coerce value to array', function() {
    const validate = library.compile('array', {coerceTypes: true});
    assert.deepStrictEqual(
        validate(false),
        {valid: true, value: [false]});
    assert.deepStrictEqual(validate(0), {valid: true, value: [0]});
    assert.deepStrictEqual(validate(''), {valid: true, value: ['']});
    assert.deepStrictEqual(validate('abc'), {valid: true, value: ['abc']});
  });

  it('should coerce sub items', function() {
    const validate = library.compile({
      type: 'array',
      items: 'string'
    }, {coerceTypes: true});
    assert.deepStrictEqual(
        validate('abc'),
        {valid: true, value: ['abc']});
    assert.deepStrictEqual(validate(1), {valid: true, value: ['1']});
  });

  it('should coerce default value to array type', function() {
    const validate = library.compile({
      type: 'array',
      default: 1
    }, {coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: [1]});
  });

  it('should limit error count to maxArrayErrors', function() {
    const validate = library.compile({
      type: 'array',
      items: 'number'
    }, {maxArrayErrors: 2, throwOnError: false});
    let x = validate(['a', 'b', 'c']);
    assert.strictEqual(x.errors.length, 2);
  });

});
