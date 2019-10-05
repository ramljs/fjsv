/* eslint-disable */
const assert = require('assert');
const {TypeLibrary} = require('..');

describe('DataType', function() {

  it('should assign attributes', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    let t = library.get({
      type: 'any',
      name: 'typ1',
      required: true,
      default: 0,
      readonly: true,
      writeonly: true
    });
    assert.strictEqual(t.name, 'typ1');
    assert.strictEqual(t.type[0], 'any');
    assert.strictEqual(t.required, true);
    assert.strictEqual(t.default, 0);
    assert.strictEqual(t.readonly, true);
    assert.strictEqual(t.writeonly, true);
  });

  it('should set "name" attribute', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const t = library.get({
      type: 'any',
      name: 'typ1',
      required: 1
    });
    assert.strictEqual(t.name, 'typ1');
    t.name = null;
    assert.strictEqual(t.name, null);
    t.name = 'typ2';
    assert.strictEqual(t.name, 'typ2');
  });

  it('should set "required" attribute', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const t = library.get({
      type: 'any',
      name: 'typ1',
      required: 1
    });
    assert.strictEqual(t.required, true);
    t.required = 0;
    assert.strictEqual(t.required, false);
    t.required = null;
    assert.strictEqual(t.required, null);
    t.required = undefined;
    assert.strictEqual(t.required, undefined);
  });

  it('should set "readonly" attribute', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const t = library.get({
      type: 'any',
      name: 'typ1',
      readonly: 1
    });
    assert.strictEqual(t.readonly, true);
    t.readonly = 0;
    assert.strictEqual(t.readonly, false);
    t.readonly = null;
    assert.strictEqual(t.readonly, null);
    t.readonly = undefined;
    assert.strictEqual(t.readonly, undefined);
  });

  it('should set "writeonly" attribute', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const t = library.get({
      type: 'any',
      name: 'typ1',
      writeonly: 1
    });
    assert.strictEqual(t.writeonly, true);
    t.writeonly = 0;
    assert.strictEqual(t.writeonly, false);
    t.writeonly = null;
    assert.strictEqual(t.writeonly, null);
    t.writeonly = undefined;
    assert.strictEqual(t.writeonly, undefined);
  });

  it('should clone', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const t = library.get({
      type: 'any',
      name: 'typ1',
      writeonly: 1
    });
    const t2 = t.clone();
    assert.deepStrictEqual(t, t2);
  });

  it('should flatten() return cloned DataType', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const t = library.get('string');
    const t2 = t.flatten();
    assert.notStrictEqual(t, t2);
  });

  it('should generate validator', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const typ1 = library.get({
      name: 'typ1',
      type: 'any'
    });
    const validate = typ1.validator();
    assert.strictEqual(typeof validate, 'function');
  });

  it('should use default if value is null', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const typ1 = library.get({
      name: 'typ1',
      type: 'any',
      default: 123
    });
    const validate = typ1.validator();
    assert.strictEqual(validate(null).value, 123);
  });

  it('should return error if value is null and required is true', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const typ1 = library.get({
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

  it('should ignore required validation if ignoreRequire=true', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const typ1 = library.get({
      name: 'typ1',
      type: 'any',
      required: true
    });
    const validate = typ1.validator({throwOnError: true, ignoreRequire: true});
    assert.strictEqual(validate(0).value, 0);
    assert.strictEqual(validate('0').value, '0');
    assert.strictEqual(
        validate().value, undefined);
    assert.strictEqual(validate(null).value, null);
  });

  it('should return "errors" property on error', function() {
    const library = new TypeLibrary({typeSet: 'RAML_1_0'});
    const typ1 = library.get({
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

  it('should throw error on validator generation if types have different primitives', function() {
    const tryType = (x) => {
      try {
        const library = new TypeLibrary({typeSet: 'RAML_1_0'});
        const t = library.get({
          name: 'typ1',
          type: ['boolean', x]
        });
        t.validator();
      } catch (e) {
        assert.strictEqual(e.message,
            `Can't mix "boolean" (typ1) with "${x}" (${x}) type.`);
        return;
      }
      assert(0, 'Failed');
    };
    ['any', 'number', 'integer', 'string', 'object', 'datetime']
        .forEach(tryType);
  });

});
