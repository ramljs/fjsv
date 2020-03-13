const assert = require('assert');
const {Valgen} = require('..');

describe('UnionFactory', function() {

  let library;
  beforeEach(function() {
    library = new Valgen({throwOnError: true});
  });

  it('should throw if "anyOf" value is not array', function() {
    assert.throws(() =>
        library.getType({
          name: 'typ1',
          anyOf: 1
        }), /Schema error at typ1\.anyOf\. Value must be an array/);
  });

  it('should "anyOf" must have at least 2 values', function() {
    assert.throws(() =>
        library.getType({
          type: 'union',
          name: 'typ1',
          anyOf: ['string']
        }), /Schema error at typ1\.anyOf\. Value must contain at least 2 items/);
  });

  it('should generate validator', function() {
    const typ1 = library.getType({
      name: 'typ1',
      type: 'union',
      anyOf: ['string', 'number']
    });
    const validate = typ1.generate();
    assert.strictEqual(typeof validate, 'function');
  });

});
