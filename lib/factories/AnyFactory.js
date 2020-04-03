'use strict';

const {coerceToBoolean, coerceToString} = require('putil-varhelpers');

const Failed = Symbol.for('Failed');

/**
 *
 * @class AnyFactory
 */
class AnyFactory {

  normalizeCompileOptions(options) {
    return {
      displayName: coerceToString(options.displayName),
      resolvePromises: coerceToBoolean(options.resolvePromises),
      throwOnError: coerceToBoolean(options.throwOnError)
    };
  }

  normalizeAttribute(attr, v) {
    switch (attr) {
      case 'default':
        return v;
    }
  }

  generate(dataType, options) {
    const defaultValue = dataType.get('default');
    const varNames = ['dataType', 'Failed', 'defaultValue'];
    const varValues = [dataType, Failed, defaultValue];
    const o = this._generateValidationCode(dataType, options);
    /* istanbul ignore else */
    if (o.variables)
      for (const n of Object.keys(o.variables)) {
        varNames.push(n);
        varValues.push(o.variables[n]);
      }
    const code = `return (value, ctx) => {
  ${defaultValue !== undefined ?
        'if (value == null) value = defaultValue;' : ''}             
  ${o.code}
  return value;
}`;
    return new Function(...varNames, code)(...varValues);
  }

  _generateValidationCode(dataType, options) {
    const data = {code: '', variables: {}};
    data.variables.name = options.displayName || dataType.name;

    data.code += `
    if (value == null) return value;
    const typeCheck = ctx && ctx.typeCheck;
    `;

    const enumValues = dataType.get('enum');
    if (enumValues) {
      data.variables.enums = new Set(enumValues);
      data.code += `
    if (!enums.has(value))
        return typeCheck ? Failed : ctx.logError({
            message: 'Value must be a one of the enumerated values.',
            errorType: 'invalid-enum-value'            
        });`;
    }

    return data;
  }

}

module.exports = {AnyFactory};
