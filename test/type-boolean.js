const assert = require('assert');
const {Valgen} = require('..');

describe('BooleanFactory', function() {

  let library;
  beforeEach(function() {
    library = new Valgen({throwOnError: true});
  });

  it('should create BooleanFactory instance', function() {
    let t = library.getType({
      type: 'boolean',
      name: 'typ1',
      other: 123
    });
    assert.strictEqual(t.name, 'typ1');
    assert.strictEqual(t.typeName, 'boolean');
    assert.strictEqual(t.get('other'), undefined);
  });

  it('should set "default" attribute as boolean', function() {
    const t = library.getType({
      type: 'boolean',
      name: 'typ1',
      default: 1
    });
    assert.strictEqual(t.get('default'), true);
  });

  it('should set "strictFormat" attribute as boolean', function() {
    const t = library.getType({
      type: 'boolean',
      name: 'typ1',
      strictFormat: 1
    });
    assert.strictEqual(t.get('strictFormat'), true);
  });

  it('should create mixin types', function() {
    let t = library.getType({
      type: [{
        type: 'boolean'
      }, {
        type: 'boolean',
        default: true
      }]
    });
    assert.strictEqual(t.get('default'), true);
  });

  it('should generate validator', function() {
    const validate = library.generate('boolean');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept other values in non-strict mode', function() {
    const validate = library.generate('boolean');
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
    const validate = library.generate('boolean', {strictFormat: true});
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
    const validate = library.generate('boolean', {coerceTypes: true});
    assert.deepStrictEqual(validate(false), {valid: true, value: false});
    assert.deepStrictEqual(validate(true), {valid: true, value: true});
    assert.deepStrictEqual(validate(0), {valid: true, value: false});
    assert.deepStrictEqual(validate(1), {valid: true, value: true});
    assert.deepStrictEqual(validate('false'), {valid: true, value: false});
    assert.deepStrictEqual(validate('true'), {valid: true, value: true});
  });

  it('should coerce value to default if null', function() {
    const validate = library.generate({
      type: 'boolean',
      default: 1
    }, {coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: true});
  });

});
