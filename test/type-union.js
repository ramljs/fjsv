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

  it('Union merge test - 1', function() {
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
      type: '[Resource, Patient]'
    });
    assert.strictEqual(typ1.anyOf.length, 3);
    assert.strictEqual(Object.keys(typ1.anyOf[0].properties).length, 3);
    assert(typ1.anyOf[0].properties.id);
    assert(typ1.anyOf[0].properties.firstName);
    assert(typ1.anyOf[0].properties.lastName);
    assert.strictEqual(Object.keys(typ1.anyOf[1].properties).length, 2);
    assert(typ1.anyOf[1].properties.id);
    assert(typ1.anyOf[1].properties.owner);
    assert.strictEqual(Object.keys(typ1.anyOf[2].properties).length, 2);
    assert(typ1.anyOf[2].properties.id);
    assert(typ1.anyOf[2].properties.classification);
  });

  it('Union merge test - 2', function() {
    const types = {
      Resource: {
        properties: {
          id: 'string'
        }
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
          owner: 'string'
        }
      },
      WildAnimal: {
        properties: {
          classification: 'string'
        }
      },
      StartLimit: {
        properties: {
          start: 'number'
        }
      },
      Pagination: {
        properties: {
          page: 'number'
        }
      }
    };
    library.lookupSchema = (n) => types[n];

    const typ1 = library.get({
      name: 'typ1',
      type: '[Resource, Human|Animal, StartLimit | Pagination]'
    });
    assert.strictEqual(typ1.anyOf.length, 6);
    assert.strictEqual(Object.keys(typ1.anyOf[0].properties).length, 4);
    assert(typ1.anyOf[0].properties.id);
    assert(typ1.anyOf[0].properties.firstName);
    assert(typ1.anyOf[0].properties.lastName);
    assert(typ1.anyOf[0].properties.start);

    assert.strictEqual(Object.keys(typ1.anyOf[1].properties).length, 3);
    assert(typ1.anyOf[1].properties.id);
    assert(typ1.anyOf[1].properties.owner);
    assert(typ1.anyOf[1].properties.start);

    assert.strictEqual(Object.keys(typ1.anyOf[2].properties).length, 3);
    assert(typ1.anyOf[2].properties.id);
    assert(typ1.anyOf[2].properties.classification);
    assert(typ1.anyOf[2].properties.start);

    assert.strictEqual(Object.keys(typ1.anyOf[3].properties).length, 4);
    assert(typ1.anyOf[3].properties.id);
    assert(typ1.anyOf[3].properties.firstName);
    assert(typ1.anyOf[3].properties.lastName);
    assert(typ1.anyOf[3].properties.page);

    assert.strictEqual(Object.keys(typ1.anyOf[4].properties).length, 3);
    assert(typ1.anyOf[4].properties.id);
    assert(typ1.anyOf[4].properties.owner);
    assert(typ1.anyOf[4].properties.page);

    assert.strictEqual(Object.keys(typ1.anyOf[5].properties).length, 3);
    assert(typ1.anyOf[5].properties.id);
    assert(typ1.anyOf[5].properties.classification);
    assert(typ1.anyOf[5].properties.page);
  });

});
