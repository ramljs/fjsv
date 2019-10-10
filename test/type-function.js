/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('FunctionType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary();
  });

  it('should set "default" attribute as function', function() {
    const fn = () => 1;
    const t = library.get({
      type: 'function',
      name: 'typ1',
      default: fn
    });
    assert.strictEqual(t.default, fn);
    t.default = null;
    assert.strictEqual(t.default, null);
    t.default = undefined;
    assert.strictEqual(t.default, undefined);
  });

  it('should generate validator', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'function'
    });
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept only function values', function() {
    const fn = () => 1;
    const typ1 = library.get({
      name: 'typ1',
      type: 'function'
    });
    const validate = typ1.validator({throwOnError: true});
    validate(fn);
    validate(null);
    assert.throws(() => validate(0), /Value must be a function/);
    assert.throws(() => validate(1), /Value must be a function/);
    assert.throws(() => validate('false'), /Value must be a function/);
    assert.throws(() => validate('true'), /Value must be a function/);
    assert.throws(() => validate(''), /Value must be a function/);
  });

});
