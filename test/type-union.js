/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, UnionType} = require('..');

describe('UnionType', function() {

  let library;

  beforeEach(function() {
    library = new TypeLibrary();
  });

  it('should throw if "anyOf" value is not array', function() {
    assert.throws(() =>
        library.get({
          type: 'union',
          name: 'typ1',
          anyOf: 1
        }), /Array type required for "anyOf" attribute/);
  });

  it('should "anyOf" must have at least 2 values', function() {
    assert.throws(() =>
        library.get({
          type: 'union',
          name: 'typ1',
          anyOf: ['string']
        }), /"anyOf" attribute must contain at least 2 items/);
  });

  it('should generate validator', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'union',
      anyOf: ['string', 'number']
    });
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
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
    library.onTypeLookup = (n) => types[n];

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
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

});
