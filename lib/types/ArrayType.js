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

  solidify() {
    if (this._solidifying)
      return this;
    this._solidifying = true;
    try {
      super.solidify();
      if (this.items)
        this.items =
            (this.items instanceof DataType ? this.items :
                this.library.get(this.items)).solidify();
    } finally {
      delete this._solidifying;
    }
    return this;
  }

  _generateValidationCode(options) {
    const data = super._generateValidationCode(options);
    const minItems = this.minItems || 0;
    const maxItems = this.maxItems || 0;
    const {strictTypes} = options;
    const maxErrors = data.variables.maxErrors = options.maxArrayErrors;
    const uniqueItems = this.uniqueItems;
    const itemsValidator = data.variables.itemsValidator =
        this.items && this.items._generateValidateFunction(options);
    if (strictTypes)
      data.code += `
    if (!Array.isArray(value)) {
        error({
            message: 'Value must be an array',
            errorType: 'invalid-data-type',
            path
        });
        return;
    }`;
    data.code += `
    const arr = Array.isArray(value) ? value : [value];`;
    if (this.attributes.minItems)
      data.code += `
    if (arr.length < ${minItems}) {
        error({
            message: 'Minimum accepted array length is ${minItems}, actual ' + arr.length,
            errorType: 'invalid-value-length',
            path,                
            min: ${minItems},                
            actual: arr.length
        });
        return;
    }`;
    if (maxItems) {
      data.code += `
    if (arr.length > ${maxItems}) {
        error({
            message: 'Maximum accepted array length is ${maxItems}, actual ' + arr.length,
            errorType: 'invalid-value-length',
            path,
            max: ${maxItems},               
            actual: arr.length
        });
        return;
    }`;
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
        if (v === undefined) {
          ${maxErrors > 1 ? 'if (++numErrors >= maxErrors) return;' : 'return;'}
        }
      ` : 'const v = arr[i];'}
    `;
      if (uniqueItems)
        data.code += `
        if (lookupArray.indexOf(v, i+1) >= 0) {
            error({
                message: 'Unique array contains non-unique items (' + arr[i] + ')',
                errorType: 'unique-item-error',
                path:  path + '[' + i + ']'                                  
            });
            return;
        }`;
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
