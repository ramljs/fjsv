/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('TypeLibrary', function() {

  it('should create a type using name', function() {
    const library = new TypeLibrary();
    let t = library._create('any');
    assert.strictEqual(t.name, 'any');
  });

  it('should create a type using name', function() {
    const library = new TypeLibrary();
    let t = library._create('any');
    assert.strictEqual(t.name, 'any');
  });

  it('should create a type with object definition', function() {
    const library = new TypeLibrary();
    let t = library._create({type: 'any', name: 'typ1'});
    assert.strictEqual(t.name, 'typ1');
    assert.strictEqual(t.typeName, 'any');
    t = library._create({type: ['any']});
    assert.strictEqual(t.typeName, 'any');
  });

  it('should create a type from nested schema', function() {
    const library = new TypeLibrary();
    let t = library._create({
      type: {
        type: 'any',
        name: 'abc'
      }
    });
    assert.strictEqual(t.typeName, 'any');
  });

  it('should add schema to library', function() {
    const library = new TypeLibrary();
    library.add('t1', {
      type: 'any',
      default: 1
    });
    library.add({
      name: 't2',
      type: 'any',
      default: 2
    });
    assert.strictEqual(library.schemas['t1'].default, 1);
    assert.strictEqual(library.schemas['t2'].default, 2);
    assert.throws(() => library.add('t1', 'any'), /Schema "t1" already defined/);
    assert.throws(() => library.add('t1', 2323), /Second argument must be an object or string/);
    assert.throws(() => library.add(1), /You must provide object instance as first argument/);
    assert.throws(() => library.add({}), /You must provide type name/);
  });

  it('should return cached instance except creating a second one', function() {
    const library = new TypeLibrary();
    library.add('t1', 'any');
    const t1 = library._create('t1');
    assert.strictEqual(t1, library._create('t1'));
    library.clearCache();
    assert.notStrictEqual(t1, library._create('t1'));
  });

  it('should check get() arguments', function() {
    const library = new TypeLibrary();
    assert.throws(() =>
        library._create(), /Invalid argument/);
  });

  it('should throw error if type not found', function() {
    const library = new TypeLibrary();
    assert.throws(() => library._create({type: 'unknown'}), /Unknown type/);
  });

  it('should throw error if lookup callback returns null', function() {
    const library = new TypeLibrary({lookupSchema: () => undefined});
    assert.throws(() => library._create({type: 'unknown'}), /Unknown type/);
  });

  it('should throw error if lookup callback returns same value', function() {
    const library = new TypeLibrary({lookupSchema: (v) => v});
    assert.throws(() => library._create({type: 'unknown'}), /Unknown type/);
  });

  it('should set default type', function() {
    const library = new TypeLibrary({defaults: {type: 'any'}});
    let t = library._create({name: 'abc'});
    assert.strictEqual(t.typeName, 'any');
  });

  it('should add type schema to library', function() {
    const library = new TypeLibrary();
    library.add({
      name: 'Person',
      type: 'any'
    });
    library.add('Human', 'any');
    library.add('Animal', {type: 'any', default: true});

    let t = library._create('Person');
    assert.strictEqual(t.name, 'Person');
    assert.strictEqual(t.typeName, 'any');

    t = library._create('Human');
    assert.strictEqual(t.name, 'Human');
    assert.strictEqual(t.typeName, 'any');

    t = library._create('Animal');
    assert.strictEqual(t.name, 'Animal');
    assert.strictEqual(t.typeName, 'any');
  });

  it('should register a new type factory', function() {
    const library = new TypeLibrary();
    library.define('custom', {
      compile() {
      }
    });
    let t = library._create({type: 'custom'});
    assert.strictEqual(t.typeName, 'custom');
  });

  it('should validate type factory', function() {
    const library = new TypeLibrary();
    assert.throws(() =>
        library.define('', {}), /You must provide type name/);
    assert.throws(() =>
        library.define('custom', null), / Factory argument must be an object/);
    assert.throws(() =>
        library.define('custom', 123), / Factory argument must be an object/);
    assert.throws(() =>
        library.define('custom', {}), /Factory must contain a "compile" function/);
    library.define('custom', {compile() {}});
    assert.throws(() =>
            library.define('custom', {compile() {}}),
        /Data type "custom" already registered/);

  });

  it('should call "create" function of custom type factory', function() {
    const library = new TypeLibrary();
    let ok = 0;
    library.define('custom', {
      create() {
        ok = 1;
      },
      compile() {}
    });
    library._create({type: 'custom'});
    assert.strictEqual(ok, 1);
  });

  it('should call "set" function of custom type factory', function() {
    const library = new TypeLibrary();
    const ok = {};
    library.define('custom', {
      set(dataType, attr, v) {
        return ok[attr] = v;
      },
      compile() {}
    });
    library._create({type: 'custom', v1: 1, v2: 2});
    assert.deepStrictEqual(ok, {v1: 1, v2: 2});
  });

  it('should call lookup callback for custom types', function() {
    const library = new TypeLibrary({
      lookupSchema: (n) => {
        if (n === 'CustomType1')
          return 'string';
        if (n === 'CustomType2')
          return {type: 'any', default: 1};
        if (n === 'CustomType3')
          return {type: 'any', default: 3};
        return n;
      }
    });
    const t1 = library._create({type: 'CustomType1'});
    const t2 = library._create({type: 'CustomType2', default: 21});
    const t3 = library._create({type: 'CustomType3', default: 31});
    const t4 = library._create({type: 'CustomType2'});
    assert.strictEqual(t1.typeName, 'string');
    assert.strictEqual(t2.typeName, 'any');
    assert.strictEqual(t3.typeName, 'any');
    assert.strictEqual(t4.typeName, 'any');
    assert.strictEqual(t2.default, 21);
    assert.strictEqual(t3.default, 31);
    assert.strictEqual(t4.default, 1);
  });

});
