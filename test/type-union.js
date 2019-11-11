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
    const anyOf = typ1.getAttribute('anyOf');
    assert.strictEqual(anyOf.length, 2);
    assert.deepStrictEqual(anyOf[0].getAttribute('pattern'), ['123\\d+']);
    assert.strictEqual(anyOf[0].getAttribute('maxLength'), 15);
  });

  it('should flatten nested unions to one', function() {
    const types = {
      Company: {
        properties: {
          companyId: 'string'
        }
      },
      Individual: {
        properties: {
          IndividualId: 'string'
        }
      },
      Customer: {
        type: ['Company|Individual']
      },
      Employee: {
        properties: {
          employeeId: 'string'
        }
      },
      Bank: {
        properties: {
          bankId: 'string'
        }
      }
    };
    library.lookupSchema = (n) => types[n];

    const typ1 = library.get({
      name: 'typ1',
      type: '[Bank|Employee|Customer]',
      additionalProperties: false
    });
    const x = typ1.flatten();
    assert(x instanceof UnionType, 'x is not UnionType');
    assert.strictEqual(x.anyOf.length, 4);
    assert.strictEqual(x.anyOf[0].name, 'Bank');
    assert.strictEqual(x.anyOf[1].name, 'Employee');
    assert.strictEqual(x.anyOf[2].name, 'Company');
    assert.strictEqual(x.anyOf[3].name, 'Individual');
    const validate = typ1.compile();
    assert.strictEqual(typeof validate, 'function');
  });

});
