'use strict';
const {AnyFactory} = require('./AnyFactory');
const {
  coalesce, coerceToBool, coerceToString, coerceToInt,
  mapDistinct
} = require('../helpers');

class StringFactory extends AnyFactory {

  normalizeCompileOptions(options) {
    const o = super.normalizeCompileOptions(options);
    o.strictFormat = coerceToBool(options.strictFormat);
    o.coerceTypes = coerceToBool(options.coerceTypes);
    return o;
  }

  normalizeAttribute(attr, v) {
    switch (attr) {
      case 'default':
      case 'pattern':
        return coerceToString(v);
      case 'enum':
        if (!Array.isArray(v))
          throw new TypeError(`"${v}" is not an array value.`);
        return mapDistinct(v, coerceToString);
      case 'minLength':
      case 'maxLength':
        return coerceToInt(v);
    }
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    const strictFormat = coalesce(options.strictFormat,
        dataType.get('strictFormat'), dataType.options.strictFormat);
    const pattern = coalesce(dataType.get('pattern'), dataType.options.pattern);
    if (pattern)
      data.variables.pattern = new RegExp(pattern);
    const minLength = coalesce(dataType.get('minLength'), dataType.options.minLength);
    const maxLength = coalesce(dataType.get('maxLength'), dataType.options.maxLength);

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
    if (!v.match(pattern))
        return typeCheck ? Failed : ctx.logError({
            message: 'Value does not match required format',
            errorType: 'invalid-value-format'
        });`;

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

module.exports = {StringFactory};
