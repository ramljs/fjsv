'use strict';
const {AnyFactory} = require('./AnyFactory');

class FunctionFactory extends AnyFactory {

  normalizeAttribute(attr, v) {
    switch (attr) {
      case 'default':
        if (v && typeof v !== 'function')
          throw new TypeError(`"${v}" is not a Function`);
        return v;
    }
    return super.normalizeAttribute(attr, v);
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    data.code += `
    if (typeof value !== 'function')
      return typeCheck ? Failed : ctx.logError({
          message: 'Value must be a function',
          errorType: 'invalid-data-type'
      });`;
    return data;
  }
}

module.exports = {FunctionFactory};
