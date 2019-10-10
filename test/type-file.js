/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, FileType} = require('..');

describe('FileType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary();
    library.register('file', FileType);
  });

  it('should set "fileTypes" attribute as string array', function() {
    const t = library.get({
      type: 'file',
      name: 'typ1',
      fileTypes: ['image/jpeg', 'image/png']
    });
    assert.deepStrictEqual(t.fileTypes, ['image/jpeg', 'image/png']);
    t.fileTypes = ['image/jpeg', 'image/png', 'image/gif'];
    assert.deepStrictEqual(t.fileTypes, ['image/jpeg', 'image/png',
      'image/gif']);
    t.fileTypes = null;
    assert.strictEqual(t.fileTypes, null);
    t.fileTypes = undefined;
    assert.strictEqual(t.fileTypes, undefined);
  });

  it('should throw if "fileTypes" value is not array', function() {
    assert.throws(() =>
        library.get({
          type: 'file',
          name: 'typ1',
          fileTypes: 1
        }), /Array type required for "fileTypes" attribute/);
  });

  it('should set "minLength" attribute', function() {
    const t = library.get({
      type: 'file',
      name: 'typ1',
      minLength: 0
    });
    assert.strictEqual(t.minLength, 0);
    t.minLength = '1';
    assert.deepStrictEqual(t.minLength, 1);
    t.minLength = null;
    assert.strictEqual(t.minLength, null);
    t.minLength = undefined;
    assert.strictEqual(t.minLength, undefined);
  });

  it('should throw if "minLength" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'file',
          name: 'typ1',
          minLength: 'abcd'
        }), /"abcd" is not a valid number value for minLength attribute/);
  });

  it('should set "maxLength" attribute', function() {
    const t = library.get({
      type: 'file',
      name: 'typ1',
      maxLength: 0
    });
    assert.strictEqual(t.maxLength, 0);
    t.maxLength = '1';
    assert.deepStrictEqual(t.maxLength, 1);
    t.maxLength = null;
    assert.strictEqual(t.maxLength, null);
    t.maxLength = undefined;
    assert.strictEqual(t.maxLength, undefined);
  });

  it('should throw if "maxLength" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'file',
          name: 'typ1',
          maxLength: 'abcd'
        }), /"abcd" is not a valid number value for maxLength attribute/);
  });

  it('should generate validator', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'file'
    });
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept only base64 strings', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'file'
    });
    const validate = typ1.validator({strictTypes: true, throwOnError: true});
    validate('');
    validate(null);
    validate('RmlsZSBjb250ZW50');
    assert.throws(() => validate('^^^'), /Value must be base64 encoded string/);
    assert.throws(() => validate(0), /Value must be base64 encoded string/);
    assert.throws(() => validate(1.1), /Value must be base64 encoded string/);
    assert.throws(() => validate(true), /Value must be base64 encoded string/);
  });

});
