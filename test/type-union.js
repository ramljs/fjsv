/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('UnionType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary({defaults: {throwOnError: true}});
  });

  it('should throw if "anyOf" value is not array', function() {
    assert.throws(() =>
        library.get({
          type: 'union',
          name: 'typ1',
          anyOf: 1
        }), /Schema error at typ1\.anyOf\. Value must be an array/);
  });

  it('should "anyOf" must have at least 2 values', function() {
    assert.throws(() =>
        library.get({
          type: 'union',
          name: 'typ1',
          anyOf: ['string']
        }), /Schema error at typ1\.anyOf\. Value must contain at least 2 items/);
  });

  it('should generate validator', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'union',
      anyOf: ['string', 'number']
    });
    const validate = typ1.compile();
    assert.strictEqual(typeof validate, 'function');
  });

  it('should mixin', function() {
    const types = {
      RequiredString: {
        type: 'string',
        required: true
      },
      LocalPhoneNumber: {
        type: 'string',
        pattern: '123\\d+'
      },
      CellularNumber: {
        type: 'string',
        pattern: '555\\d+'
      }
    };
    library.lookupSchema = (n) => types[n];
    library.get('RequiredString');
    library.get('LocalPhoneNumber');
    library.get('CellularNumber');

    const typ1 = library.get({
      name: 'typ1',
      type: '[RequiredString, LocalPhoneNumber|CellularNumber]',
      maxLength: 15
    });

    assert.strictEqual(typ1.typeName, 'union');
    assert.strictEqual(typ1.anyOf.length, 2);
    assert.deepStrictEqual(typ1.anyOf[0].pattern, [/123\d+/]);
    assert.strictEqual(typ1.anyOf[0].maxLength, 15);
  });

  it('should flatten nested unions to one', function() {
    const types = {
      Resource: {
        properties: {
          id: 'string'
        }
      },
      Patient: {
        type: ['Human|Animal']
      },
      Human: {
        properties: {
          firstName: 'string',
          lastName: 'string'
        }
      },
      Animal: {
        type: ['PetAnimal|WildAnimal']
      },
      PetAnimal: {
        properties: {
          name: 'string',
          owner: 'string'
        }
      },
      WildAnimal: {
        properties: {
          classification: 'string'
        }
      }
    };
    library.lookupSchema = (n) => types[n];

    const typ1 = library.get({
      name: 'typ1',
      type: '[Resource, Patient]',
      additionalProperties: false
    });
    assert.strictEqual(typ1.anyOf.length, 4);
    assert.strictEqual(typ1.anyOf[0].name, 'Bank');
    assert.strictEqual(typ1.anyOf[1].name, 'Employee');
    assert.strictEqual(typ1.anyOf[2].name, 'Company');
    assert.strictEqual(typ1.anyOf[3].name, 'Individual');
    const validate = typ1.compile();
    assert.strictEqual(typeof validate, 'function');
  });

});
