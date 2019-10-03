/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, DataType} = require('..');

describe('TypeLibrary', function() {

  it('should create type with name', function() {
    const typeLib = new TypeLibrary();
    let t = typeLib.get('string');
    assert.strictEqual(t.name, 'string');
  });

  it('should create type with object definition', function() {
    const typeLib = new TypeLibrary();
    let t = typeLib.get({type: 'string'});
    assert.deepStrictEqual(t.type[0].name, 'string');
    t = typeLib.get({type: ['string']});
    assert.deepStrictEqual(t.type[0].name, 'string');
  });

  it('should create type from nasted type', function() {
    const typeLib = new TypeLibrary();
    let t = typeLib.get({
      type: {
        type: 'string',
        name: 'abc'
      }
    });
    assert.deepStrictEqual(t.type[0].name, 'abc');
  });

  it('should check get() arguments', function() {
    const typeLib = new TypeLibrary({defaults: {required: true}});
    assert.throws(() =>
        typeLib.get(), /Invalid argument/);
  });

  it('should call lookup callback for custom types', function() {
    const typeLib = new TypeLibrary({
      onTypeLookup: (n) => {
        if (n === 'CustomType1')
          return 'string';
        if (n === 'CustomType2')
          return {type: 'number', required: false};
        if (n === 'CustomType3')
          return 'string[]';
        return n;
      }
    });
    const t1 = typeLib.get({type: 'CustomType1'});
    const t2 = typeLib.get({type: 'CustomType2', required: true});
    const t3 = typeLib.get({type: 'CustomType3', minItems: 3});
    const t4 = typeLib.get({type: 'CustomType2'});
    assert.strictEqual(t1.type[0].name, 'CustomType1');
    assert.strictEqual(t1.type[0].type[0].name, 'string');
    assert.strictEqual(t2.type[0].name, 'CustomType2');
    assert.strictEqual(t3.type[0].name, 'CustomType3');
    assert.strictEqual(t4.type[0].name, 'CustomType2');
    assert.strictEqual(t2.required, true);
    assert.strictEqual(typeLib.types.CustomType1.type[0].name, 'string');
    assert.strictEqual(typeLib.types.CustomType2.type[0].name, 'number');
    assert.strictEqual(typeLib.types.CustomType3.type[0].name, 'array');
    assert.strictEqual(t1.type[0], typeLib.types.CustomType1);
    assert.strictEqual(t2.type[0], typeLib.types.CustomType2);
    assert.deepStrictEqual(t2.type, t4.type);
    assert.strictEqual(t3.items, undefined);
    assert.strictEqual(t3.minItems, 3);
    assert.strictEqual(t3.type[0].name, 'CustomType3');
    assert.strictEqual(t3.type[0].items.name, 'string');
  });

  it('should throw Unknown type error if type not found', function() {
    const typeLib = new TypeLibrary();
    assert.throws(() => typeLib.get({type: 'unknown'}), /Unknown type/);
  });

  it('should throw Unknown type error if lookup callback returns null', function() {
    const typeLib = new TypeLibrary({onTypeLookup: () => undefined});
    assert.throws(() => typeLib.get({type: 'unknown'}), /Unknown type/);
  });

  it('should throw Unknown type error if lookup callback returns same value', function() {
    const typeLib = new TypeLibrary({onTypeLookup: (v) => v});
    assert.throws(() => typeLib.get({type: 'unknown'}), /Unknown type/);
  });

  it('should set default type', function() {
    const typeLib = new TypeLibrary({defaults: {type: 'boolean'}});
    let t = typeLib.get({name: 'abc'});
    assert.strictEqual(t.baseName, 'boolean');
  });

  it('should set default required', function() {
    const typeLib = new TypeLibrary({defaults: {required: true}});
    assert.strictEqual(typeLib.defaults.required, true);
  });

  it('should register a new type class', function() {
    const typeLib = new TypeLibrary({defaults: {required: true}});
    const CustomType = class extends DataType {
    };
    typeLib.register('custom', CustomType);
    let t = typeLib.get({type: 'custom'});
    assert.strictEqual(t.baseName, 'custom');
  });

  it('should throw error if type class is not extended from DataType', function() {
    const typeLib = new TypeLibrary({defaults: {required: true}});
    assert.throws(() =>
        typeLib.register('custom', Number), /Class must be extended from DataType/);
  });

});
