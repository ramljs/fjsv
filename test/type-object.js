/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, UnionType} = require('..');

describe('ObjectType', function() {

  let library;
  const obj1 = {a: 1, b: '2', c: 'c', d: [1, '2', 3.3], e: 1};
  const properties1 = {
    'a?': 'string',
    'b?': 'number',
    'c?': 'string',
    'd?': 'array',
    'e?': 'boolean'
  };

  beforeEach(function() {
    library = new TypeLibrary({defaults: {required: true}});
    library.register('union', UnionType);
  });

  it('should create object type if there is {} after type name', function() {
    const t = library.get({
      type: 'string{}'
    }).embody();
    assert.deepStrictEqual(t.baseName, 'object');
    assert.deepStrictEqual(t.properties['/.+/'].name, 'string');
  });

  it('should set "discriminator" attribute', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      discriminator: 'kind'
    });
    assert.deepStrictEqual(t.discriminator, 'kind');
    t.discriminator = null;
    assert.strictEqual(t.discriminator, null);
    t.discriminator = undefined;
    assert.strictEqual(t.discriminator, undefined);
  });

  it('should set "discriminatorValue" attribute', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      discriminator: 'kind',
      discriminatorValue: 'abc'
    });
    assert.deepStrictEqual(t.discriminatorValue, 'abc');
    t.discriminatorValue = null;
    assert.strictEqual(t.discriminatorValue, null);
    t.discriminatorValue = undefined;
    assert.strictEqual(t.discriminatorValue, undefined);
  });

  it('should set "additionalProperties" attribute', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      additionalProperties: 0
    });
    assert.deepStrictEqual(t.additionalProperties, false);
    t.additionalProperties = null;
    assert.strictEqual(t.additionalProperties, null);
    t.additionalProperties = undefined;
    assert.strictEqual(t.additionalProperties, undefined);
  });

  it('should set "minProperties" attribute', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      minProperties: 0
    });
    assert.deepStrictEqual(t.minProperties, 0);
    t.minProperties = null;
    assert.strictEqual(t.minProperties, null);
    t.minProperties = undefined;
    assert.strictEqual(t.minProperties, undefined);
  });

  it('should throw if "minProperties" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'object',
          name: 'typ1',
          minProperties: 'abcd'
        }), /"abcd" is not a valid number value for minProperties attribute/);
  });

  it('should set "maxProperties" attribute', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      maxProperties: 0
    });
    assert.deepStrictEqual(t.maxProperties, 0);
    t.maxProperties = null;
    assert.strictEqual(t.maxProperties, null);
    t.maxProperties = undefined;
    assert.strictEqual(t.maxProperties, undefined);
  });

  it('should throw if "maxProperties" value is not valid', function() {
    assert.throws(() =>
        library.get({
          type: 'object',
          name: 'typ1',
          maxProperties: 'abcd'
        }), /"abcd" is not a valid number value for maxProperties attribute/);
  });

  it('should ignore required validation for properties if ignoreRequire=...propertynames', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const typ1 = library.get({
      name: 'typ1',
      properties: {
        'a!': 'string',
        'b!': 'number'
      }
    });
    const validate = typ1.validator({throwOnError: true, ignoreRequire: ['a']});
    assert.deepStrictEqual(validate({b: 1}).value, {b: 1});
    assert.throws(() => validate({a: 1})
    );
  });

  it('should set "isTypeOf" attribute', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      isTypeOf: () => true
    });
    assert.deepStrictEqual(typeof t.isTypeOf, 'function');
    t.isTypeOf = null;
    assert.strictEqual(t.isTypeOf, null);
    t.isTypeOf = undefined;
    assert.strictEqual(t.isTypeOf, undefined);
  });

  it('should throw if "isTypeOf" value is not a function', function() {
    assert.throws(() =>
        library.get({
          type: 'object',
          name: 'typ1',
          isTypeOf: 'abcd'
        }), /Function type required for "isTypeOf" attribute/);
  });

  it('should set "properties" attribute', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      properties: {
        p1: 'string',
        p2: {
          type: 'number'
        }
      }
    }).embody();
    assert.strictEqual(t.properties.p1.name, 'string');
    assert.strictEqual(t.properties.p2.type[0].name, 'number');
  });

  it('should use DataType instance as property.type', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      properties: {
        p1: {
          type: library.get('string')
        },
        p2: library.get('number')
      }
    }).embody();
    assert.strictEqual(t.properties.p1.type[0].name, 'string');
    assert.strictEqual(t.properties.p2.name, 'number');
  });

  it('should bulk add properties using addProperties(object) method', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1'
    }).addProperties({
      p1: 'string',
      p2: {
        type: 'number'
      }
    }).embody();
    assert.strictEqual(t.properties.p1.name, 'string');
    assert.deepStrictEqual(t.properties.p2.type[0].name, 'number');
  });

  it('should bulk add properties using addProperties(array) method', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1'
    }).addProperties([
      {name: 'p1', type: 'string'},
      {name: 'p2', type: 'number'}
    ]).embody();
    assert.deepStrictEqual(t.properties.p1.name, 'p1');
    assert.deepStrictEqual(t.properties.p1.type[0].name, 'string');
    assert.deepStrictEqual(t.properties.p2.name, 'p2');
    assert.deepStrictEqual(t.properties.p2.type[0].name, 'number');
  });

  it('should use ? to set properties required attribute to false', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      properties: {
        'p1?': 'string'
      }
    }).embody();
    assert.deepStrictEqual(t.properties.p1.required, false);
  });

  it('should use ! to set properties required attribute to false', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      properties: {
        'p1!': 'string'
      }
    }).embody();
    assert.deepStrictEqual(t.properties.p1.required, true);
  });

  it('should clone', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      properties: {
        p1: 'string',
        p2: {
          type: 'number'
        }
      }
    }).embody();
    const t2 = t.clone();
    assert.deepStrictEqual(t, t2);
  });

  it('should generate validator', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object'
    }).embody();
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept objects', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object'
    }).embody();
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate(obj1), {valid: true, value: obj1});
    assert.strictEqual(validate(obj1).value, obj1);
    assert.throws(() => validate(''), /Value must be an object/);
    assert.throws(() => validate(false), /Value must be an object/);
    assert.throws(() => validate([]), /Value must be an object/);
  });

  it('should not allow additional properties if additionalProperties=false', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object',
      properties: properties1,
      additionalProperties: false
    });
    const validate = typ1.validator({throwOnError: true});
    assert.throws(() =>
            validate({...obj1, f: 'f'}),
        /No additional property \(f\) accepted./
    );
  });

  it('should allow additional properties if additionalProperties=true', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object',
      properties: properties1,
      additionalProperties: true
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.strictEqual(validate({...obj1, f: 'f'}).value.f, 'f');
  });

  it('should use regexp patterns as property names', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object',
      additionalProperties: false,
      properties: {
        '/a[\\d]/': 'string'
      }
    });
    const validate = typ1.validator({
      throwOnError: true,
      removeAdditional: true
    });
    assert.deepStrictEqual(
        validate({a1: 1, a2: 2, b1: 3}).value,
        {a1: 1, a2: 2});
  });

  it('should validate sub properties', function() {
    const typ1 = library.get({
      name: 'typ1',
      properties: {
        'id': {type: 'string', required: true},
        'name': 'string'
      }
    });
    const validate = typ1.validator({
      throwOnError: true,
      removeAdditional: true
    });
    assert.throws(() => validate({name: 'name'}), /Value required/);
  });

  it('should validate using discriminator', function() {
    const types = {
      Employee: {
        discriminator: 'kind',
        // discriminatorValue: 'Employee', // type name is default
        properties: {
          'name': 'string',
          'kind': 'string',
          'employeeId?': 'string'
        }
      }
    };
    library.onTypeLookup = (n) => types[n];
    const typ1 = library.get('Employee');
    const validate = typ1.validator({throwOnError: true});
    assert.throws(() =>
            validate({kind: 'User', name: 'name'}),
        /Value is not a type of "Employee"/);
    assert.throws(() => validate({name: 'name'}),
        /Value is not a type of "Employee"/);
    assert.deepStrictEqual(
        validate({
          kind: 'Employee',
          name: 'name',
          employeeId: 1
        }).value,
        {kind: 'Employee', name: 'name', employeeId: 1});
  });

  it('should find right object in union using discriminator', function() {
    const types = {
      Person: {
        type: 'object',
        discriminator: 'kind',
        properties: {
          name: 'string',
          kind: 'string'
        }
      },
      Employee: {
        type: 'Person',
        discriminatorValue: 'employee',
        properties: {
          employeeId: 'string'
        }
      },
      User: {
        type: 'Person',
        discriminatorValue: 'user',
        properties: {
          userId: 'string'
        }
      }
    };
    library.onTypeLookup = (n) => types[n];

    const typ1 = library.get({
      name: 'typ1',
      type: 'Employee',
      additionalProperties: false
    });
    const validate = typ1.validator({
      throwOnError: true
    });
    assert.throws(() => validate({kind: 'user', name: 'name'}),
        /Value is not a type of "employee"/);
    assert.throws(() => validate({name: 'name'}),
        /Value is not a type of "employee"/);
    assert.deepStrictEqual(
        validate({
          kind: 'employee',
          name: 'name',
          employeeId: 1
        }).value,
        {kind: 'employee', name: 'name', employeeId: 1});
  });

  it('should find right type using isTypeOf method', function() {
    const types = {
      Employee: {
        properties: {
          name: 'string',
          employeeId: 'string'
        }
      },
      User: {
        properties: {
          name: 'string',
          userId: 'string'
        }
      }
    };
    library.onTypeLookup = (n) => types[n];
    let ok = 0;
    const typ1 = library.get({
      name: 'typ1',
      type: 'Employee|User',
      isTypeOf: (v, t) => {
        ok = true;
        if (t.properties.userId)
          return !!v.userId;
        if (t.properties.employeeId)
          return !!v.employeeId;
      }
    });
    const validate = typ1.validator({
      throwOnError: true,
      removeAdditional: true
    });

    assert.deepStrictEqual(
        validate({
          name: 'name',
          employeeId: 1
        }).value,
        {name: 'name', employeeId: 1});
    assert(ok, 'isTypeOf is not triggered');

    ok = 0;
    assert.deepStrictEqual(
        validate({
          name: 'name',
          userId: 1
        }).value,
        {name: 'name', userId: 1});
    assert(ok, 'isTypeOf is not triggered');
  });

  it('should find right object using best match', function() {
    const types = {
      Person: {
        type: 'object',
        properties: {
          name: 'string'
        }
      },
      Employee: {
        properties: {
          employeeId: 'string',
          id: 'number'
        }
      },
      User: {
        properties: {
          userId: 'string',
          id: 'string'
        }
      }
    };
    library.onTypeLookup = (n) => types[n];

    const typ1 = library.get({
      name: 'typ1',
      type: '[Person, Employee|User]',
      additionalProperties: false
    });
    const validate = typ1.validator({
      throwOnError: true,
      coerceTypes: true
    });
    assert.deepStrictEqual(
        validate({userId: '1', name: 'name', id: 1}).value,
        {userId: '1', name: 'name', id: '1'});
    assert.deepStrictEqual(
        validate({employeeId: '1', name: 'name', id: '1'}).value,
        {employeeId: '1', name: 'name', id: 1});
  });

  it('should remove additional properties if removeAdditional=true', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object',
      properties: properties1
    });
    const validate = typ1.validator({
      throwOnError: true,
      removeAdditional: true
    });
    assert.deepStrictEqual(
        validate({...obj1, f: 'f'}).value,
        obj1);
  });

  it('should remove null properties if removeNull=true', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object',
      properties: properties1
    });
    const validate = typ1.validator({
      throwOnError: true,
      removeAdditional: true,
      removeNull: true
    });
    const _obj1 = {...obj1};
    delete _obj1.a;
    assert.deepStrictEqual(
        validate({..._obj1, a: null}).value,
        _obj1);
  });

  it('should validate minItems', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object',
      minProperties: 2
    });
    const validate = typ1.validator({throwOnError: true});
    validate({a: 1, b: 2});
    assert.throws(() => validate({a: 1}),
        /Minimum accepted properties is 2, actual 1/);
  });

  it('should validate maxProperties', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object',
      maxProperties: 1
    });
    const validate = typ1.validator({throwOnError: true});
    validate({a: 1});
    assert.throws(() => validate({a: 1, b: 2}),
        /Maximum accepted properties is 1, actual 2/);
  });

  it('should limit error count to maxObjectErrors', function() {
    const typ1 = library.get({
      properties: {
        a: 'number',
        b: 'number',
        c: 'number',
        d: 'number'
      }
    });
    const typ2 = library.get({
      type: 'object',
      properties: {
        x: 'string'
      },
      additionalProperties: false
    });
    let validate = typ1.validator({maxObjectErrors: 2});
    let x = validate({a: 'a', b: 'b', c: 'c'});
    assert.strictEqual(x.errors.length, 2);

    validate = typ2.validator({maxObjectErrors: 2});
    x = validate({a: 'a', b: 'b', c: 'c'});
    assert.strictEqual(x.errors.length, 2);
  });

  it('should allow recursive properties', function() {
    const typeLib = new TypeLibrary();
    typeLib.add({
      name: 'Node',
      properties: {
        parent: 'Node',
        items: 'Node[]'
      }
    });
    const t = typeLib.get('Node')
        .embody();
    assert.strictEqual(t.properties.parent, t);
    assert.strictEqual(t.properties.items.baseName, 'array');
    assert.strictEqual(t.properties.items.items, t);
    t.validator();
  });

  it('should flatten properties', function() {
    const typeLib = new TypeLibrary();
    typeLib.add({
      name: 'Resource',
      properties: {
        id: 'number'
      }
    });
    typeLib.add({
      name: 'Person',
      properties: {
        name: 'string',
        age: 'number'
      }
    });
    typeLib.add({
      name: 'User',
      type: ['Resource', 'Person'],
      additionalProperties: false,
      properties: {
        username: 'string'
      }
    });
    const t = typeLib.get({
      additionalProperties: false,
      properties: {
        user: 'User'
      }
    });
    let validate = t.validator({
      throwOnError: true,
      strictTypes: true,
      coerceTypes: true
    });
    const user = {
      id: 1,
      name: 'Alex',
      age: 21,
      username: 'alex'
    };
    const x = validate({user: user});
    assert.deepStrictEqual(x.value, {user: user});
  });

  it('should resolve promises if resolvePromises=true', async function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object'
    });
    const validate = typ1.validator({
      throwOnError: true,
      coerceTypes: true,
      resolvePromises: true
    });
    assert.deepStrictEqual(
        (await validate({
          a: {
            b: Promise.resolve(1)
          },
          c: Promise.resolve(2)
        })).value, {
          a: {
            b: 1
          }, c: 2
        });
  });

});
