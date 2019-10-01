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
    });
    assert.deepStrictEqual(t.properties.p1.name, 'p1');
    assert.deepStrictEqual(t.properties.p1.type[0].name, 'string');
    assert.deepStrictEqual(t.properties.p2.name, 'p2');
    assert.deepStrictEqual(t.properties.p2.type[0].name, 'number');
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
    });
    assert.deepStrictEqual(t.properties.p1.name, 'p1');
    assert.deepStrictEqual(t.properties.p1.type[0].name, 'string');
    assert.deepStrictEqual(t.properties.p2.name, 'p2');
    assert.deepStrictEqual(t.properties.p2.type[0].name, 'number');
  });

  it('should bulk add properties using addProperties(object) method', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1'
    });
    t.addProperties({
      p1: 'string',
      p2: {
        type: 'number'
      }
    });
    assert.deepStrictEqual(t.properties.p1.name, 'p1');
    assert.deepStrictEqual(t.properties.p1.type[0].name, 'string');
    assert.deepStrictEqual(t.properties.p2.name, 'p2');
    assert.deepStrictEqual(t.properties.p2.type[0].name, 'number');
  });

  it('should bulk add properties using addProperties(array) method', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1'
    });
    t.addProperties([
      {name: 'p1', type: 'string'},
      {name: 'p2', type: 'number'}
    ]);
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
    });
    assert.deepStrictEqual(t.properties.p1.required, false);
  });

  it('should use ! to set properties required attribute to false', function() {
    const t = library.get({
      type: 'object',
      name: 'typ1',
      properties: {
        'p1!': 'string'
      }
    });
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
    });
    const t2 = t.clone();
    assert.deepStrictEqual(t, t2);
  });


  it('should generate validator', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object'
    });
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept objects', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object'
    });
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
        /typ1 does not allow additional property/
    );
  });

  it('should allow additional properties if additionalProperties=true', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'object',
      properties: properties1,
      additionalProperties: true
    });
    const validate = typ1.validator({throwOnError: true});
    validate({...obj1, f: 'f'});
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
        /Object`s discriminator property \(kind\) does not match to "employee"/);
    assert.throws(() => validate({name: 'name'}),
        /Object`s discriminator property \(kind\) does not match to "employee"/);
    assert.deepStrictEqual(
        validate({
          kind: 'employee',
          name: 'name',
          employeeId: 1
        }).value,
        {kind: 'employee', name: 'name', employeeId: 1});
  });
return;
  it('should find right type using isTypeOf method', function() {
    const types = {
      Employee: {
        properties: {
          name: 'string',
          kind: 'string',
          employeeId: 'string'
        }
      },
      User:{
        properties: {
          name: 'string',
          kind: 'string',
          userId: 'string'
        }
      }
    };
    library.onTypeLookup = (n) => types[n];

    const typ1 = library.get({
      name: 'typ1',
      type: library.get({
        type: 'union',
        anyOf: ['Employee', 'User']
      }), isTypeOf: (v, t) => {
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

    assert.deepStrictEqual(
        validate({
          name: 'name',
          userId: 1
        }).value,
        {name: 'name', userId: 1});
  });


  return;

  it('should remove additional properties if removeAdditional=true', function() {
    const typ1 = library.create({
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


  it('should create object type by adding {} after type name', function() {
    const prm1 = library.create({
      name: 'prm1',
      type: 'string{}'
    });
    const obj = {a: 1, b: 2, c: 3};
    const validate = prm1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate(obj), {
      valid: true,
      value: {a: '1', b: '2', c: '3'}
    });
  });

});
