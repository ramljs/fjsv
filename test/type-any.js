/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('AnyType', function() {
return;
  const library = new TypeLibrary({typeSet: 'RAML_1_0'});

  it('should assign default facets', function() {
    let typ1 = library.get({
      type: 'any',
      name: 'typ1',
      required: true,
      default: 0
    });
    assert.strictEqual(typ1.name, 'typ1');
    assert.strictEqual(typ1.baseType, 'any');
    assert.strictEqual(typ1.required, true);
    assert.strictEqual(typ1.default, 0);
  });

  it('should use default value if given value is null', function() {
    const typ1 = library.create({
      name: 'typ1',
      type: 'any',
      required: true,
      default: 123
    });
    const validate = typ1.validator();
    assert.strictEqual(validate(null).value, 123);
  });

  it('should not validate null value if required=true', function() {
    const typ1 = library.create({
      name: 'typ1',
      type: 'any',
      required: true
    });
    const validate = typ1.validator({throwOnError: true});
    assert.strictEqual(validate(0).value, 0);
    assert.strictEqual(validate('0').value, '0');
    assert.throws(() => validate(), /Value required/);
    assert.throws(() => validate(null), /Value required/);
  });

  it('should return "errors" property on error', function() {
    const typ1 = library.create({
      name: 'typ1',
      type: 'any',
      required: true
    });
    const validate = typ1.validator();
    assert.deepStrictEqual(validate(), {
      valid: false,
      errors: [{
        errorType: 'value-required',
        message: 'Value required for typ1',
        path: 'typ1'
      }]
    });
  });

  it('should types inherit from compatible types', function() {
    library.add({
      name: 'bool1',
      type: 'boolean'
    });
    library.create({
      name: 'typ1',
      type: ['boolean', 'bool1']
    });
    library.create({
      name: 'typ1',
      type: ['bool1', 'boolean']
    });
  });

  it('should not mix different primitives', function() {
    const tryType = (x) => {
      try {
        library.create({
          name: 'typ1',
          type: ['boolean', x]
        });
      } catch (e) {
        assert.strictEqual(e.message,
            'Can\'t mix "boolean" (typ1) with "' + x + '" type.');
      }
    };
    ['any', 'number', 'integer', 'string', 'object', 'datetime']
        .forEach(tryType);
  });

});
