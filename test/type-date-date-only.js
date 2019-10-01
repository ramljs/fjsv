/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, DateOnlyType} = require('..');

describe('DateTimeType (date-only)', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary();
    library.register('date-only', DateOnlyType);
  });

  it('should not set "format" attribute', function() {
    const t = library.get({
      type: 'date-only',
      name: 'typ1',
      format: 'datetime'
    });
    assert.strictEqual(t.format, undefined);
    t.format = null;
    assert.strictEqual(t.format, undefined);
  });

  it('should validate string formatted as YYYY-MM-DD', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date-only'
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
      type: 'date-only'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('2011-01-02'), {
      valid: true,
      value: '2011-01-02'
    });
  });

  it('should validate string formatted as YYYY-MM-DDThh:mm', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date-only'
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
      type: 'date-only'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30'), {
      valid: true,
      value: '2011-01-02'
    });
  });

  it('should validate string formatted as YYYY-MM-DDThh:mm:ss', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date-only'
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
      type: 'date-only'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30:15'), {
      valid: true,
      value: '2011-01-02'
    });
  });

  it('should validate string formatted as YYYY-MM-DDThh:mm:ss.SSS', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date-only'
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
      type: 'date-only'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30:15.123'), {
      valid: true,
      value: '2011-01-02'
    });
  });

  it('should validate string formatted as YYYY-MM-DDThh:mm:ss.SSSZ', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date-only'
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
      type: 'date-only'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('2011-01-02T10:30:15.123+03:00'), {
      valid: true,
      value: '2011-01-02'
    });
    assert.deepStrictEqual(validate('2011-01-02T10:30:15.123Z'), {
      valid: true,
      value: '2011-01-02'
    });
    assert.deepStrictEqual(validate('2011-01-02T10:30:15Z'), {
      valid: true,
      value: '2011-01-02'
    });
  });

  it('should validate Date instance', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date-only'
    });
    const validate = typ1.validator({throwOnError: true});
    const d1 = new Date();
    assert.deepStrictEqual(validate(d1), {valid: true, value: d1});
  });

  it('should validate Date instance', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date-only'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    const d1 = new Date('2019-09-30T19:34:40.668Z');
    assert.deepStrictEqual(validate(d1), {
      valid: true,
      value: '2019-09-30'
    });
  });

  it('should validator reject invalid dates', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date-only'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.throws(() => validate('2011-02-30T10:30:15Z'),
        /Value must be date-only formatted string or Date instance/);
  });

  it('should validator reject invalid date-only values', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date-only'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.throws(() => validate(0), /Value must be date-only formatted string or Date instance/);
    assert.throws(() => validate(''), /Value must be date-only formatted string or Date instance/);
    assert.throws(() => validate({}), /Value must be date-only formatted string or Date instance/);
  });

  it('should coerce default value to date-only type', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date-only',
      default: '2011-01-02'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate(), {
      valid: true,
      value: '2011-01-02'
    });
  });

  it('should convert formatted string to Date instance', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'date-only'
    });
    const validate = typ1.validator({throwOnError: true, convertDates: true});
    assert.deepStrictEqual(
        validate('2011-01-02T13:30:15.123Z'), {
          valid: true,
          value: new Date('2011-01-02T00:00:00Z')
        });
  });

  describe('fast-mode', function() {

    it('should validate string formatted as YYYY-MM-DD', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date-only'
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
        type: 'date-only'
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
        type: 'date-only'
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
        type: 'date-only'
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
        type: 'date-only'
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
        type: 'date-only'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      const d1 = new Date();
      assert.deepStrictEqual(validate(d1), {valid: true, value: d1});
    });

    it('should validator reject invalid dates', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date-only'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      assert.throws(() => validate('2011-02-30T10:30:15Z'), /Value must be date-only formatted string or Date instance/);
    });

    it('should validator reject invalid date-only values', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date-only'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      assert.throws(() => validate(0), /Value must be date-only formatted string or Date instance/);
      assert.throws(() => validate(''), /Value must be date-only formatted string or Date instance/);
      assert.throws(() => validate({}), /Value must be date-only formatted string or Date instance/);
    });

  });

  describe('strice-mode', function() {

    it('should reject string formatted as YYYY-MM-DDThh:mm', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date-only'
      });
      const validate = typ1.validator({
        strictTypes: true,
        throwOnError: true
      });
      assert.throws(() => validate('2011-01-02T10:30'),
          /Value must be date-only formatted string or Date instance/);
    });

    it('should reject string formatted as YYYY-MM-DDThh:mm:ss', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date-only'
      });
      const validate = typ1.validator({
        strictTypes: true,
        throwOnError: true
      });
      assert.throws(() => validate('2011-01-02T10:30:15'),
          /Value must be date-only formatted string or Date instance/);
    });

    it('should reject string formatted as YYYY-MM-DDThh:mm:ss.SSS', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date-only'
      });
      const validate = typ1.validator({
        strictTypes: true,
        throwOnError: true
      });
      assert.throws(() => validate('2011-01-02T10:30:15.123'),
          /Value must be date-only formatted string or Date instance/);
    });

    it('should reject string formatted as YYYY-MM-DDThh:mm:ss.SSSZ', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'date-only'
      });
      const validate = typ1.validator({
        strictTypes: true,
        throwOnError: true
      });
      assert.throws(() => validate('2011-01-02T10:30:15.123+03:00'),
          /Value must be date-only formatted string or Date instance/);

      assert.throws(() => validate('2011-01-02T10:30:15.123Z'),
          /Value must be date-only formatted string or Date instance/);
    });

  });

});
