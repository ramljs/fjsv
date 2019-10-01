/* eslint-disable */
const assert = require('assert');
const {TypeLibrary, TimeOnlyType} = require('..');

describe('DateTimeType (time-only)', function() {

  let library;
  beforeEach(function() {
    library = new TypeLibrary();
    library.register('time-only', TimeOnlyType);
  });

  it('should not set "format" attribute', function() {
    const t = library.get({
      type: 'time-only',
      name: 'typ1',
      format: 'datetime'
    });
    assert.strictEqual(t.format, undefined);
    t.format = null;
    assert.strictEqual(t.format, undefined);
  });

  it('should validate string formatted as hh:mm', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'time-only'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate('13:14'), {
      valid: true,
      value: '13:14'
    });
  });

  it('should coerce string formatted as hh:mm', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'time-only'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('13:14'), {
      valid: true,
      value: '13:14:00'
    });
  });

  it('should validate string formatted as hh:mm:ss', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'time-only'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate('13:14:15'), {
      valid: true,
      value: '13:14:15'
    });
  });

  it('should coerce string formatted as hh:mm:ss', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'time-only'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('13:14:15'), {
      valid: true,
      value: '13:14:15'
    });
  });

  it('should validate string formatted as hh:mm:ss.SSS', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'time-only'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.deepStrictEqual(validate('13:14:15.123'), {
      valid: true,
      value: '13:14:15.123'
    });
  });

  it('should coerce string formatted as hh:mm:ss.SSS', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'time-only'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate('13:14:15.123'), {
      valid: true,
      value: '13:14:15.123'
    });
  });

  it('should validate Date instance', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'time-only'
    });
    const validate = typ1.validator({throwOnError: true});
    const d1 = new Date();
    assert.deepStrictEqual(validate(d1), {valid: true, value: d1});
  });

  it('should validate Date instance', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'time-only'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    const d1 = new Date('2019-09-30T19:34:40.668Z');
    assert.deepStrictEqual(validate(d1), {
      valid: true,
      value: '19:34:40.668'
    });
  });

  it('should validator reject invalid time-only values', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'time-only'
    });
    const validate = typ1.validator({throwOnError: true});
    assert.throws(() => validate('2011-02-30T10:30:15Z'), /Value must be time-only formatted string or Date instance/);
    assert.throws(() => validate(0), /Value must be time-only formatted string or Date instance/);
    assert.throws(() => validate(''), /Value must be time-only formatted string or Date instance/);
    assert.throws(() => validate({}), /Value must be time-only formatted string or Date instance/);
  });

  it('should coerce default value to time-only type', function() {
    const typ1 = library.get({
      name: 'typ1',
      type: 'time-only',
      default: '13:14'
    });
    const validate = typ1.validator({throwOnError: true, coerceTypes: true});
    assert.deepStrictEqual(validate(), {
      valid: true,
      value: '13:14:00'
    });
  });

  describe('fast-mode', function() {

    it('should validate string formatted as hh:mm', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'time-only'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      assert.deepStrictEqual(validate('13:14'), {
        valid: true,
        value: '13:14'
      });
    });

    it('should validate string formatted as hh:mm:ss', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'time-only'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      assert.deepStrictEqual(validate('13:14:15'), {
        valid: true,
        value: '13:14:15'
      });
    });

    it('should validate string formatted as hh:mm:ss.SSS', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'time-only'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      assert.deepStrictEqual(validate('13:14:15.123'), {
        valid: true,
        value: '13:14:15.123'
      });
    });

    it('should validate Date instance', function() {
      const typ1 = library.get({
        name: 'typ1',
        type: 'time-only'
      });
      const validate = typ1.validator({
        fastDateValidation: true,
        throwOnError: true
      });
      const d1 = new Date();
      assert.deepStrictEqual(validate(d1), {valid: true, value: d1});
    });

  });

});
