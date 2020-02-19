'use strict';
const {AnyType} = require('./AnyType');
const {coerceToBool, coalesce, isValidDate, fastParseInt} = require('../helpers');

class DateType extends AnyType {

  constructor(options) {
    super();
    this.dateFormats = (options && options.dateFormats) || {
      'date': 'date',
      'datetime': 'datetime',
      'timestamp': 'timestamp',
      'time': 'time',
      'rfc2616': 'rfc2616'
    };
    if (options && options.format)
      this.format = options.format;
    this.TIMESTAMP_PATTERN =
        /^(\d{4})-?(0[1-9]|1[012])?-?([123]0|[012][1-9]|31)?(?:T?([01][0-9]|2[0-3]):?([0-5][0-9]):?([0-5][0-9])?(?:\.(\d+))?(?:(Z)|(?:([+-])([01]?[0-9]|2[0-3]):?([0-5][0-9])?))?)?$/;
    this.TIMESTAMP_STRICT_PATTERN =
        /^(\d{4})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(?:\.?(\d+))?(?:(Z)|(?:([+-])([01]?[0-9]|2[0-3]):([0-5][0-9])))$/;
    this.DATETIME_PATTERN =
        /^(\d{4})-?(0[1-9]|1[012])?-?([123]0|[012][1-9]|31)?(?:T?([01][0-9]|2[0-3]):?([0-5][0-9]):?([0-5][0-9])?(?:\.?(\d+))?)?$/;
    this.DATETIME_STRICT_PATTERN =
        /^(\d{4})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(?:\.?(\d+))?$/;
    this.DATE_PATTERN =
        /^(\d{4})-?(0[1-9]|1[012])?-?([123]0|[012][1-9]|31)?$/;
    this.DATE_STRICT_PATTERN =
        /^(\d{4})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/;
    this.TIME_PATTERN =
        /^([01][0-9]|2[0-3]):?([0-5][0-9]):?([0-5][0-9])?(?:\.(\d+))?$/;
    this.TIME_STRICT_PATTERN =
        /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])?(?:\.(\d+))?$/;
  }

  set(dataType, attr, v) {
    switch (attr) {
      case 'default': {
        dataType.default = coerceDateOrString(v);
        return;
      }
      case 'enum':
        return;
      case 'format': {
        if (v && !this.dateFormats[v])
          throw new TypeError(`Unknown date format (${v})`);
        return dataType.format = v;
      }
      case 'strictFormat':
        dataType.strictFormat = coerceToBool(v);
        return;
    }
    super.set(attr, v);
  }

  prepareCompileOptions(options) {
    const o = super.prepareCompileOptions(options);
    o.strictFormat = coerceToBool(options.strictFormat);
    o.coerceTypes = coerceToBool(options.coerceTypes);
    o.convertDates = coerceToBool(options.convertDates);
    o.fastDateValidation = coerceToBool(options.fastDateValidation);
    return o;
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    const convertDates = options.convertDates;
    const coerceTypes = options.coerceTypes || convertDates;
    const formatName = dataType.format || this.format || 'timestamp';
    const format = this.dateFormats[formatName] || formatName;

    const fastDateValidation = options.fastDateValidation && !convertDates &&
        format !== 'rfc2616';
    const strictFormat = coalesce(options.strictFormat, dataType.strictFormat);
    const matchDatePattern = this._getMatchDatePatternFn(format, strictFormat);
    const dateItemsToISO = this._getFormatDateItemsFn('timestamp');
    const formatDate = this._getFormatDateFn(format);
    const formatDateItems = this._getFormatDateItemsFn(format);
    data.code += `
    if (!(value instanceof Date || typeof value === 'string'))
        return typeCheck ? Failed : ctx.logError({
            message: 'Value must be ${formatName} formatted string or Date instance',
            errorType: 'invalid-data-type'          
        });`;
    data.code += `
    let d;
    let m;    
    if (typeof value === 'string') {`;
    if (format === 'rfc2616') {
      if (strictFormat) {
        data.code += `                
        d = String(value).match(/^[A-Za-z]/) && new Date(value);`;
      } else
        data.code += `      
        m = matchDatePattern(value);  
        d = new Date(m ? dateItemsToISO(m) : value);`;
    } else
      data.code += `       
        m = matchDatePattern(value);
        if (!m)
            return typeCheck ? Failed : ctx.logError({
                message: 'Value must be ${formatName} formatted string or Date instance',
                errorType: 'invalid-data-type'
            });
        ${fastDateValidation ?
          `return ${coerceTypes ? 'formatDateItems(m)' : 'value'};` :
          `d = new Date(dateItemsToISO(m));
        d = isValidDate(d) && fastParseInt((m[3]||'01')) === d.getUTCDate() ? d : null;`}
`;
    data.code += `
    } else d = value;    
    if (!isValidDate(d))
        return typeCheck ? Failed : ctx.logError({
            message: 'Value must be ${formatName} formatted string or Date instance',
            errorType: 'invalid-data-type'
        });`;

    data.code += `    
    if (typeCheck) return;`;

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

  _getFormatDateFn(format) {
    switch (format) {
      case 'date':
        return (d) => {
          const s = d.toISOString();
          return s.substring(0, 10);
        };
      case 'datetime':
        return (d) => {
          const s = d.toISOString();
          return s.substring(0, s.length - 1);
        };
      case 'time':
        return (d) => {
          let s = d.toISOString();
          return s.endsWith('.000Z') ?
              s.substring(11, s.length - 5) : s.substring(11, s.length - 1);
        };
      case 'timestamp':
        return (d) => d.toISOString();
      case 'rfc2616':
        /* istanbul ignore next : Timezone obstructs testing */
        return (d) => d.toString();
    }
  }

  _getFormatDateItemsFn(format) {
    let src = `  const v = `;
    if (format === 'rfc2616' || format === 'date' ||
        format === 'datetime' || format === 'timestamp') {
      src += `
    // Date part
    m[1] + '-' + (m[2]||'01') + '-' + (m[3]||'01')`;
    }
    if (format === 'rfc2616' || format === 'datetime' ||
        format === 'timestamp') {
      src += ` +
    // Time part
    'T'`;
    }
    if (format === 'rfc2616' || format === 'datetime' ||
        format === 'timestamp' || format === 'time') {
      src += `+ (m[4] || '00') + ':' + (m[5] || '00') + ':' + (m[6] || '00') + 
    // Millisecond
    (m[7] ? '.' + m[7] : '')`;
    }
    if (format === 'rfc2616' || format === 'timestamp') {
      src += `+
    // Time zone
    (m[9] ? (m[9] + (m[10] || '00') + ':' + (m[11] || '00')) : 'Z')`;
    }
    if (format === 'rfc2616') {
      src += ';\n  return new Date(v).toString()';
    } else src += ';\n  return v;';
    return new Function('m', src);
  }

  _getMatchDatePatternFn(format, strict) {
    if (format === 'time') {
      return (v) => {
        const m = v.match(strict ? this.TIME_STRICT_PATTERN : this.TIME_PATTERN);
        return m && [v, '1970', '01', '01', ...m.slice(1)];
      };
    }
    let src = `
  return (v) => {
    const m = v.match(pattern);
    if (!m || (m[2] === '02' && m[3] > '29'))
      return;
`;
    if (!strict) {
      if (format === 'date')
        src += '    m[4]=null;m[5]=null;m[6]=null;m[7]=null;\n';
      if (format === 'date' || format === 'datetime')
        src += '    m[8]=null;m[9]=null;m[10]=null;m[11]=null;\n';
    }
    src += `
    return m;
  }`;
    let pattern;
    switch (format) {
      case 'datetime':
        pattern = strict ? this.DATETIME_STRICT_PATTERN :
            this.DATETIME_PATTERN;
        break;
      case 'date':
        pattern = strict ? this.DATE_STRICT_PATTERN :
            this.DATE_PATTERN;
        break;
      default:
        pattern = strict ?
            this.TIMESTAMP_STRICT_PATTERN :
            this.TIMESTAMP_PATTERN;
    }
    return new Function('pattern', src)(pattern);
  }

}

function coerceDateOrString(v) {
  if (v && !(typeof v === 'string' || v instanceof Date))
    throw new TypeError(`"${v}" is not a string or Date instance`);
  return v;
}

module.exports = {DateType};

