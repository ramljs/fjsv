'use strict';
const AnyType = require('./AnyType');

class NilType extends AnyType {

  set() {
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    data.code = '    if (value === undefined) value = null;' + data.code + `
    return unionMatch ? Failed : error({
        message: 'Value must be null',
        errorType: 'invalid-data-type',
        path
    }); `;
    return data;
  }
}

module.exports = NilType;
