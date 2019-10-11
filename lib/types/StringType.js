'use strict';
const DataType = require('../DataType');

class StringType extends DataType {

  constructor(library) {
    super(library);
    this.attributes.enum = undefined;
    this.attributes.pattern = undefined;
    this.attributes.minLength = undefined;
    this.attributes.maxLength = undefined;
  }

  get default() {
    return this.attributes.default;
  }

  set default(v) {
    this.attributes.default = v == null ? v : String(v);
  }

  get enum() {
    return this.attributes.enum;
  }

  set enum(v) {
    if (v && !Array.isArray(v))
      throw new TypeError('Array type required for "enum" attribute');
    this.attributes.enum = v == null ? v : v.map(x => '' + x);
  }

  get pattern() {
    return this.attributes.pattern;
  }

  set pattern(v) {
    this.attributes.pattern = v == null ? v :
        Array.isArray(v) ? v.map(x => '' + x) : ['' + v];
  }

  get minLength() {
    return this.attributes.minLength;
  }

  set minLength(v) {
    if (v == null) {
      this.attributes.minLength = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for minLength attribute`);
    this.attributes.minLength = x;
  }

  get maxLength() {
    return this.attributes.maxLength;
  }

  set maxLength(v) {
    if (v == null) {
      this.attributes.maxLength = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for maxLength attribute`);
    this.attributes.maxLength = x;
  }

  assign(values, overwrite) {
    super.assign(values, overwrite);
    this._assignAttributes(['enum', 'pattern', 'minLength',
      'maxLength'], values, overwrite);
  }

  _generateValidationCode(options, fnCache) {
    const data = super._generateValidationCode(options, fnCache);
    const {strictTypes} = options;
    const enums = this.enum;
    if (enums)
      data.variables.enums = new Set(enums);
    if (this.pattern)
      data.variables.patterns = this.pattern.map(x => new RegExp(x));

    data.code += `
    if (!(typeof value === 'string'`;
    if (!strictTypes)
      data.code +=
          ` || (typeof value === 'number' || typeof value === 'bigint')`;
    data.code += `)
    )
      return unionMatch ? Failed : error({
            message: 'Value'+(path ? ' at '+ path: '')+' must be a string',
            errorType: 'invalid-data-type',
            path
      });`;
    data.code += `
    const v = String(value);`;
    if (enums)
      data.code += `
    if (!enums.has(v))
        return unionMatch ? Failed : error({
            message: 'Value'+(path ? ' at '+ path: '') + ' must be a one of the enumerated values',
            errorType: 'invalid-enum-value',
            path
        });`;

    if (this.pattern)
      data.code += `
    let matched;
    const patternLen = patterns.length;
    for (let i = 0; i < patternLen; i++) {
        if (v.match(patterns[i])) {
            matched = true;
            break;
        }
    }
    if (!matched)
        return unionMatch ? Failed : error({
            message: 'Value does not match required format',
            errorType: 'invalid-value-format',
            path
        });`;

    data.code += `    
    if (unionMatch) return;`;

    if (this.minLength != null)
      data.code += `
    if (v.length < ${this.minLength})
        return error({
            message: 'Minimum accepted length'+(path ? ' at '+ path: '')+
                ' is ${this.minLength}, actual ' + v.length, 
            errorType: 'invalid-value-length',
            path,                
            min: ${this.minLength},                
            actual: v.length
        });`;

    if (this.maxLength)
      data.code += `
    if (v.length > ${this.maxLength})
        return error({
            message: 'Maximum accepted length'+(path ? ' at '+ path: '')+
                ' is ${this.maxLength}, actual ' + v.length,  
            errorType: 'invalid-value-length',
            path,
            max: ${this.maxLength},               
            actual: v.length
        });`;

    if (options.coerceTypes)
      data.code += '\n    value = v;';
    return data;
  }
}

module.exports = StringType;
