/* eslint-disable */
const assert = require('assert');
const valgen = require('..');

describe('RamlLibrary', function() {

  it('should create a type using name', function() {
    valgen.raml();
  });

  it('should create integer type', function() {
    const library = valgen.raml();
    let t = library.get('integer');
    assert.strictEqual(t.name, 'integer');
    const validate = t.compile({coerceTypes: true});
    assert.strictEqual(validate('1').value, 1);
  });

  it('should create file type', function() {
    const library = valgen.raml();
    let t = library.get('file');
    assert.strictEqual(t.name, 'file');
    const validate = t.compile({coerceTypes: true});
    assert.strictEqual(validate('RmlsZSBjb250ZW50').value, 'RmlsZSBjb250ZW50');
  });

  it('should create datetime type', function() {
    const library = valgen.raml();
    let t = library.get('datetime');
    assert.strictEqual(t.name, 'datetime');
    const validate = t.compile({coerceTypes: true});
    assert.strictEqual(validate('2011-01-02').value, '2011-01-02T00:00:00Z');
  });

  it('should create datetime-only type', function() {
    const library = valgen.raml();
    let t = library.get('datetime-only');
    assert.strictEqual(t.name, 'datetime-only');
    const validate = t.compile({coerceTypes: true});
    assert.strictEqual(validate('2011-01-02').value, '2011-01-02T00:00:00');
  });

  it('should create date-only type', function() {
    const library = valgen.raml();
    let t = library.get('date-only');
    assert.strictEqual(t.name, 'date-only');
    const validate = t.compile({coerceTypes: true});
    assert.strictEqual(validate('20110102').value, '2011-01-02');
  });

  it('should create time-only type', function() {
    const library = valgen.raml();
    let t = library.get('time-only');
    assert.strictEqual(t.name, 'time-only');
    const validate = t.compile({coerceTypes: true});
    assert.strictEqual(validate('103012.123').value, '10:30:12.123');
  });

  it('should create nil type', function() {
    const library = valgen.raml();
    let t = library.get('nil');
    assert.strictEqual(t.name, 'nil');
    const validate = t.compile({coerceTypes: true});
    assert.strictEqual(validate('1').value, undefined);
  });

});
