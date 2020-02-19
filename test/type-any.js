/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('AnyType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary({defaults: {throwOnError: true}});
  });

  it('should create AnyType instance', function() {
    let t = library.get({
      type: 'any',
      name: 'typ1',
      default: 0,
      blabla: 1
    });
    assert.strictEqual(t.typeName, 'any');
    assert.strictEqual(t.name, 'typ1');
    assert.strictEqual(t.default, 0);
    assert.strictEqual(t.blabla, undefined);
  });

  it('should create mixin types', function() {
    let t = library.get({
      type: [{
        type: 'any',
        default: 1
      }, {
        type: 'any',
        default: 2
      }]
    });
    assert.strictEqual(t.default, 2);
  });

  it('should not mix with other internals', function() {
    const tryType = (x) => {
      try {
        library.get({
          name: 'Type1',
          type: ['any', x]
        });
      } catch (e) {
        assert.strictEqual(e.message,
            `Schema error at Type1.type[1]. "any" type can't be mixed with "${x}" type.`);
        return;
      }
      assert(0, 'Failed');
    };
    ['string', 'object', 'number', 'boolean'].forEach(tryType);
  });

  it('should generate validator', function() {
    const validate = library.compile('any');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should return cached validator for same options', function() {
    library.add('typ1', {type: 'any'});
    const typ1 = library.get('typ1');
    library.compile('typ1');
    assert.strictEqual(Object.keys(typ1._cache).length, 1);
    library.compile('typ1');
    assert.strictEqual(Object.keys(typ1._cache).length, 1);
    library.compile('typ1', {resolvePromises: true});
    assert.strictEqual(Object.keys(typ1._cache).length, 2);
  });

  it('should return default value if given value is null', function() {
    const validate = library.compile({
      type: 'any',
      default: 123
    });
    assert.strictEqual(validate(null).value, 123);
  });

  it('should use mixin attributes', function() {
    const validate = library.compile({
      name: 'typ1',
      type: [
        {
          type: 'any',
          default: 1
        }, {
          type: 'any',
          default: 2
        }]
    });
    assert.strictEqual(validate(null).value, 2);
  });

  it('should throw if mixing recursive', function() {
    library.add('Type1', {
      type: ['Type1']
    });
    assert.throws(() => library.compile('Type1'),
        /Schema error at Type1\.type\. Circular reference detected/);
  });

  it('should generate async validator resolvePromises=true', function() {
    const validate = library.compile('any', {resolvePromises: true});
    assert.strictEqual(validate.constructor.name, 'AsyncFunction');
  });

  it('should revolve value if resolvePromises=true', async function() {
    const validate = library.compile('any', {resolvePromises: true});
    const v = new Promise((resolve) => setTimeout(() => resolve(123), 10));
    assert.strictEqual((await validate(v)).value, 123);
  });

});
