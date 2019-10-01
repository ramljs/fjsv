/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, NilType} = require('..');

describe('NilType', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary();
    library.register('nil', NilType);
  });
  
  it('should not set "default" attribute', function() {
    const t = library.get({
      type: 'nil',
      name: 'typ1',
      default: 1
    });
    assert.strictEqual(t.default, undefined);
    t.default = null;
    assert.strictEqual(t.default, undefined);
  });

  it('should not set "required" attribute', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const t = library.get({
      type: 'nil',
      name: 'typ1',
      required: 1
    });
    assert.strictEqual(t.required, undefined);
    t.required = null;
    assert.strictEqual(t.required, undefined);
  });

  it('should generate validator', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const typ1 = library.get({
      name: 'typ1',
      type: 'nil'
    });
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validator accept null and undefined', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const typ1 = library.get({
      name: 'typ1',
      type: 'nil'
    });
    const validate = typ1.validator({throwOnError: true});
    validate(null);
    validate();
    assert.throws(() => validate(0), /Value must be null/);
    assert.throws(() => validate(''), /Value must be null/);
  });

  it('should coerce value to integer', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const typ1 = library.get({
      name: 'typ1',
      type: 'nil'
    });
    const validate = typ1.validator({coerceTypes: true});
    assert.deepStrictEqual(validate(null), {valid: true, value: null});
    assert.deepStrictEqual(validate(undefined), {valid: true, value: null});
  });

});
