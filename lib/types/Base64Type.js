'use strict';
const AnyType = require('./AnyType');
const {coerceToString} = require('../helpers');

const Base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

class Base64Type extends AnyType {

  set(dataType, attr, v) {
    switch (attr) {
      case 'enum':
        return;
      case 'default': {
        dataType[attr] = coerceToString(v);
        return;
      }
    }
    super.set(attr, v);
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    data.variables.base64Pattern = Base64Pattern;

    data.code += `        
    if (!(typeof value === 'string' && value.match(base64Pattern)))
      return unionMatch ? Failed : ctx.logError({
          message: 'Value must be base64 encoded string',
          errorType: 'invalid-data-type'
      });`;
    return data;
  }
}

module.exports = Base64Type;
