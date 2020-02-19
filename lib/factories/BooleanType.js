'use strict';
const {AnyType} = require('./AnyType');
const {coerceToBool, mapDistinct, coalesce} = require('../helpers');

class BooleanType extends AnyType {

  set(dataType, asset, v) {
    switch (asset) {
      case 'default': {
        dataType.default = coerceToBool(v);
        return;
      }
      case 'enum': {
        if (v) {
          if (!Array.isArray(v))
            throw new TypeError(`"${v}" is not an array value.`);
          dataType.enum = mapDistinct(v, coerceToBool);
        } else
          dataType.enum = undefined;
        return;
      }
      case 'strictFormat':
        dataType.strictFormat = coerceToBool(v);
        return;
    }
    super.set(asset, v);
  }

  prepareCompileOptions(options) {
    const o = super.prepareCompileOptions(options);
    o.strictFormat = coerceToBool(options.strictFormat);
    o.coerceTypes = coerceToBool(options.coerceTypes);
    return o;
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    const strictFormat = coalesce(options.strictFormat, dataType.strictFormat);
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

module.exports = {BooleanType};
