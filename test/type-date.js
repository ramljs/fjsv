const assert = require('assert');
const {Valgen, DateFactory} = require('..');

describe('DateFactory', function() {

  let library;
  beforeEach(function() {
    library = new Valgen({throwOnError: true});
    library.define('date', new DateFactory());
  });

  it('should create DateFactory instance', function() {
    let t = library.getType({
      type: 'date',
      name: 'typ1'
    });
    assert.strictEqual(t.name, 'typ1');
    assert.strictEqual(t.typeName, 'date');
  });

  it('should set "default" attribute', function() {
    let t = library.getType({
      type: 'date',
      name: 'typ1',
      default: '2001-02-03T08:30:15'
    });
    assert.strictEqual(t.get('default'), '2001-02-03T08:30:15');

    const d = new Date();
    t = library.getType({
      type: 'date',
      name: 'typ1',
      default: d
    });
    assert.deepStrictEqual(t.get('default'), d);
  });

  it('should throw if "default" value is not valid', function() {
    assert.throws(() =>
        library.generate({
          type: 'date',
          name: 'typ1',
          default: {}
        }), /Schema error at typ1\.default\. "\[object Object]" is not a string or Date instance/);
  });

  it('should not set "enum" attribute', function() {
    const t = library.getType({
      type: 'date',
      name: 'typ1',
      enum: [1, 2, '3'],
      other: 123
    });
    assert.deepStrictEqual(t.get('enum'), undefined);
    assert.deepStrictEqual(t.get('other'), undefined);
  });

  it('should set "format" attribute', function() {
    const t = library.getType({
      type: 'date',
      name: 'typ1',
      format: 'time'
    });
    assert.strictEqual(t.get('format'), 'time');
  });

  it('should throw if "format" value is not valid', function() {
    assert.throws(() =>
        library.getType({
          type: 'date',
          name: 'typ1',
          format: 'abcd'
        }), /Unknown date format \(abcd\)/);
  });

  it('should generate validator', function() {
    const validate = library.generate('date');
    assert.strictEqual(typeof validate, 'function');
  });

  it('should validate "timestamp" format', function() {
    const validate = library.generate({type: 'date', format: 'timestamp'});
    validate('2011');
    validate('20110102');
    validate('2011-01-02');
    validate('2011-01-02T10:30');
    validate('201101021030');
    validate('2011-01-02T10:30:15');
    validate('2011-01-02T10:30:15.123');
    validate('20110102103015.123');
    validate('2011-01-02T10:30:15.123+03:00');
    validate('2011-01-02T10:30:15.123Z');
    validate('2011-01-02T10:30:15Z');
    validate(new Date());
  });

  it('should validate strict "timestamp" format', function() {
    const validate = library.generate({
      type: 'date',
      format: 'timestamp',
      strictFormat: true
    });
    assert.throws(() => validate('2011-01-02'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123'), /Value must be/);
    validate('2011-01-02T10:30:15.123+03:00');
    validate('2011-01-02T10:30:15.123Z');
    validate('2011-01-02T10:30:15Z');
    validate(new Date());
  });

  it('should coerce to "timestamp" format', function() {
    const validate = library.generate({type: 'date', format: 'timestamp'},
        {coerceTypes: true});
    assert.strictEqual(validate('2011-01-02').value, '2011-01-02T00:00:00Z');
    assert.strictEqual(validate('2011-01-02T10:30').value, '2011-01-02T10:30:00Z');
    assert.strictEqual(validate('2011-01-02T10:30:15').value, '2011-01-02T10:30:15Z');
    assert.strictEqual(validate('2011-01-02T10:30:15.123').value, '2011-01-02T10:30:15.123Z');
    assert.strictEqual(validate('2011-01-02T10:30:15.123+03:00').value, '2011-01-02T10:30:15.123+03:00');
    assert.strictEqual(validate('2011-01-02T10:30:15.123Z').value, '2011-01-02T10:30:15.123Z');
    assert.strictEqual(validate('2011-01-02T10:30:15Z').value, '2011-01-02T10:30:15Z');
    const d1 = new Date('2019-09-30T19:34:40.668Z');
    assert.strictEqual(validate(d1).value, '2019-09-30T19:34:40.668Z');
  });

  it('should validate "datetime" format', function() {
    const validate = library.generate({type: 'date', format: 'datetime'});
    validate('2011-01-02');
    validate('20110102');
    validate('2011-01-02T10:30');
    validate('201101021030');
    validate('2011-01-02T10:30:15');
    validate('20110102103015');
    validate('2011-01-02T10:30:15.123');
    validate('20110102103015.123');
    assert.throws(() =>
        validate('2011-01-02T10:30:15.123+03:00'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123Z'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15Z'), /Value must be/);
    validate(new Date());
  });

  it('should validate strict "datetime" format', function() {
    const validate = library.generate({
      type: 'date',
      format: 'datetime',
      strictFormat: true
    });
    assert.throws(() => validate('2011-01-02'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30'), /Value must be/);
    validate('2011-01-02T10:30:15');
    validate('2011-01-02T10:30:15.123');
    assert.throws(() =>
        validate('2011-01-02T10:30:15.123+03:00'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123Z'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15Z'), /Value must be/);
    validate(new Date());
  });

  it('should coerce to "datetime" format', function() {
    const validate = library.generate({type: 'date', format: 'datetime'},
        {coerceTypes: true});
    assert.strictEqual(validate('2011-01-02').value, '2011-01-02T00:00:00');
    assert.strictEqual(validate('2011-01-02T10:30').value, '2011-01-02T10:30:00');
    assert.strictEqual(validate('2011-01-02T10:30:15').value, '2011-01-02T10:30:15');
    assert.strictEqual(validate('2011-01-02T10:30:15.123').value, '2011-01-02T10:30:15.123');
    const d1 = new Date('2019-09-30T19:34:40.668Z');
    assert.strictEqual(validate(d1).value, '2019-09-30T19:34:40.668');
  });

  it('should validate "date" format', function() {
    const validate = library.generate({type: 'date', format: 'date'});
    validate('2011-01-02');
    validate('20110102');
    assert.throws(() => validate('2011-01-02T10:30'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123+03:00'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123Z'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15Z'), /Value must be/);
    validate(new Date());
  });

  it('should validate strict "date" format', function() {
    const validate = library.generate({
      type: 'date',
      format: 'date',
      strictFormat: true
    });
    validate('2011-01-02');
    assert.throws(() => validate('20110102'), /Value must be/);
    assert.throws(() => validate('2011'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123+03:00'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123Z'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15Z'), /Value must be/);
    validate(new Date());
  });

  it('should coerce to "date" format', function() {
    const validate = library.generate({type: 'date', format: 'date'},
        {coerceTypes: true});
    assert.strictEqual(validate('2011-01-02').value, '2011-01-02');
    assert.strictEqual(validate('20110102').value, '2011-01-02');
    const d1 = new Date('2019-09-30T19:34:40.668Z');
    assert.strictEqual(validate(d1).value, '2019-09-30');
  });

  it('should validate "time" format', function() {
    const validate = library.generate({type: 'date', format: 'time'});
    validate('13:14:15.123');
    validate('131415.123');
    validate('131415');
    assert.throws(() => validate('2011-01-02T10:30'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123+03:00'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123Z'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15Z'), /Value must be/);
    validate(new Date());
  });

  it('should validate strict "time" format', function() {
    const validate = library.generate({
      type: 'date',
      format: 'time',
      strictFormat: true
    });
    validate('13:14:15.123');
    assert.throws(() => validate('131415.123'), /Value must be/);
    assert.throws(() => validate('131415'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123+03:00'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15.123Z'), /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30:15Z'), /Value must be/);
    validate(new Date());
  });

  it('should coerce to "time" format', function() {
    const validate = library.generate({type: 'date', format: 'time'},
        {coerceTypes: true});
    assert.strictEqual(
        validate('101112').value, '10:11:12');
    assert.strictEqual(
        validate(new Date('2000-01-01T10:11:12Z')).value, '10:11:12');
    assert.strictEqual(
        validate(new Date('2000-01-01T10:11:12.123Z')).value, '10:11:12.123');
  });

  it('should validate "rfc2616" format', function() {
    const validate = library.generate({type: 'date', format: 'rfc2616'});
    validate('Sun Jan 02 2011 02:00:00 GMT+0200 (GMT+03:00)');
    validate('2011-01-02');
    validate('20110102');
    validate('2011-01-02T10:30');
    validate('201101021030');
    validate('2011-01-02T10:30:15');
    validate('2011-01-02T10:30:15.123');
    validate('20110102103015.123');
    validate('2011-01-02T10:30:15.123+03:00');
    validate('2011-01-02T10:30:15.123Z');
    validate('2011-01-02T10:30:15Z');
    validate(new Date());
  });

  it('should validate strict "rfc2616" format', function() {
    const validate = library.generate({
      type: 'date',
      format: 'rfc2616',
      strictFormat: true
    });
    assert.throws(() =>
            validate('2011-01-02'),
        /Value must be/);
    assert.throws(() => validate('2011-01-02T10:30'), /Value must be/);
    validate('Sun Jan 02 2011 02:00:00 GMT+0200 (GMT+03:00)');
    validate(new Date());
  });

  it('should convert value to Date instance', function() {
    const validate = library.generate({type: 'date', format: 'timestamp'},
        {convertDates: true});
    assert(validate('2011-01-02').value instanceof Date);
  });

  it('should use strict mode if options.strictFormat = true', function() {
    const validate = library.generate({
      type: 'date',
      format: 'time'
    }, {strictFormat: true});
    validate('13:14:15.123');
    assert.throws(() => validate('131415.123'), /Value must be/);
  });

  it('should validator reject invalid dates', function() {
    const validate = library.generate('date');
    assert.throws(() => validate('2011-02-30T10:30:15Z'),
        /Value must be/);
    assert.throws(() => validate(0), /Value must be/);
    assert.throws(() => validate(''), /Value must be/);
    assert.throws(() => validate({}), /Value must be/);
  });

  it('should validate in fast-mode', function() {
    library.setOption('date.fast', true);
    let validate = library.generate({type: 'date', format: 'timestamp'},
        {coerceTypes: true, fastDateValidation: true});
    assert.strictEqual(validate('2011-01-02').value, '2011-01-02T00:00:00Z');
    assert.strictEqual(validate('2011-01-02T10:30').value, '2011-01-02T10:30:00Z');
    assert.strictEqual(validate('2011-01-02T10:30:15').value, '2011-01-02T10:30:15Z');
    assert.strictEqual(validate('2011-01-02T10:30:15.123').value, '2011-01-02T10:30:15.123Z');
    assert.strictEqual(validate('2011-01-02T10:30:15.123+03:00').value, '2011-01-02T10:30:15.123+03:00');
    assert.strictEqual(validate('2011-01-02T10:30:15.123Z').value, '2011-01-02T10:30:15.123Z');
    assert.strictEqual(validate('2011-01-02T10:30:15Z').value, '2011-01-02T10:30:15Z');
    const d1 = new Date('2019-09-30T19:34:40.668Z');
    assert.strictEqual(validate(d1).value, '2019-09-30T19:34:40.668Z');
    validate = library.generate({
      type: 'date',
      format: 'timestamp'
    }, {fastDateValidation: true});
    validate('2011-01-02');
    library.setOption('date.fast', undefined);
  });

  it('should overwrite format names', function() {
    const library = new Valgen({defaults: {throwOnError: true}});
    library.define('date', new DateFactory({
      dateFormats: {
        'date-only': 'date',
        'datetime-only': 'datetime',
        'datetime': 'timestamp',
        'time-only': 'time',
        'rfc2616': 'rfc2616'
      }
    }));
    let validate = library.generate({
      type: 'date',
      format: 'time-only'
    }, {coerceTypes: true});
    assert.strictEqual(validate('131415.123').value, '13:14:15.123');
    validate = library.generate({
      type: 'date',
      format: 'date-only'
    }, {coerceTypes: true});
    assert.strictEqual(validate('20110102').value, '2011-01-02');
    assert.throws(() => library.generate({
      type: 'date',
      format: 'time'
    }), /Unknown date format/);
  });

});
