'use strict';
const AnyType = require('./AnyType');
const {
  coerceToBool, coerceToString, coerceToInt, coerceToArray,
  coalesce,
  mapDistinct
} = require('../helpers');

class StringType extends AnyType {

  set(dataType, attr, v) {
    switch (attr) {
      case 'default': {
        dataType.default = coerceToString(v);
        return;
      }
      case 'enum': {
        if (v && !Array.isArray(v))
          throw new TypeError(`"${v}" is not an array value.`);
        dataType.enum = mapDistinct(v, coerceToString);
        return;
      }
      case 'pattern': {
        dataType.pattern = v &&
            mapDistinct(coerceToArray(v),
                (x) => x instanceof RegExp ? x : new RegExp(x));
        return;
      }
      case 'minLength':
      case 'maxLength': {
        dataType[attr] = coerceToInt(v);
        return;
      }
    }
    super.set(attr, v);
  }

  prepareCompileOptions(options) {
    const o = super.prepareCompileOptions(options);
    o.strictFormat = coerceToBool(options.strictFormat);
    o.coerceTypes = coerceToBool(options.coerceTypes);
    return o;
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    const strictFormat = coalesce(options.strictFormat, dataType.strictFormat);
    const pattern = data.variables.patterns = dataType.pattern;
    const minLength = dataType.minLength;
    const maxLength = dataType.maxLength;

    data.code += `
    if (!(typeof value === 'string'`;
    if (!strictFormat)
      data.code +=
          ` || (typeof value === 'number' || typeof value === 'bigint')`;

    data.code += `)
    ) {
      return typeCheck ? Failed : ctx.logError({
            message: 'Value must be a string',
            errorType: 'invalid-data-type'
      });
    }  
    const v = ''+ value;`;

    if (pattern)
      data.code += `
    let matched;
    const patternLen = patterns.length;
    for (let i = 0; i < patternLen; i++) {
        if (v.match(patterns[i])) {
            matched = true;
            break;
        }
    }
    if (!matched) {        
        return typeCheck ? Failed : ctx.logError({
            message: 'Value does not match required format',
            errorType: 'invalid-value-format'
        });
    }`;

    data.code += `    
    if (typeCheck) return;`;

    if (minLength != null)
      data.code += `
    if (v.length < ${minLength}) {       
        return ctx.logError({
            message: 'Minimum accepted length is ${minLength}, actual ' + v.length, 
            errorType: 'invalid-value-length',
            min: ${minLength},                
            actual: v.length
        });
    }`;

    if (maxLength)
      data.code += `
    if (v.length > ${maxLength})
        return ctx.logError({
            message: 'Maximum accepted length is ${maxLength}, actual ' + v.length,  
            errorType: 'invalid-value-length',
            max: ${maxLength},               
            actual: v.length
        });`;

    if (options.coerceTypes)
      data.code += '\n    value = v;';
    return data;
  }
}

module.exports = StringType;
