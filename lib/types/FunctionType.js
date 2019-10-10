'use strict';
const DataType = require('../DataType');

class FunctionType extends DataType {

  get default() {
    return this.attributes.default;
  }

  set default(v) {
    if (v && typeof v !== 'function')
      throw new TypeError(`"${v}" is not a Function for default attribute`);
    this.attributes.default = v;
  }

  _generateValidationCode(options, fnCache) {
    const data = super._generateValidationCode(options, fnCache);
    data.code += `
            if (typeof value !== 'function')
              return error({
                  message: 'Value must be a function',
                  errorType: 'invalid-data-type',
                  path
              });`;
    return data;
  }
}

module.exports = FunctionType;
