/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, Base64Type} = require('..');

describe('Base64Type', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary({defaults: {throwOnError: true}});
    library.define('file', new Base64Type());
  });

  it('should not set "enum" attribute', function() {
    const t = library._create({
      type: 'file',
      name: 'typ1',
      enum: [1, 2, '3']
    });
    assert.deepStrictEqual(t.enum, undefined);
  });

  it('should set "default" attribute', function() {
    const t = library._create({
      type: 'file',
      name: 'typ1',
      default: 'RmlsZSBjb250ZW50',
      other: 1234
    });
    assert.strictEqual(t.default, 'RmlsZSBjb250ZW50');
    assert.strictEqual(t.other, undefined);
  });

  it('should generate validator', function() {
    const validate = library.generate('file');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept only base64 strings', function() {
    const validate = library.generate('file', {strictFormat: true});
    validate('');
    validate(null);
    validate('RmlsZSBjb250ZW50');
    assert.throws(() => validate('^^^'), /Value must be base64 encoded string/);
    assert.throws(() => validate(0), /Value must be base64 encoded string/);
    assert.throws(() => validate(1.1), /Value must be base64 encoded string/);
    assert.throws(() => validate(true), /Value must be base64 encoded string/);
  });

});
