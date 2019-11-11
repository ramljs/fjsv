/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, Base64Type} = require('..');

describe('Base64Type', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary({defaults: {throwOnError: true}});
    library.addDataType('file', new Base64Type());
  });

  it('should generate validator', function() {
    const validate = library.compile('file');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept only base64 strings', function() {
    const validate = library.compile('file', {strictFormat: true});
    validate('');
    validate(null);
    validate('RmlsZSBjb250ZW50');
    assert.throws(() => validate('^^^'), /Value must be base64 encoded string/);
    assert.throws(() => validate(0), /Value must be base64 encoded string/);
    assert.throws(() => validate(1.1), /Value must be base64 encoded string/);
    assert.throws(() => validate(true), /Value must be base64 encoded string/);
  });

});
