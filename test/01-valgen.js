const assert = require('assert');
const vg = require('..');

describe('Valgen', function() {

  it('should create a type using name', function() {
    const validator = vg();
    let t = validator.getType('any');
    assert.strictEqual(t.name, 'any');
    assert.strictEqual(t.id, 1);
  });

  it('should create a type with object definition', function() {
    const validator = vg();
    let t = validator.getType({type: 'any', name: 'typ1'});
    assert.strictEqual(t.name, 'typ1');
    assert.strictEqual(t.id, 1);
    assert.strictEqual(t.typeName, 'any');
    t = validator.getType({type: ['any']});
    assert.strictEqual(t.typeName, 'any');
    assert.strictEqual(t.id, 2);
  });

  it('should create a type from nested schema', function() {
    const validator = vg();
    let t = validator.getType({
      type: {
        type: 'any',
        name: 'abc'
      }
    });
    assert.strictEqual(t.typeName, 'any');
  });

  it('should add schema to validator', function() {
    const validator = vg();
    validator.addSchema('t1', {
      type: 'any',
      default: 1
    });
    validator.addSchema({
      name: 't2',
      type: 'any',
      default: 2
    });
    assert.strictEqual(validator.schemas['t1'].default, 1);
    assert.strictEqual(validator.schemas['t2'].default, 2);
    assert.throws(() => validator.addSchema('t1', 2323), /Second argument must be an object or string/);
    assert.throws(() => validator.addSchema(1), /You must provide object instance as first argument/);
    assert.throws(() => validator.addSchema({}), /You must provide type name/);
  });

  it('should return cached instance except creating a second one', function() {
    const validator = vg();
    validator.addSchema('t1', 'any');
    const t1 = validator.getType('t1');
    assert.strictEqual(t1, validator.getType('t1'));
    validator.clearCache();
    assert.notStrictEqual(t1, validator.getType('t1'));
  });

  it('should check get() arguments', function() {
    const validator = vg();
    assert.throws(() =>
        validator.getType(), /Invalid argument/);
  });

  it('should throw error if type not found', function() {
    const validator = vg();
    assert.throws(() => validator.getType({type: 'unknown'}), /Unknown type/);
  });

  it('should throw error if lookup callback returns null', function() {
    const validator = vg({schemaLookup: () => undefined});
    assert.throws(() => validator.getType({type: 'unknown'}), /Unknown type/);
  });

  it('should throw error if lookup callback returns same value', function() {
    const validator = vg({schemaLookup: (v) => v});
    assert.throws(() => validator.getType({type: 'unknown'}), /Unknown type/);
  });

  it('should set default type', function() {
    const validator = vg({defaults: {type: 'any'}});
    let t = validator.getType({name: 'abc'});
    assert.strictEqual(t.typeName, 'any');
  });

  it('should add type schema to validator', function() {
    const validator = vg();
    validator.addSchema({
      name: 'Person',
      type: 'any'
    });
    validator.addSchema('Human', 'any');
    validator.addSchema('Animal', {type: 'any', default: true});

    let t = validator.getType('Person');
    assert.strictEqual(t.name, 'Person');
    assert.strictEqual(t.typeName, 'any');

    t = validator.getType('Human');
    assert.strictEqual(t.name, 'Human');
    assert.strictEqual(t.typeName, 'any');

    t = validator.getType('Animal');
    assert.strictEqual(t.name, 'Animal');
    assert.strictEqual(t.typeName, 'any');
  });

  it('should register a new type factory', function() {
    const validator = vg();
    validator.define('custom', {
      generate() {
      }
    });
    let t = validator.getType({type: 'custom'});
    assert.strictEqual(t.typeName, 'custom');
  });

  it('should validate type factory', function() {
    const validator = vg();
    assert.throws(() =>
        validator.define('', {}), /You must provide type name/);
    assert.throws(() =>
        validator.define('custom', null), / Factory argument must be an object/);
    assert.throws(() =>
        validator.define('custom', 123), / Factory argument must be an object/);
    assert.throws(() =>
        validator.define('custom', {}), /Factory must contain a "generate" function/);
  });

  it('should call lookup callback for custom types', function() {
    const validator = vg({
      schemaLookup: (n) => {
        if (n === 'CustomType1')
          return 'string';
        if (n === 'CustomType2')
          return {type: 'any', default: 1};
        if (n === 'CustomType3')
          return {type: 'any', default: 3};
        return n;
      }
    });
    const t1 = validator.getType({type: 'CustomType1'});
    const t2 = validator.getType({type: 'CustomType2', default: 21});
    const t3 = validator.getType({type: 'CustomType3', default: 31});
    const t4 = validator.getType({type: 'CustomType2'});
    assert.strictEqual(t1.typeName, 'string');
    assert.strictEqual(t2.typeName, 'any');
    assert.strictEqual(t3.typeName, 'any');
    assert.strictEqual(t4.typeName, 'any');
    assert.strictEqual(t2.get('default'), 21);
    assert.strictEqual(t3.get('default'), 31);
    assert.strictEqual(t4.get('default'), 1);
  });

});
