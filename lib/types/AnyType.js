'use strict';

const promisify = require('putil-promisify');
const ValidationError = require('../ValidationError');
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
    const validate = this._generateFunction(dataType, options);
    const callValidate = (value, currentPath) => {
      const errors = [];
      const errorFn = (e) => {
        errors.push(e);
        return Failed;
      };
      const v = validate(value, (currentPath || ''), errorFn, {});
      const valid = v !== Failed;
      if (options.throwOnError && errors.length) {
        const ee = new ValidationError(errors[0].message);
        // @ts-ignore
        ee.errors = errors;
        if (dataType.schema)
          ee.schema = dataType.schema;
        ee.value = value;
        Object.assign(ee, errors[0]);
        throw ee;
      }
      return errors.length ? {valid, errors} : {valid, value: v};
    };

    return options.resolvePromises ?
        async (value, currentPath) => {
          value = await promisify.deepResolve(value);
          return callValidate(value, currentPath);
        } :
        (value, currentPath) => callValidate(value, currentPath);
  }

  prepareCompileOptions(options = {}) {
    return {
      name: coerceToString(options.name),
      resolvePromises: coerceToBool(options.resolvePromises),
      throwOnError: coerceToBool(options.throwOnError)
    };
  }

  _generateFunction(dataType, options) {
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
    const code = `return (value, path, error, ctx) => {
  ${defaultVal !== undefined ?
        'if (value == null) value = defaultVal;' : ''}             
  ${o.code}
  return value;
}`;
    return new Function(...varNames, code)(...varValues);
  }

  _generateValidationCode(dataType, options) {
    const data = {code: '', variables: {}};
    data.variables.name = options.name || dataType.name;

    const enums = dataType.enum;
    if (enums)
      data.variables.enums = new Set(enums);

    data.code += `
    if (value == null) return value;
    const unionMatch = ctx && ctx.unionMatch;
    `;

    if (enums)
      data.code += `
    if (!enums.has(value))
        return unionMatch ? Failed : error({
            message: 'Value'+(path ? ' at '+ path: '') + ' must be a one of the enumerated values',
            errorType: 'invalid-enum-value',
            path
        });`;

    return data;
  }

}

module.exports = AnyType;
