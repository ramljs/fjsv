/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, DateTimeType} = require('..');

describe('DateTimeType (rfc2616)', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary();
    library.register('date', DateTimeType);
  });

  it('should validate string formatted as rfc2616', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate('Sun Jan 02 2011 12:30:15 GMT+0200 (GMT+03:00)'), {
      valid: true,
      value: 'Sun Jan 02 2011 12:30:15 GMT+0200 (GMT+03:00)'
    });
  });

  it('should coerce string formatted as rfc2616', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(
        validate('Sun Jan 02 2011 12:30:15 GMT+0200 (GMT+03:00)'), {
          valid: true,
          value: new Date('Sun Jan 02 2011 12:30:15 GMT+0200 (GMT+03:00)').toString()
        });
  });

  it('should validate string formatted as YYYY-MM-DD', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate('2011-01-02'), {
      valid: true,
      value: '2011-01-02'
    });
  });

  it('should coerce string formatted as YYYY-MM-DD', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});

    assert.deepStrictEqual(validate('2011-01-02').value,
        new Date('2011-01-02T00:00:00Z').toString());
  });

  it('should validate string formatted as YYYY-MM-DDThh:mm', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30'), {
      valid: true,
      value: '2011-01-02T10:30'
    });
  });

  it('should coerce string formatted as YYYY-MM-DDThh:mm', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30').value,
        new Date('2011-01-02T10:30:00Z').toString());
  });

  it('should validate string formatted as YYYY-MM-DDThh:mm:ss', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30:15'), {
      valid: true,
      value: '2011-01-02T10:30:15'
    });
  });

  it('should coerce string formatted as YYYY-MM-DDThh:mm:ss', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30:15').value,
        new Date('2011-01-02T10:30:15Z').toString());
  });

  it('should validate string formatted as YYYY-MM-DDThh:mm:ss.SSS', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30:15.123'), {
      valid: true,
      value: '2011-01-02T10:30:15.123'
    });
  });

  it('should coerce string formatted as YYYY-MM-DDThh:mm:ss.SSS', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30:15.123').value,
        new Date('2011-01-02T10:30:15.123Z').toString());
  });

  it('should validate string formatted as YYYY-MM-DDThh:mm:ss.SSSZ', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30:15.123+03:00'), {
      valid: true,
      value: '2011-01-02T10:30:15.123+03:00'
    });
    assert.deepStrictEqual(validate('2011-01-02T10:30:15.123Z'), {
      valid: true,
      value: '2011-01-02T10:30:15.123Z'
    });
    assert.deepStrictEqual(validate('2011-01-02T10:30:15Z'), {
      valid: true,
      value: '2011-01-02T10:30:15Z'
    });
  });

  it('should coerce string formatted as YYYY-MM-DDThh:mm:ss.SSSZ', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30:15.123+03:00').value,
        new Date('2011-01-02T10:30:15.123+03:00').toString());
    assert.deepStrictEqual(validate('2011-01-02T10:30:15.123Z').value,
        new Date('2011-01-02T10:30:15.123Z').toString());
  });

  it('should validate Date instance', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true});
    const d1 = new Date();
    assert.deepStrictEqual(validate(d1), {valid: true, value: d1});
  });

  it('should validate Date instance', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    const d1 = new Date('2011-01-02T10:30:15.123Z');
    assert.deepStrictEqual(validate('2011-01-02T10:30:15.123Z').value,
        d1.toString());
  });

  it('should validator reject invalid rfc2616 values', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.throws(() => validate(0), /Value must be rfc2616 formatted string or Date instance/);
    assert.throws(() => validate(''), /Value must be rfc2616 formatted string or Date instance/);
    assert.throws(() => validate({}), /Value must be rfc2616 formatted string or Date instance/);
  });

  it('should coerce default value to rfc2616 type', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date',
      format: 'rfc2616',
      default: '2011-01-02'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30:15.123Z').value,
        new Date('2011-01-02T10:30:15.123Z').toString());
  });

  describe('fast-mode', function() {

    it('should validate string formatted as YYYY-MM-DD', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date',
        format: 'rfc2616'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      assert.deepStrictEqual(validate('2011-01-02'), {
        valid: true,
        value: '2011-01-02'
      });
    });

    it('should validate string formatted as YYYY-MM-DDThh:mm', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date',
        format: 'rfc2616'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      assert.deepStrictEqual(validate('2011-01-02T10:30'), {
        valid: true,
        value: '2011-01-02T10:30'
      });
    });

    it('should validate string formatted as YYYY-MM-DDThh:mm:ss', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date',
        format: 'rfc2616'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      assert.deepStrictEqual(validate('2011-01-02T10:30:15'), {
        valid: true,
        value: '2011-01-02T10:30:15'
      });
    });

    it('should validate string formatted as YYYY-MM-DDThh:mm:ss.SSS', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date',
        format: 'rfc2616'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      assert.deepStrictEqual(validate('2011-01-02T10:30:15.123'), {
        valid: true,
        value: '2011-01-02T10:30:15.123'
      });
    });

    it('should validate string formatted as YYYY-MM-DDThh:mm:ss.SSSZ', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date',
        format: 'rfc2616'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      assert.deepStrictEqual(validate('2011-01-02T10:30:15.123+03:00'), {
        valid: true,
        value: '2011-01-02T10:30:15.123+03:00'
      });
      assert.deepStrictEqual(validate('2011-01-02T10:30:15.123Z'), {
        valid: true,
        value: '2011-01-02T10:30:15.123Z'
      });
      assert.deepStrictEqual(validate('2011-01-02T10:30:15Z'), {
        valid: true,
        value: '2011-01-02T10:30:15Z'
      });
    });

    it('should validate Date instance', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date',
        format: 'rfc2616'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      const d1 = new Date();
      assert.deepStrictEqual(validate(d1), {valid: true, value: d1});
    });

    it('should validator reject invalid rfc2616 values', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date',
        format: 'rfc2616'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      assert.throws(() => validate(0), /Value must be rfc2616 formatted string or Date instance/);
      assert.throws(() => validate(''), /Value must be rfc2616 formatted string or Date instance/);
      assert.throws(() => validate({}), /Value must be rfc2616 formatted string or Date instance/);
    });

  });

});
