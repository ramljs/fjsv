'use strict';
const {coerceToString} = require('putil-varhelpers');
const {AnyFactory} = require('./AnyFactory');

const Base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

class Base64Factory extends AnyFactory {

  normalizeAttribute(attr, v) {
    switch (attr) {
      case 'default':
        return coerceToString(v);
    }
    return super.normalizeAttribute(attr, v);
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    data.variables.base64Pattern = Base64Pattern;

    data.code += `        
    if (!(typeof value === 'string' && value.match(base64Pattern)))
      return typeCheck ? Failed : ctx.logError({
          message: 'Value must be base64 encoded string',
          errorType: 'invalid-data-type'
      });`;
    return data;
  }
}

module.exports = {Base64Factory};
