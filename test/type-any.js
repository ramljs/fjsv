/* eslint-disable */
const assert = require('assert');
const {Valgen} = require('..');

describe('AnyFactory', function() {

  let library;
  beforeEach(function() {
    library = new Valgen({defaults: {throwOnError: true}});
  });

  it('should create AnyFactory instance', function() {
    let t = library.getType({
      type: 'any',
      default: 0,
      enum: [1, 2],
      blabla: 1
    });
    assert.strictEqual(t.typeName, 'any');
    assert.strictEqual(t.get('default'), 0);
    assert.deepEqual(t.get('enum'), undefined);
    assert.strictEqual(t.get('blabla'), undefined);
  });

  it('should create mixin types', function() {
    let t = library.getType({
      type: [{
        type: 'any',
        default: 1
      }, {
        type: 'any',
        default: 2
      }]
    });
    assert.strictEqual(t.get('default'), 2);
  });

  it('should not mix with other internals', function() {
    const tryType = (x) => {
      assert.throws(() => {
        library.getType({
          type: ['any', x]
        });
      }, (e) => e.message.includes(`"any" type can't be mixed with "${x}" type`));
    };
    ['string', 'number', 'boolean'].forEach(tryType);
  });

  it('should generate validator', function() {
    const validate = library.generate('any');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should return cached validator for same options', function() {
    library.addSchema('typ1', {type: 'any', default: 1});
    const typ1 = library.getType('typ1');
    library.generate('typ1');
    assert.strictEqual(Object.keys(typ1._fnCache).length, 1);
    library.generate('typ1');
    assert.strictEqual(Object.keys(typ1._fnCache).length, 1);
    library.generate('typ1', {resolvePromises: true});
    assert.strictEqual(Object.keys(typ1._fnCache).length, 2);
  });

  it('should return default value if given value is null', function() {
    const validate = library.generate({
      type: 'any',
      default: 123
    });
    assert.strictEqual(validate(null).value, 123);
  });

  it('should use mixin attributes', function() {
    const validate = library.generate({
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

  it('should detect circular referencing', function() {
    library.addSchema('Type1', {
      type: ['Type1']
    });
    assert.throws(() => library.generate('Type1'),
        /Circular reference detected/);
  });

  it('should generate async validator resolvePromises=true', function() {
    const validate = library.generate('any', {resolvePromises: true});
    assert.strictEqual(validate.constructor.name, 'AsyncFunction');
  });

  it('should revolve value if resolvePromises=true', async function() {
    const validate = library.generate('any', {resolvePromises: true});
    const v = new Promise((resolve) => setTimeout(() => resolve(123), 10));
    assert.strictEqual((await validate(v)).value, 123);
  });

});
