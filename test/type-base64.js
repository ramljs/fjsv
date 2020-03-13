const assert = require('assert');
const {Valgen, Base64Factory} = require('..');

describe('Base64Factory', function() {

  let library;
  beforeEach(function() {
    library = new Valgen({throwOnError: true});
    library.define('file', new Base64Factory());
  });

  it('should not set "enum" attribute', function() {
    const t = library.getType({
      type: 'file',
      name: 'typ1',
      enum: [1, 2, '3']
    });
    assert.deepStrictEqual(t.get('enum'), undefined);
  });

  it('should set "default" attribute', function() {
    const t = library.getType({
      type: 'file',
      name: 'typ1',
      default: 'RmlsZSBjb250ZW50',
      other: 1234
    });
    assert.strictEqual(t.get('default'), 'RmlsZSBjb250ZW50');
    assert.strictEqual(t.get('other'), undefined);
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
