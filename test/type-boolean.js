/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('BooleanType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary();
  });
  
  it('should set "default" attribute as boolean', function() {
    const t = library.get({
      type: 'boolean',
      name: 'typ1',
      default: true
    });
    assert.strictEqual(t.default, true);
    t.default = 1;
    assert.strictEqual(t.default, true);
    t.default = 0;
    assert.strictEqual(t.default, false);
    t.default = '';
    assert.strictEqual(t.default, false);
    t.default = null;
    assert.strictEqual(t.default, null);
    t.default = undefined;
    assert.strictEqual(t.default, undefined);
  });

  it('should generate validator', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'boolean'
    });
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept other values in non-strict mode', function() {
    const t = library.get({
      name: 'typ1',
      type: 'boolean'
    });
    const validate = t.validator({throwOnError: true});
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
    const typ1 = library.get({
      name: 'typ1',
      type: 'boolean'
    });
    const validate = typ1.validator({strictTypes: true, throwOnError: true});
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
    const typ1 = library.get({
      name: 'typ1',
      type: 'boolean'
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(validate(false), {valid: true, value: false});
    assert.deepStrictEqual(validate(true), {valid: true, value: true});
    assert.deepStrictEqual(validate(0), {valid: true, value: false});
    assert.deepStrictEqual(validate(1), {valid: true, value: true});
    assert.deepStrictEqual(validate('false'), {valid: true, value: false});
    assert.deepStrictEqual(validate('true'), {valid: true, value: true});
  });

  it('should coerce value to default if null', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'boolean',
      default: 1
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(validate(), {valid: true, value: true});
  });

});
