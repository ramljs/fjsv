/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('BooleanType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary({defaults: {throwOnError: true}});
  });

  it('should create BooleanType instance', function() {
    let t = library._create({
      type: 'boolean',
      name: 'typ1',
      other: 123
    });
    assert.strictEqual(t.name, 'typ1');
    assert.strictEqual(t.typeName, 'boolean');
    assert.strictEqual(t.other, undefined);
  });

  it('should set "default" attribute as boolean', function() {
    const t = library._create({
      type: 'boolean',
      name: 'typ1',
      default: 1
    });
    assert.strictEqual(t.default, true);
  });

  it('should set "enum" attribute as boolean', function() {
    const t = library._create({
      type: 'boolean',
      name: 'typ1',
      enum: [1, 0]
    });
    assert.deepStrictEqual(t.enum, [true, false]);
  });

  it('should throw if "enum" value is not an array', function() {
    assert.throws(() =>
        library._create({
          type: 'boolean',
          name: 'typ1',
          enum: 'abcd'
        }), /Schema error at typ1\.enum\. "abcd" is not an array value/);
  });

  it('should set "strictFormat" attribute as boolean', function() {
    const t = library._create({
      type: 'boolean',
      name: 'typ1',
      strictFormat: 1
    });
    assert.strictEqual(t.strictFormat, true);
  });

  it('should create mixin types', function() {
    let t = library._create({
      type: [{
        type: 'boolean'
      }, {
        type: 'boolean',
        default: true
      }]
    });
    assert.strictEqual(t.default, true);
  });

  it('should generate validator', function() {
    const validate = library.compile('boolean');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept other values in non-strict mode', function() {
    const validate = library.compile('boolean');
    assert.deepStrictEqual(validate(null), {valid: true, value: null});
    assert.deepStrictEqual(validate(false), {valid: true, value: false});
    assert.deepStrictEqual(validate(true), {valid: true, value: true});
    assert.deepStrictEqual(validate(0), {valid: true, value: 0});
    assert.deepStrictEqual(validate(1), {valid: true, value: 1});
    assert.deepStrictEqual(validate('false'), {valid: true, value: 'false'});
    assert.deepStrictEqual(validate('true'), {valid: true, value: 'true'});
    assert.throws(() => validate(12), /Value must be a boolean/);
    assert.throws(() => validate(''), /Value must be a boolean/);
    assert.throws(() => validate([]), /Value must be a boolean/);
    assert.throws(() => validate({}), /Value must be a boolean/);
  });

  it('should validator accept only boolean values in strict mode', function() {
    const validate = library.compile('boolean', {strictFormat: true});
    validate(false);
    validate(true);
    validate(null);
    assert.throws(() => validate(0), /Value must be a boolean/);
    assert.throws(() => validate(1), /Value must be a boolean/);
    assert.throws(() => validate('false'), /Value must be a boolean/);
    assert.throws(() => validate('true'), /Value must be a boolean/);
    assert.throws(() => validate(''), /Value must be a boolean/);
  });

  it('should coerce value to boolean type', function() {
    const validate = library.compile('boolean', {coerceTypes: true});
    assert.deepStrictEqual(validate(false), {valid: true, value: false});
    assert.deepStrictEqual(validate(true), {valid: true, value: true});
    assert.deepStrictEqual(validate(0), {valid: true, value: false});
    assert.deepStrictEqual(validate(1), {valid: true, value: true});
    assert.deepStrictEqual(validate('false'), {valid: true, value: false});
    assert.deepStrictEqual(validate('true'), {valid: true, value: true});
  });

  it('should coerce value to default if null', function() {
    const validate = library.compile({
      type: 'boolean',
      default: 1
    }, {coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: true});
  });

});
