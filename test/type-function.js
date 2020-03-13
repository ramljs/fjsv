const assert = require('assert');
const {Valgen, FunctionFactory} = require('..');

describe('FunctionFactory', function() {

  let library;
  beforeEach(function() {
    library = new Valgen({throwOnError: true});
    library.define('function', new FunctionFactory());
  });

  it('should set "default" attribute as function', function() {
    const fn = () => 1;
    const t = library.getType({
      type: 'function',
      default: fn
    });
    assert.strictEqual(t.get('default'), fn);
  });

  it('should not set "enum" attribute', function() {
    const t = library.getType({
      type: 'function',
      name: 'typ1',
      enum: [1, 2, '3'],
      other: 123
    });
    assert.deepStrictEqual(t.get('enum'), undefined);
    assert.deepStrictEqual(t.get('other'), undefined);
  });

  it('should throw if "default" value is not valid', function() {
    assert.throws(() =>
        library.getType({
          type: 'function',
          name: 'typ1',
          default: 'abcd'
        }), /Schema error at typ1\.default\. "abcd" is not a Function/);
  });


  it('should generate validator', function() {
    const validate = library.generate('function');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept only function values', function() {
    const fn = () => 1;
    const validate = library.generate('function');
    validate(fn);
    validate(null);
    assert.throws(() => validate(0), /Value must be a function/);
    assert.throws(() => validate(1), /Value must be a function/);
    assert.throws(() => validate('false'), /Value must be a function/);
    assert.throws(() => validate('true'), /Value must be a function/);
    assert.throws(() => validate(''), /Value must be a function/);
  });

});
