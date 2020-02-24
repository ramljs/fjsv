/* eslint-disable */
const assert = require('assert');
const {Valgen} = require('..');

describe('ObjectFactory', function() {

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
    library = new Valgen({throwOnError: true});
  });

  it('should create ObjectFactory instance', function() {
    let t = library.getType({
      type: 'object',
      name: 'typ1',
      other: 123
    });
    assert.strictEqual(t.name, 'typ1');
    assert.strictEqual(t.typeName, 'object');
    assert.strictEqual(t.get('other'), undefined);
  });

  it('should create object type if there is {} after type name', function() {
    const t = library.getType({
      type: 'string{}'
    });
    assert.deepStrictEqual(t.typeName, 'object');
    assert.deepStrictEqual(t.get('additionalProperties'), 'string');
  });

  it('should set "discriminator" attribute', function() {
    const t = library.getType({
      type: 'object',
      name: 'typ1',
      discriminator: 'kind'
    });
    assert.deepStrictEqual(t.get('discriminator'), 'kind');
  });

  it('should set "discriminatorValue" attribute', function() {
    const t = library.getType({
      type: 'object',
      name: 'typ1',
      discriminator: 'kind',
      discriminatorValue: 'abc'
    });
    assert.deepStrictEqual(t.get('discriminatorValue'), 'abc');
  });

  it('should set "additionalProperties" attribute', function() {
    const t = library.getType({
      type: 'object',
      name: 'typ1',
      additionalProperties: false
    });
    assert.deepStrictEqual(t.get('additionalProperties'), false);
  });

  it('should set "minProperties" attribute', function() {
    const t = library.getType({
      type: 'object',
      name: 'typ1',
      minProperties: 0
    });
    assert.deepStrictEqual(t.get('minProperties'), 0);
  });

  it('should throw if "minProperties" value is not valid', function() {
    assert.throws(() =>
        library.getType({
          type: 'object',
          name: 'typ1',
          minProperties: 'abcd'
        }), /Schema error at typ1\.minProperties\. "abcd" is not a valid integer value/);
  });

  it('should set "maxProperties" attribute', function() {
    const t = library.getType({
      type: 'object',
      name: 'typ1',
      maxProperties: 0
    });
    assert.deepStrictEqual(t.get('maxProperties'), 0);
  });

  it('should throw if "maxProperties" value is not valid', function() {
    assert.throws(() =>
        library.getType({
          type: 'object',
          name: 'typ1',
          maxProperties: 'abcd'
        }), /Schema error at typ1\.maxProperties\. "abcd" is not a valid integer value/);
  });

  it('should set "isTypeOf" attribute', function() {
    const t = library.getType({
      type: 'object',
      name: 'typ1',
      isTypeOf: () => true
    });
    assert.deepStrictEqual(typeof t.get('isTypeOf'), 'function');
  });

  it('should throw if "isTypeOf" value is not a function', function() {
    assert.throws(() =>
        library.getType({
          type: 'object',
          name: 'typ1',
          isTypeOf: 'abcd'
        }), /Schema error at typ1\.isTypeOf\. Value must be a Function/);
  });

  it('should set "properties" attribute', function() {
    library.addSchema('PersonName', {
      type: 'string'
    });
    library.addSchema('PersonAge', {
      type: 'number'
    });
    const t = library.getType({
      type: 'object',
      name: 'typ1',
      properties: {
        'p1!': 'PersonName',
        p2: {
          type: 'PersonAge'
        }
      }
    });

    assert.strictEqual(t.get('properties.p1').propertyName, 'p1');
    assert.strictEqual(t.get('properties.p1'), t.properties.p1);
    assert.strictEqual(t.properties.p1.propertyName, 'p1');
    assert.strictEqual(t.properties.p1.typeName, 'string');
    assert.strictEqual(t.properties.p1.required, true);
    assert.strictEqual(t.properties.p2.typeName, 'number');
  });

  it('should use ? to set properties required attribute to false', function() {
    const t = library.getType({
      type: 'object',
      name: 'typ1',
      properties: {
        'p1?': 'string',
        'p2!': 'string'
      }
    });
    assert.deepStrictEqual(t.properties.p1.required, false);
    assert.deepStrictEqual(t.properties.p2.required, true);
  });

  it('should use ! to set properties required attribute to false', function() {
    const t = library.getType({
      type: 'object',
      name: 'typ1',
      properties: {
        'p1!': 'string'
      }
    });
    assert.deepStrictEqual(t.properties.p1.required, true);
  });

  it('should use propertiesRequired default value', function() {
    let t = library.getType({
      type: 'object',
      name: 'typ1',
      properties: {
        'id': 'string'
      }
    });
    let validate = t.generate();
    assert.throws(() => validate({}), /Error at "id"\. Value required/);

    library.setOption('object.required', true);
    t = library.getType({
      type: 'object',
      name: 'typ1',
      properties: {
        'id': 'string'
      }
    });
    validate = t.generate();
    assert.throws(() => validate({}), /Error at "id"\. Value required/);

    library.setOption('object.required', false);
    t = library.getType({
      type: 'object',
      name: 'typ1',
      properties: {
        'id': 'string'
      }
    });
    validate = t.generate();
    validate({});

    library.setOption('object.required', undefined);
  });

  it('should generate validator', function() {
    const validate = library.generate('object');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept objects', function() {
    const validate = library.generate('object', {coerceTypes: true});
    assert.deepStrictEqual(validate(obj1), {valid: true, value: obj1});
    assert.strictEqual(validate(obj1).value, obj1);
    assert.throws(() => validate(''), /Value must be an object/);
    assert.throws(() => validate(false), /Value must be an object/);
    assert.throws(() => validate([]), /Value must be an object/);
  });

  it('should not allow additional properties if additionalProperties=false', function() {
    let validate = library.generate({
      properties: properties1,
      additionalProperties: false
    });
    assert.throws(() =>
            validate({...obj1, f: 'f'}),
        /Additional property "f" is not allowed/
    );
    library.setOption('object.additionalProperties', false);
    validate = library.generate({
      properties: properties1
    });
    assert.throws(() =>
            validate({...obj1, f: 'f'}),
        /Additional property "f" is not allowed/
    );
    library.setOption('object.additionalProperties', undefined);
  });

  it('should allow additional properties if additionalProperties=true', function() {
    let validate = library.generate({
      properties: properties1,
      additionalProperties: true
    }, {coerceTypes: true});
    assert.strictEqual(
        validate({...obj1, f: 'f'}).value.f, 'f');

    library.setOption('object.additionalProperties', true);
    validate = library.generate({
      properties: properties1,
      additionalProperties: true
    }, {coerceTypes: true});
    assert.strictEqual(
        validate({...obj1, f: 'f'}).value.f, 'f');

    library.setOption('object.additionalProperties', undefined);
  });

  it('should use a type name for additionalProperties', function() {
    let validate = library.generate({
      properties: properties1,
      additionalProperties: 'string'
    });
    assert.throws(() =>
            validate({a: 1, f: 'f', g: 1}),
        /Additional property "g" is not allowed/
    );
    validate = library.generate({
      properties: properties1,
      additionalProperties: 'string'
    }, {coerceTypes: true});
    assert.throws(() =>
            validate({a: 1, f: 'f', g: 1}),
        /Additional property "g" is not allowed/
    );
  });

  it('should use regexp patterns as property names', function() {
    const validate = library.generate({
      additionalProperties: false,
      properties: {
        '/a[\\d]/': 'string'
      }
    }, {removeAdditional: true});
    assert.deepStrictEqual(
        validate({a1: 1, a2: 2, b1: 3}).value,
        {a1: 1, a2: 2});
  });

  it('should validate required properties', function() {
    const validate = library.generate({
      properties: {
        'id': {type: 'string', required: true},
        'name': 'string'
      }
    });
    assert.throws(() => validate({name: 'name'}), /Error at "id"\. Value required/);
  });

  it('should validate required properties by operation', function() {
    let validate = library.generate({
      properties: {
        'id': {type: 'string', required: 'post,delete'},
        'name': 'string'
      }
    }, {operation: 'get'});
    validate({name: 'name'});

    validate = library.generate({
      properties: {
        'id': {type: 'string', required: 'post,delete'},
        'name': 'string'
      }
    }, {operation: 'post'});
    assert.throws(() => validate({name: 'name'}), / Error at "id"\. Value required/);

    validate = library.generate({
      properties: {
        'id': {type: 'string', required: 'post,delete'},
        'name': 'string'
      }
    }, {operation: 'delete'});
    assert.throws(() => validate({name: 'name'}), /Error at "id"\. Value required./);
  });

  it('should validate sub properties', function() {
    const validate = library.generate({
      properties: {
        'id': {type: 'string', pattern: '\\d+'},
        'name': 'string'
      }
    });
    assert.throws(() => validate({id: 'abc'}), /Value does not match required format/);
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
    library.schemaLookup = (n) => types[n];

    const validate = library.generate('Employee');
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

  it('should remove additional properties if removeAdditional=true', function() {
    const validate = library.generate({
      properties: properties1
    }, {removeAdditional: true});
    assert.deepStrictEqual(
        validate({...obj1, f: 'f'}).value,
        obj1);
  });

  it('should remove null properties if removeNull=true', function() {
    const validate = library.generate({
      properties: properties1
    }, {removeNull: true});
    const _obj1 = {...obj1};
    delete _obj1.a;
    assert.deepStrictEqual(
        validate({..._obj1, a: null}).value,
        _obj1);
  });

  it('should validate minItems', function() {
    const validate = library.generate({
      type: 'object',
      minProperties: 2
    });
    validate({a: 1, b: 2});
    assert.throws(() => validate({a: 1}),
        /Minimum accepted properties is 2, actual 1/);
  });

  it('should validate maxProperties', function() {
    const validate = library.generate({
      type: 'object',
      maxProperties: 1
    });
    validate({a: 1});
    assert.throws(() => validate({a: 1, b: 2}),
        /Maximum allowed properties is 1, actual 2/);
  });

  it('should limit error count to maxObjectErrors', function() {
    let validate = library.generate({
      properties: {
        a: 'number',
        b: 'number',
        c: 'number',
        d: 'number'
      }
    }, {maxObjectErrors: 2, throwOnError: false});
    let x = validate({a: 'a', b: 'b', c: 'c'});
    assert.strictEqual(x.errors.length, 2);

    validate = library.generate({
      type: 'object',
      properties: {
        x: 'string'
      },
      additionalProperties: false
    }, {maxObjectErrors: 2, throwOnError: false});
    x = validate({a: 'a', b: 'b', c: 'c'});
    assert.strictEqual(x.errors.length, 2);
  });

  it('should allow recursive properties', function() {
    library.addSchema({
      name: 'Node',
      properties: {
        id: 'number',
        parent: {type: 'Node', required: false}
      }
    });
    const t = library.getType('Node');
    const validate = t.generate({coerceTypes: true});
    const o = {
      id: 1,
      parent: {
        id: 2
      }
    };
    assert.deepStrictEqual(validate(o).value, o);
  });

  it('should allow circular referencing in properties', function() {
    library.addSchema({
      name: 'Node',
      type: 'Element',
      properties: {
        id: 'number'
      }
    });
    library.addSchema({
      name: 'Element',
      properties: {
        tag: {type: 'Node', required: false}
      }
    });
    const t = library.getType('Node');
    const validate = t.generate();
    const o = {
      id: 1,
      parent: {
        id: 2
      }
    };
    assert.deepStrictEqual(validate(o).value, o);
  });

  it('should resolve promises if resolvePromises=true', async function() {
    const validate = library.generate('object', {
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

  it('should find validate object using discriminator', function() {
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
      }
    };
    library.schemaLookup = (n) => types[n];

    const validate = library.generate({
      type: 'Employee',
      additionalProperties: false,
      coerceTypes: true
    });
    assert.throws(() =>
            validate({kind: 'user', name: 'name'}),
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

  it('should find right union type using discriminator', function() {
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
          name: 'string',
          userId: 'string'
        }
      }
    };
    library.schemaLookup = (n) => types[n];

    const validate = library.generate({
      type: 'Employee|User',
      additionalProperties: false
    }, {coerceTypes: true});
    assert.throws(() => validate({name: 'name'}),
        /Value does not match any of expected types/);
    assert.throws(() =>
            validate({kind: 'user', name: 'name'}),
        /Error at "userId". Value required./);
    assert.deepEqual(
        validate({
          kind: 'employee',
          name: 'name',
          employeeId: '1'
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
    library.schemaLookup = (n) => types[n];
    let ok = 0;
    const validate = library.generate({
      type: 'Employee|User',
      isTypeOf: (v, t) => {
        ok = true;
        if (t.get('properties.userId'))
          return !!v.userId;
        if (t.get('properties.employeeId'))
          return !!v.employeeId;
      }
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

});
