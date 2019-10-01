'use strict';
const DataType = require('../DataType');
const {isValidDate, fastParseInt} = require('../helpers');

class DateTimeType extends DataType {

  constructor(library) {
    super(library);
    this.attributes.format = undefined;
  }

  get default() {
    return this.attributes.default;
  }

  set default(v) {
    if (v == null) {
      this.attributes.default = v;
      return;
    }
    if (!(typeof v === 'string' || v instanceof Date))
      throw new TypeError(`"${v}" is not a string or Date instance for default attribute`);
    this.attributes.default = v;
  }

  get format() {
    return this.attributes.format;
  }

  set format(v) {
    if (v && !this.constructor.DateFormats.includes(v))
      throw new TypeError(`Unknown date format (${v})`);
    this.attributes.format = v;
  }

  assign(values, overwrite) {
    super.assign(values, overwrite);
    this._assignAttributes(['format'], values, overwrite);
  }

  _getFormat() {
    return this.format || 'datetime';
  }

  _mapFormat(format) {
    return format;
  }

  _getFormatDateFn(format) {
    switch (format) {
      case 'date-only':
        return (d) => {
          const s = d.toISOString();
          return s.substring(0, 10);
        };
      case 'datetime-only':
        return (d) => {
          const s = d.toISOString();
          return s.substring(0, s.length - 1);
        };
      case 'time-only':
        return (d) => {
          const s = d.toISOString();
          return s.substring(11, s.length - 1);
        };
      case 'datetime':
        return (d) => d.toISOString();
      case 'rfc2616':
        return (d) => d.toString();
    }
  }

  _getFormatDateItemsFn(format) {
    let src = `  const v = `;
    if (format === 'rfc2616' || format === 'date-only' ||
        format === 'datetime-only' || format === 'datetime') {
      src += `
    // Date part
    m[1] + '-' + m[2] + '-' + m[3]`;
    }
    if (format === 'rfc2616' || format === 'datetime-only' ||
        format === 'datetime') {
      src += ` +
    // Time part
    'T'`;
    }
    if (format === 'rfc2616' || format === 'datetime-only' ||
        format === 'datetime' || format === 'time-only') {
      src += `+ (m[4] || '00') + ':' + (m[5] || '00') + ':' + (m[6] || '00') + 
    // Millisecond
    (m[7] ? '.' + m[7] : '')`;
    }
    if (format === 'rfc2616' || format === 'datetime') {
      src += `+
    // Time zone
    (m[9] ? (m[9] + (m[10] || '00') + ':' + (m[11] || '00')) : 'Z')`;
    }
    if (format === 'rfc2616') {
      src += ';\n  return new Date(v).toString()';
    } else src += ';\n  return v';
    return new Function('m', src);
  }

  _getMatchDatePatternFn(format, strict) {
    if (format === 'time-only') {
      return (v) => {
        const m = v.match(this.constructor.TIMEONLY_PATTERN);
        return m ? [v, '1970', '01', '01', ...m.slice(1)] : m;
      };
    }
    let src = `
  return (v) => {
    const m = v.match(pattern);
    if (!m || (m[2] === '02' && m[3] > '29'))
      return;
`;
    if (!strict) {
      if (format === 'date-only')
        src += '    m[4]=null;m[5]=null;m[6]=null;m[7]=null;\n';
      if (format === 'date-only' || format === 'datetime-only')
        src += '    m[8]=null;m[9]=null;m[10]=null;m[11]=null;\n';
    }
    src += `
    return m;
  }`;
    const pattern = !strict ? this.constructor.TIMESTAMPLIKE_PATTERN :
        (format === 'datetime-only' ? this.constructor.DATETIMEONLY_PATTERN :
            (format === 'date-only' ? this.constructor.DATEONLY_PATTERN :
                this.constructor.TIMESTAMP_PATTERN));
    return new Function('pattern', src)(pattern);
  }

  _generateValidationCode(options) {
    const data = super._generateValidationCode(options);
    const convertDates = options.convertDates;
    const coerceTypes = options.coerceTypes || convertDates;
    const formatName = this._getFormat();
    const format = this._mapFormat(formatName);
    const fastDateValidation = options.fastDateValidation && !convertDates &&
        format !== 'rfc2616';
    const strict = options.strictTypes;
    const matchDatePattern = this._getMatchDatePatternFn(format, strict);
    const dateItemsToISO = this._getFormatDateItemsFn('datetime');
    const formatDate = this._getFormatDateFn(format);
    const formatDateItems = this._getFormatDateItemsFn(format);
    data.code += `
    if (!(value instanceof Date || typeof value === 'string')) {
        error({
            message: 'Value must be ${formatName} formatted string or Date instance',
            errorType: 'invalid-data-type',
            path
        });
        return;
    }`;
    data.code += `
    let d;
    let m;    
    if (typeof value === 'string') {`;
    if (format === 'rfc2616') {
      data.code += `      
        m = matchDatePattern(value);  
        d = new Date(m ? dateItemsToISO(m) : value);`;
    } else
      data.code += `       
        m = matchDatePattern(value);
        if (!m) {
            error({
                message: 'Value must be ${formatName} formatted string or Date instance',
                errorType: 'invalid-data-type',
                path
            });
            return;
        }
        ${fastDateValidation ?
          `return ${coerceTypes ? 'formatDateItems(m)' : 'value'};` :
          `d = new Date(dateItemsToISO(m));
        d = isValidDate(d) && fastParseInt(m[3]) === d.getUTCDate() ? d : null;`}
`;
    data.code += `
    } else d = value;    
    if (!isValidDate(d)) {
        error({
            message: 'Value must be ${formatName} formatted string or Date instance',
            errorType: 'invalid-data-type',
            path
        });
        return;
    }`;
    if (convertDates)
      data.code += '\n    value = d;';
    else if (coerceTypes) {
      data.code += '\n    value = m ? formatDateItems(m) : formatDate(d);';
    }
    data.variables = {
      ...data.variables,
      isValidDate,
      matchDatePattern, formatDateItems, formatDate,
      dateItemsToISO, fastParseInt
    };
    return data;
  }

}

DateTimeType.DateFormats = ['date-only', 'datetime-only', 'datetime',
  'time-only', 'rfc2616'];
DateTimeType.TIMESTAMPLIKE_PATTERN =
    /^(\d{4})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)(?:T([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9]))?)?(?:\.?(\d+))?(?:(Z)|(?:([+-])([01]?[0-9]|2[0-3]):?([0-5][0-9])?))?$/;
DateTimeType.TIMESTAMP_PATTERN =
    /^(\d{4})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(?:\.?(\d+))?(?:(Z)|(?:([+-])([01]?[0-9]|2[0-3]):?([0-5][0-9])?))$/;
DateTimeType.DATETIMEONLY_PATTERN =
    /^(\d{4})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(?:\.?(\d+))?$/;
DateTimeType.DATEONLY_PATTERN =
    /^(\d{4})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/;
DateTimeType.TIMEONLY_PATTERN =
    /^([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9]))?(?:\.?(\d+))?$/;

module.exports = DateTimeType;

