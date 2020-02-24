'use strict';
const {AnyFactory} = require('./AnyFactory');
const {coerceToBool, coalesce} = require('../helpers');

class BooleanFactory extends AnyFactory {

  normalizeCompileOptions(options) {
    const o = super.normalizeCompileOptions(options);
    o.strictFormat = coerceToBool(options.strictFormat);
    o.coerceTypes = coerceToBool(options.coerceTypes);
    return o;
  }

  normalizeAttribute(attr, v) {
    switch (attr) {
      case 'default':
        return coerceToBool(v);
      case 'strictFormat':
        return coerceToBool(v);
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
