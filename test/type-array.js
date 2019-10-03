/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('ArrayType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary();
  });

  it('should create array type if there is [] after type name', function() {
    const t = library.get({
      type: 'string[]',
    });
    assert.deepStrictEqual(t.baseName, 'array');
    assert.deepStrictEqual(t.items.baseName, 'string');
  });

  it('should set "items" attribute', function() {
    const t = library.get({
      type: 'array',
      name: 'typ1',
      items: 'string'
    });
    assert.deepStrictEqual(t.items.name, 'string');
    t.items = null;
    assert.strictEqual(t.items, null);
    t.items = undefined;
    assert.strictEqual(t.items, undefined);
  });

  it('should set "minItems" attribute', function() {
    const t = library.get({
      type: 'array',
      name: 'typ1',
      minItems: 0
    });
    assert.strictEqual(t.minItems, 0);
    t.minItems = '1';
    assert.deepStrictEqual(t.minItems, 1);
    t.minItems = null;
    assert.strictEqual(t.minItems, null);
    t.minItems = undefined;
    assert.strictEqual(t.minItems, undefined);
  });

  it('should throw if "minItems" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'array',
          name: 'typ1',
          minItems: 'abcd'
        }), /"abcd" is not a valid number value for minItems attribute/);
  });

  it('should set "maxItems" attribute', function() {
    const t = library.get({
      type: 'array',
      name: 'typ1',
      maxItems: 0
    });
    assert.strictEqual(t.maxItems, 0);
    t.maxItems = '1';
    assert.deepStrictEqual(t.maxItems, 1);
    t.maxItems = null;
    assert.strictEqual(t.maxItems, null);
    t.maxItems = undefined;
    assert.strictEqual(t.maxItems, undefined);
  });

  it('should throw if "maxItems" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'array',
          name: 'typ1',
          maxItems: 'abcd'
        }), /"abcd" is not a valid number value for maxItems attribute/);
  });

  it('should set "uniqueItems" attribute', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const t = library.get({
      type: 'array',
      name: 'typ1',
      uniqueItems: 1
    });
    assert.strictEqual(t.uniqueItems, true);
    t.uniqueItems = 0;
    assert.strictEqual(t.uniqueItems, false);
    t.uniqueItems = null;
    assert.strictEqual(t.uniqueItems, null);
    t.uniqueItems = undefined;
    assert.strictEqual(t.uniqueItems, undefined);
  });

  it('should generate validator', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'array'
    });
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept any type in non-strict mode', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'array'
    });
    const arr = [1, 2, 3];
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate(arr), {valid: true, value: arr});
    assert.strictEqual(validate(arr).value, arr);
    assert.deepStrictEqual(validate(''), {valid: true, value: ''});
    assert.deepStrictEqual(validate(false), {valid: true, value: false});
    assert.deepStrictEqual(validate({}), {valid: true, value: {}});
  });

  it('should validator accept only array type in strict mode', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'array'
    });
    const arr = [1, 2, 3];
    const validate = typ1.validator({throwOnError: true, strictTypes: true});
    assert.deepStrictEqual(validate(arr), {valid: true, value: arr});
    assert.strictEqual(validate(arr).value, arr);
    assert.throws(() =>
            validate(''),
        /Value must be an array/);
    assert.throws(() => validate(false), /Value must be an array/);
    assert.throws(() => validate({}), /Value must be an array/);
  });

  it('should validate sub items', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'array',
      items: 'string'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate('abc'), {valid: true, value: 'abc'});
    assert.deepStrictEqual(validate(['abc']), {valid: true, value: ['abc']});
    assert.throws(() => validate([{}]),
        /Value must be a string/);
  });

  it('should validate minItems', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'array',
      minItems: 2
    });
    const validate = typ1.validator({throwOnError: true});
    validate([1, 2]);
    assert.throws(() => validate([1]),
        /Minimum accepted array length is 2, actual 1/);
  });

  it('should validate maxItems', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'array',
      maxItems: 2
    });
    const validate = typ1.validator({throwOnError: true});
    validate([1, 2]);
    assert.throws(() => validate([1, 2, 3]),
        /Maximum accepted array length is 2, actual 3/);
  });

  it('should validate unique items', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'array',
      uniqueItems: true
    });
    const validate = typ1.validator({throwOnError: true});
    validate([1, 2]);
    assert.throws(() =>
            validate([1, 2, 3, 3]),
        /Unique array contains non-unique items/);
  });

  it('should coerce value to array', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'array'
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(
        validate(false),
        {valid: true, value: [false]});
    assert.deepStrictEqual(validate(0), {valid: true, value: [0]});
    assert.deepStrictEqual(validate(''), {valid: true, value: ['']});
    assert.deepStrictEqual(validate('abc'), {valid: true, value: ['abc']});
  });

  it('should coerce sub items', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'array',
      items: 'string'
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(
        validate('abc'),
        {valid: true, value: ['abc']});
    assert.deepStrictEqual(validate(1), {valid: true, value: ['1']});
  });

  it('should coerce default value to array type', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'array',
      default: 1
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: [1]});
  });

  it('should limit error count to maxArrayErrors', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'array',
      items: 'number'
    });
    const validate = typ1.validator({maxArrayErrors: 2});
    let x = validate(['a', 'b', 'c']);
    assert.strictEqual(x.errors.length, 2);
  });

});
