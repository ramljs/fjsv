'use strict';
const AnyType = require('./AnyType');
const {coerceToInt, coerceToBool, coerceToArray, coalesce} = require('../helpers');

class ArrayType extends AnyType {

  set(dataType, attr, v) {
    switch (attr) {
      case 'default':
        dataType.default = coerceToArray(v);
        return;
      case 'enum':
        return;
      case 'items': {
        dataType.items = !v ? v :
            v instanceof AnyType ? v : dataType.library.get(v);
        return;
      }
      case 'minItems':
      case 'maxItems': {
        dataType[attr] = coerceToInt(v);
        return;
      }
      case 'uniqueItems':
        dataType[attr] = coerceToBool(v);
        return;
    }
    super.set(attr, v);
  }

  prepareCompileOptions(options) {
    const o = super.prepareCompileOptions(options);
    o.strictFormat = coerceToBool(options.strictFormat);
    o.coerceTypes = coerceToBool(options.coerceTypes);
    o.maxArrayErrors = coerceToInt(options.maxArrayErrors);
    return o;
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    const minItems = dataType.minItems;
    const maxItems = dataType.maxItems;
    const uniqueItems = dataType.uniqueItems;
    const items = dataType.items;
    const strictFormat = coalesce(options.strictFormat, dataType.strictFormat);
    const maxErrors = data.variables.maxErrors = options.maxArrayErrors;
    const itemsValidator = data.variables.itemsValidator = items &&
        items.factory._generateFunction(items, options);
    if (strictFormat)
      data.code += `
    if (!Array.isArray(value))
        return unionMatch ? Failed : error({
            message: 'Value'+(path ? ' at '+ path: '')+' must be an array',
            errorType: 'invalid-data-type',
            path
        });`;
    data.code += `
    const arr = Array.isArray(value) ? value : [value];`;

    if (minItems)
      data.code += `
    if (arr.length < ${minItems})
        return unionMatch ? Failed : error({
            message: 'Minimum accepted array length'+(path ? ' at '+ path: '')+
                ' is ${minItems}, actual ' + arr.length,
            errorType: 'invalid-value-length',
            path,                
            min: ${minItems},                
            actual: arr.length
        });`;
    if (maxItems) {
      data.code += `
    if (arr.length > ${maxItems})
        return unionMatch ? Failed : error({
            message: 'Maximum accepted array length'+(path ? ' at '+ path: '')+
                ' is ${maxItems}, actual ' + arr.length,
            errorType: 'invalid-value-length',
            path,
            max: ${maxItems},               
            actual: arr.length
        });`;
    }
    const forIterator = itemsValidator || uniqueItems;
    if (forIterator) {
      data.code += `    
    const itemsLen = arr.length;
    ${maxErrors > 1 ? 'let numErrors = 0;' : ''}
    ${itemsValidator && options.coerceTypes ? `   
    const resultArray = [];
    const lookupArray = resultArray;` : `
    const lookupArray = arr;`}

    ${itemsValidator ? `
    if (unionMatch) {
      for (let i = 0; i < itemsLen; i++) {
        if (itemsValidator(arr[i], path + '[' + i + ']', error, ctx) === Failed)
          return Failed;
      }
    }` : ''}

    if (unionMatch) return;

    for (let i = 0; i < itemsLen; i++) {
      ${itemsValidator ? `
        const v = itemsValidator(arr[i], path + '[' + i + ']', error, ctx);
        if (v === Failed) {          
          ${maxErrors >
      1 ? 'if (++numErrors >= maxErrors) return;' : 'return Failed;'}
        }
      ` : 'const v = arr[i];'}
    `;
      if (uniqueItems)
        data.code += `
        if (lookupArray.indexOf(v, i+1) >= 0)
            return error({
                message: 'Unique array contains non-unique items (' + arr[i] + ')',
                errorType: 'unique-item-error',
                path:  path + '[' + i + ']'                                  
            });`;
      data.code += `
        ${itemsValidator && options.coerceTypes ? 'resultArray.push(v);' : ''}
    }`;
    }

    data.code += `    
    if (unionMatch) return;`;

    if (options.coerceTypes)
      data.code += `            
    ${itemsValidator ? 'value = resultArray;' : 'value = arr'}`;
    return data;
  }
}

module.exports = ArrayType;
