'use strict';
const {coerceToBoolean, coalesce} = require('putil-varhelpers');
const {AnyFactory} = require('./AnyFactory');

class BooleanFactory extends AnyFactory {

  normalizeCompileOptions(options) {
    const o = super.normalizeCompileOptions(options);
    o.strictFormat = coerceToBoolean(options.strictFormat);
    o.coerceTypes = coerceToBoolean(options.coerceTypes);
    return o;
  }

  normalizeAttribute(attr, v) {
    switch (attr) {
      case 'default':
        return coerceToBoolean(v);
      case 'strictFormat':
        return coerceToBoolean(v);
    }
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    const strictFormat = coalesce(options.strictFormat, dataType.options.strictFormat);
    data.code += `
    if (!(typeof value === 'boolean'`;
    if (!strictFormat)
      data.code +=
          ` || (value === 0 || value === 1 || value === 'false' || value === 'true')`;
    data.code += `)
    )
      return typeCheck ? Failed : ctx.logError({
          message: 'Value must be a boolean',
          errorType: 'invalid-data-type'
      });
`;

    data.code += `
    if (typeCheck) return;`;

    if (options.coerceTypes && !strictFormat)
      data.code += '\n    value = value === \'false\' ? false : !!value';
    return data;
  }

}

module.exports = {BooleanFactory};
