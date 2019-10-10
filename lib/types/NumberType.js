'use strict';
const DataType = require('../DataType');

const MinValues = {
  int64: null,
  bigint: null,
  int32: -2147483648,
  int: -9007199254740991,
  int16: -32768,
  int8: -128,
  long: 0,
  uint64: 0,
  uint32: 0,
  uint16: 0,
  uint8: 0
};

const MaxValues = {
  int64: null,
  bigint: null,
  int32: 2147483647,
  int: 9007199254740991,
  int16: 32767,
  int8: 127,
  long: null,
  uint64: null,
  uint32: 4294967295,
  uint16: 65535,
  uint8: 255
};

const IntegerFormats = ['int64', 'bigint', 'int32', 'int', 'int16', 'int8',
  'uint64', 'uint32', 'uint16', 'uint8', 'long'];
const NumberFormats = [...IntegerFormats, 'float', 'double'];

class NumberType extends DataType {

  constructor(library) {
    super(library);
    this.attributes.enum = undefined;
    this.attributes.format = undefined;
    this.attributes.minimum = undefined;
    this.attributes.maximum = undefined;
    this.attributes.multipleOf = undefined;
  }

  get default() {
    return this.attributes.default;
  }

  set default(v) {
    if (v == null) {
      this.attributes.default = v;
      return;
    }
    const x = parseFloat(v);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for default attribute`);
    this.attributes.default = x;
  }

  get enum() {
    return this.attributes.enum;
  }

  set enum(v) {
    if (v && !Array.isArray(v))
      throw new TypeError('Array type required for "enum" attribute');
    this.attributes.enum = v == null ? v : v.map(x => parseFloat(x));
  }

  get format() {
    return this.attributes.format;
  }

  set format(v) {
    if (v && !NumberFormats.includes(v))
      throw new TypeError(`Unknown number format (${v})`);
    this.attributes.format = v;
  }

  get minimum() {
    return this.attributes.minimum;
  }

  set minimum(v) {
    if (v == null) {
      this.attributes.minimum = v;
      return;
    }
    const x = parseFloat(v);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for minimum attribute`);
    this.attributes.minimum = x;
  }

  get maximum() {
    return this.attributes.maximum;
  }

  set maximum(v) {
    if (v == null) {
      this.attributes.maximum = v;
      return;
    }
    const x = parseFloat(v);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for maximum attribute`);
    this.attributes.maximum = x;
  }

  get multipleOf() {
    return this.attributes.multipleOf;
  }

  set multipleOf(v) {
    if (v == null) {
      this.attributes.multipleOf = v;
      return;
    }
    const x = parseFloat(v);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for multipleOf attribute`);
    this.attributes.multipleOf = x;
  }

  assign(values, overwrite) {
    super.assign(values, overwrite);
    this._assignAttributes(['enum', 'format', 'minimum', 'maximum',
      'multipleOf'], values, overwrite);
  }

  _getFormat() {
    return this.format;
  }

  _generateValidationCode(options, fnCache) {
    const data = super._generateValidationCode(options, fnCache);
    const {strictTypes} = options;
    const enums = this.enum;
    if (enums)
      data.variables.enums = new Set(enums);
    const format = this._getFormat();
    const minimum = this.minimum != null ? this.minimum : MinValues[format];
    const maximum = this.maximum != null ? this.maximum : MaxValues[format];
    const multipleOf = this.multipleOf;
    const bigFormat = ['bigint', 'int64', 'uint64', 'long'].includes(format);
    if (bigFormat && !global.BigInt)
      throw new Error('Your JavaScript version does not support BigInt values');
    const intFormat = IntegerFormats.includes(format);
    data.variables.errorMsg1 = 'Value must be ' +
        (intFormat ? 'an integer' : 'a number') +
        (strictTypes ? '' : ' or ' +
            (intFormat ? 'integer' : 'number') +
            ' formatted string');
    data.code += `
    if (!((typeof value === 'number' || typeof value === 'bigint')`;
    if (!strictTypes)
      data.code += ` || (typeof value === 'string' && value)`;
    data.code += `)
    ) 
      return error({
          message: errorMsg1,
          errorType: 'invalid-data-type',
          path
      });
`;

    data.code += `
    let n;
    try {
        n = ${bigFormat ? 'BigInt(value)' : 'Number(value)'};
    } catch (e) {
        return error({
            message: errorMsg1,
            errorType: 'invalid-data-type',
            path
        });
    }

    if (!(typeof n === 'bigint' || !isNaN(n))) {
        return error({
            message: errorMsg1,
            errorType: 'invalid-data-type',
            path
        });
    }
`;
    if (intFormat)
      data.code += `
    if (typeof n === 'number' && (n - Math.floor(n) > 0)) {
        return error({
            message: errorMsg1,
            errorType: 'invalid-data-type',
            path
        });
    }
`;
    if (enums)
      data.code += `
    if (!enums.has(n)) {
        return error({
            message: 'Value for "' + name + '" must be a one of enumerated value',
            errorType: 'invalid-enum-value',
            path
        });
    }
`;
    if (multipleOf)
      data.code += `
    const c = typeof n === 'bigint' ?
        n / BigInt(${multipleOf}) * BigInt(${multipleOf}) :
        Math.trunc(n / ${multipleOf}) * ${multipleOf};
    if (n !== c)
        return error({
            message: 'Numeric value must be multiple of ${multipleOf}',
            errorType: 'invalid-value',
            path
        });`;
    if (minimum != null)
      data.code += `
    if (n < ${minimum})
        return error({
            message: 'Minimum accepted value is ${minimum}, actual ' + n,
            errorType: 'range-error',
            path,
            min: ${minimum},
            actual: n
        });`;
    if (maximum)
      data.code += `
    if (n > ${maximum})
        return error({
            message: 'Maximum accepted value is ${maximum}, actual ' + n,
            errorType: 'range-error',
            path,
            max: ${maximum},
            actual: n
        });`;
    if (options.coerceTypes)
      data.code += '\n    value = n;';
    return data;
  }
}

NumberType.NumberFormats = NumberFormats;
NumberType.IntegerFormats = IntegerFormats;
NumberType.MinValues = MinValues;
NumberType.MaxValues = MaxValues;

module.exports = NumberType;
