'use strict';

const {coerceToBool, coerceToString} = require('../helpers');

const Failed = Symbol.for('Failed');

/**
 *
 * @class AnyType
 */
class AnyType {

  set(dataType, attr, value) {
    if (attr === 'default')
      dataType.default = value;
  }

  compile(dataType, options) {
    const defaultVal = dataType.default;
    const varNames = ['dataType', 'Failed'];
    const varValues = [dataType, Failed];
    if (defaultVal !== undefined) {
      varNames.push('defaultVal');
      varValues.push(defaultVal);
    }
    const o = this._generateValidationCode(dataType, options);
    /* istanbul ignore else */
    if (o.variables)
      for (const n of Object.keys(o.variables)) {
        varNames.push(n);
        varValues.push(o.variables[n]);
      }
    const code = `return (value, ctx) => {
  ${defaultVal !== undefined ?
        'if (value == null) value = defaultVal;' : ''}             
  ${o.code}
  return value;
}`;
    return new Function(...varNames, code)(...varValues);
  }

  prepareCompileOptions(options) {
    return {
      name: coerceToString(options.name),
      resolvePromises: coerceToBool(options.resolvePromises),
      throwOnError: coerceToBool(options.throwOnError)
    };
  }

  _generateValidationCode(dataType, options) {
    const data = {code: '', variables: {}};
    data.variables.name = options.name || dataType.name;

    const enums = dataType.enum;
    if (enums)
      data.variables.enums = new Set(enums);

    data.code += `
    if (value == null) return value;
    const typeCheck = ctx && ctx.typeCheck;
    `;

    if (enums)
      data.code += `
    if (!enums.has(value))
        return typeCheck ? Failed : ctx.logError({
            message: 'Value must be a one of the enumerated values',
            errorType: 'invalid-enum-value'            
        });`;

    return data;
  }

}

module.exports = {AnyType};
