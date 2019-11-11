'use strict';
const AnyType = require('./AnyType');

class FunctionType extends AnyType {

  set(dataType, attr, v) {
    switch (attr) {
      case 'enum':
        return;
      case 'default': {
        if (v && typeof v !== 'function')
          throw new TypeError(`"${v}" is not a Function`);
        dataType.default = v;
        return;
      }
    }
    super.set(attr, v);
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    data.code += `
    if (typeof value !== 'function')
      return unionMatch ? Failed : ctx.logError({
          message: 'Value must be a function',
          errorType: 'invalid-data-type'
      });`;
    return data;
  }
}

module.exports = FunctionType;
