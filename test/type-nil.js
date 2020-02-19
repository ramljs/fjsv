/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, NilType} = require('..');

describe('NilType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary({defaults: {throwOnError: true}});
    library.define('nil', new NilType());
  });

  it('should not set "default" attribute', function() {
    const t = library.get({
      type: 'nil',
      name: 'typ1',
      default: 1
    });
    assert.strictEqual(t.default, undefined);
  });

  it('should generate validator', function() {
    const validate = library.compile('nil');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept null and undefined', function() {
    const validate = library.compile('nil');
    validate(null);
    validate();
    assert.throws(() => validate(0), /Value must be null/);
    assert.throws(() => validate(''), /Value must be null/);
  });

  it('should coerce value to null', function() {
    const validate = library.compile('nil', {coerceTypes: true});
    assert.deepStrictEqual(validate(null), {valid: true, value: null});
    assert.deepStrictEqual(validate(undefined), {valid: true, value: null});
  });

});
