/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, FunctionType} = require('..');

describe('FunctionType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary({defaults: {throwOnError: true}});
    library.define('function', new FunctionType());
  });

  it('should set "default" attribute as function', function() {
    const fn = () => 1;
    const t = library.get({
      type: 'function',
      default: fn
    });
    assert.strictEqual(t.default, fn);
    t.default = null;
    assert.strictEqual(t.default, null);
    t.default = undefined;
    assert.strictEqual(t.default, undefined);
  });

  it('should not set "enum" attribute', function() {
    const t = library.get({
      type: 'function',
      name: 'typ1',
      enum: [1, 2, '3'],
      other: 123
    });
    assert.deepStrictEqual(t.enum, undefined);
    assert.deepStrictEqual(t.other, undefined);
  });

  it('should throw if "default" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'function',
          name: 'typ1',
          default: 'abcd'
        }), /Schema error at typ1\.default\. "abcd" is not a Function/);
  });


  it('should generate validator', function() {
    const validate = library.compile('function');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept only function values', function() {
    const fn = () => 1;
    const validate = library.compile('function');
    validate(fn);
    validate(null);
    assert.throws(() => validate(0), /Value must be a function/);
    assert.throws(() => validate(1), /Value must be a function/);
    assert.throws(() => validate('false'), /Value must be a function/);
    assert.throws(() => validate('true'), /Value must be a function/);
    assert.throws(() => validate(''), /Value must be a function/);
  });

});
