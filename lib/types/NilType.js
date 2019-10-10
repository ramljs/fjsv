'use strict';
const DataType = require('../DataType');

class NilType extends DataType {

  get default() {
    return undefined;
  }

  set default(v) {
    this.attributes.default = undefined;
  }

  get required() {
    return undefined;
  }

  set required(v) {
    this.attributes.default = undefined;
  }

  _getRequired() {
    return false;
  }

  _getDefault() {
    return undefined;
  }

  _generateValidationCode(options, fnCache) {
    const data = super._generateValidationCode(options, fnCache);
    data.code = '    if (value === undefined) value = null;' + data.code + `
    return error({
        message: 'Value must be null',
        errorType: 'invalid-data-type',
        path
    }); `;
    return data;
  }
}

module.exports = NilType;
