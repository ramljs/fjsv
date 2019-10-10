'use strict';
const DataType = require('../DataType');

class ArrayType extends DataType {

  constructor(library) {
    super(library);
    this.attributes.items = undefined;
    this.attributes.minItems = undefined;
    this.attributes.maxItems = undefined;
    this.attributes.uniqueItems = undefined;
  }

  get items() {
    return this.attributes.items;
  }

  set items(v) {
    this.attributes.items = v ?
        v instanceof DataType ? v : this.library.get(v) : v;
  }

  get minItems() {
    return this.attributes.minItems;
  }

  set minItems(v) {
    if (v == null) {
      this.attributes.minItems = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for minItems attribute`);
    this.attributes.minItems = x;
  }

  get maxItems() {
    return this.attributes.maxItems;
  }

  set maxItems(v) {
    if (v == null) {
      this.attributes.maxItems = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for maxItems attribute`);
    this.attributes.maxItems = x;
  }

  get uniqueItems() {
    return this.attributes.uniqueItems;
  }

  set uniqueItems(v) {
    this.attributes.uniqueItems = v == null ? v : !!v;
  }

  assign(values, overwrite) {
    super.assign(values, overwrite);
    this._assignAttributes(['items', 'minItems', 'maxItems',
      'uniqueItems'], values, overwrite);
  }

  bake() {
    if (this._baking)
      return this;
    this._baking = true;
    try {
      super.bake();
      if (this.items)
        this.items =
            (this.items instanceof DataType ? this.items :
                this.library.get(this.items)).bake();
    } finally {
      delete this._baking;
    }
    return this;
  }

  _generateValidationCode(options, context) {
    const data = super._generateValidationCode(options, context);
    const minItems = this.minItems || 0;
    const maxItems = this.maxItems || 0;
    const {strictTypes} = options;
    const maxErrors = data.variables.maxErrors = options.maxArrayErrors;
    const uniqueItems = this.uniqueItems;
    const itemsValidator = data.variables.itemsValidator = this.items &&
        context.wrap(this.items)._generateValidateFunction(options, context);
    if (strictTypes)
      data.code += `
    if (!Array.isArray(value))
        return error({
            message: 'Value'+(path ? ' for '+ path: '')+' must be an array',
            errorType: 'invalid-data-type',
            path
        });`;
    data.code += `
    const arr = Array.isArray(value) ? value : [value];`;
    if (this.attributes.minItems)
      data.code += `
    if (arr.length < ${minItems})
        return error({
            message: 'Minimum accepted array length'+(path ? ' for '+ path: '')+
                ' is ${minItems}, actual ' + arr.length,
            errorType: 'invalid-value-length',
            path,                
            min: ${minItems},                
            actual: arr.length
        });`;
    if (maxItems) {
      data.code += `
    if (arr.length > ${maxItems})
        return error({
            message: 'Maximum accepted array length'+(path ? ' for '+ path: '')+
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
    
    for (let i = 0; i < itemsLen; i++) {
      ${itemsValidator ? `
        const v = itemsValidator(arr[i], path + '[' + i + ']', error);
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
    if (options.coerceTypes)
      data.code += `            
    ${itemsValidator ? 'value = resultArray;' : 'value = arr'}`;
    return data;
  }
}

module.exports = ArrayType;
