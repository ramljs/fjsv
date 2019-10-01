'use strict';

const ValidationError = require('./ValidationError');
const {coalesce} = require('./helpers');

/**
 *
 * @class DataType
 */
class DataType {

  constructor(library) {
    this.library = library;
    this.type = [];
    this.attributes = {
      name: undefined,
      required: undefined,
      default: undefined,
      readonly: undefined,
      writeonly: undefined
    };
  }

  get baseType() {
    return this.type.length ? this.type[0].baseType : this.name;
  }

  get name() {
    return this.attributes.name;
  }

  set name(v) {
    this.attributes.name = v == null ? v : ('' + v);
  }

  get required() {
    return this.attributes.required;
  }

  set required(v) {
    this.attributes.required = v == null ? v : !!v;
  }

  get default() {
    return this.attributes.default;
  }

  set default(v) {
    this.attributes.default = v;
  }

  get readonly() {
    return this.attributes.readonly;
  }

  set readonly(v) {
    this.attributes.readonly = v == null ? v : !!v;
  }

  get writeonly() {
    return this.attributes.writeonly;
  }

  set writeonly(v) {
    this.attributes.writeonly = v == null ? v : !!v;
  }

  assign(values, overwrite) {
    this._assignAttributes(['name', 'default', 'required', 'readonly',
          'writeonly'],
        values, overwrite);
  }

  createNew(library) {
    const Clazz = Object.getPrototypeOf(this).constructor;
    return new Clazz(library || this.library);
  }

  extend(library, def) {
    const t = this.createNew(library);
    if (def)
      t.assign(def);
    t.type.push(this);
    return t;
  }

  clone() {
    const Clazz = Object.getPrototypeOf(this).constructor;
    const t = new Clazz(this.library);
    Object.assign(t.attributes, this.attributes);
    t.type.push(...this.type);
    return t;
  }

  flatten() {
    if (!this.type.length)
      return this.clone();
    const t = this.type[0].clone();
    t.library = this.library;
    return this._flatten(t, this.name);
  }

  _flatten(target, name) {
    const Clazz = Object.getPrototypeOf(this).constructor;
    if (!(target instanceof Clazz)) {
      throw new TypeError(`Can\'t mix "${target.baseType}" ` +
          (name ? '(' + name + ') ' : '') +
          `with "${this.baseType}" ` +
          (this.name ? '(' + this.name + ') ' : '') +
          'type.'
      );
    }
    this.type.reduce((target, t) =>
        t._flatten(target, name), target);
    target.assign(this, true);
    return target;
  }

  validator(options = {}) {
    const validate = this._generateValidateFunction(options);
    const throwOnError = options.throwOnError;
    return (value) => {
      const errors = [];
      const errorFn = (e) => {
        errors.push(e);
      };
      const v = validate(value, this.name, errorFn, {});
      const valid = v !== undefined;
      if (!valid && !errors.length) {
        errorFn({
          message: 'Validation failed',
          errorType: 'unknown'
        });
      }
      if (throwOnError && errors.length) {
        const ee = new ValidationError(errors[0].message);
        // @ts-ignore
        ee.errors = errors;
        ee.type = this;
        ee.value = value;
        Object.assign(ee, errors[0]);
        throw ee;
      }
      return errors.length ? {valid, errors} : {valid, value: v};
    };
  }

  _getRequired() {
    const v = this.required;
    return v != null ? v :
        (this.library && this.library.defaults.required);
  }

  _getDefault() {
    return this.default;
  }

  _assignAttributes(keys, values, overwrite) {
    overwrite = overwrite || overwrite == null;
    keys.forEach((k => {
      if (values[k] !== undefined && (overwrite || this[k] === undefined))
        this[k] = values[k];
    }));
  }

  _generateValidateFunction(options) {
    const defaultVal = this._getDefault();
    const flattened = this.flatten();
    const varNames = [];
    const varValues = [];
    if (defaultVal !== undefined) {
      varNames.push('defaultVal');
      varValues.push(defaultVal);
    }
    const o = flattened._generateValidationCode(options);
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

  _generateValidationCode(options) {
    const data = {code: '', variables: {}};
    data.variables.name = options.name || this.displayName || this.name;
    if (this._getRequired() &&
        (options.ignoreRequire !== true ||
            (Array.isArray(options.ignoreRequire) &&
                options.ignoreRequire.includes(this.name)))) {
      data.code += `     
    if (value == null) {
        error({
            message: 'Value required for ' + (ctx && ctx.name || name),
            errorType: 'value-required',
            path
        });
        return;
    }
`;
    }
    data.code += `
    if (value == null) return value;   
    `;
    return data;
  }

}

module.exports = DataType;
