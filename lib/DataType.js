'use strict';

const ValidationError = require('./ValidationError');
const GeneratorContext = require('./GeneratorContext');
const {deepResolvePromises} = require('./helpers');

const Failed = Symbol.for('Failed');

/**
 *
 * @class DataType
 */
class DataType {

  constructor(library) {
    this.library = library;
    this._baseName = null;
    this.attributes = {
      type: [],
      name: undefined,
      required: undefined,
      default: undefined,
      readonly: undefined,
      writeonly: undefined
    };
  }

  get baseName() {
    return this._baseName || this.name;
  }

  get type() {
    return this.attributes.type;
  }

  set type(v) {
    this.attributes.type = v == null ? v :
        (Array.isArray(v) ? v : [v]);
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
    this._assignAttributes(['type', 'name', 'default', 'required',
          'readonly', 'writeonly'],
        values, overwrite);
  }

  createNew(library, def) {
    const Clazz = Object.getPrototypeOf(this).constructor;
    const t = new Clazz(library || this.library);
    t._baseName = this._baseName;
    if (def)
      t.assign(def);
    return t;
  }

  clone() {
    const t = this.createNew();
    Object.assign(t.attributes, this.attributes);
    return t;
  }

  bake() {
    const types = Array.isArray(this.type) ? this.type : [this.type];
    this.type = types.reduce((a, t) => {
      a.push((t instanceof DataType ? t :
              this.library.get(t)
      ).bake());
      return a;
    }, []);
    return this;
  }

  flatten() {
    const x = this._flatten(null, this.name);
    if (Array.isArray(x)) {
      const t = this.library.get({
        type: 'union',
        anyOf: x,
        name: this.name,
        required: this.required,
        readonly: this.readonly,
        writeonly: this.writeonly
      });
      t.type = [];
      t.bake();
      return t;
    }
    return x;
  }

  validator(options = {}) {
    const context = new GeneratorContext(this.library);
    const wrapped = context.wrap(this);
    const validate = wrapped._generateValidateFunction(options, context);
    const throwOnError = options.throwOnError;
    const finalize = (value, v, errors) => {
      const valid = v !== Failed;
      if (throwOnError && errors.length) {
        const ee = new ValidationError(errors[0].message);
        // @ts-ignore
        ee.errors = errors;
        ee.type = wrapped;
        ee.value = value;
        Object.assign(ee, errors[0]);
        throw ee;
      }
      return errors.length ? {valid, errors} : {valid, value: v};
    };
    return options.resolvePromises ?
        async (value, currentPath) => {
          const errors = [];
          const errorFn = (e) => {
            errors.push(e);
            return Failed;
          };
          return finalize(value,
              await validate(value, (currentPath || ''), errorFn, {}), errors);
        } :
        (value, currentPath) => {
          const errors = [];
          const errorFn = (e) => {
            errors.push(e);
            return Failed;
          };
          return finalize(value,
              validate(value, (currentPath || ''), errorFn, {}), errors);
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

  _flatten(target, name) {
    if (!target)
      target = this.createNew();
    target = this.type.reduce((target, t) => {
      t = t instanceof DataType ? t : this.library.get(t);
      return t._flatten(target, name);
    }, target);
    const Clazz = Object.getPrototypeOf(this).constructor;
    const targets = Array.isArray(target) ? target : [target];
    targets.forEach(t => {
      if (!(t instanceof Clazz)) {
        throw new TypeError(`Can\'t mix "${t.baseName}" ` +
            (name ? '(' + name + ') ' : /* istanbul ignore next */'') +
            `with "${this.baseName}" ` +
            (this.name ? '(' + this.name +
                ') ' : /* istanbul ignore next */'') +
            'type.'
        );
      }
      t.assign(this, true);
      t.type = [];
    });
    return target;
  }

  _generateValidateFunction(options, context) {
    let fn = context.getFn(this, options);
    if (fn)
      return fn;

    context.setFn(this, options, function() {
      return fn.apply(this, arguments);
    });

    const defaultVal = this._getDefault();
    const varNames = ['Failed'];
    const varValues = [Failed];
    if (defaultVal !== undefined) {
      varNames.push('defaultVal');
      varValues.push(defaultVal);
    }
    const o = this._generateValidationCode(options, context);
    /* istanbul ignore else */
    if (o.variables)
      for (const n of Object.keys(o.variables)) {
        varNames.push(n);
        varValues.push(o.variables[n]);
      }
    const code = `return${options.resolvePromises ? ' async' : ''} (value, path, error, ctx) => {
  ${defaultVal !== undefined ?
        'if (value == null) value = defaultVal;' : ''}             
  ${o.code}
  return${options.resolvePromises ? ' await' : ''} value;
}`;
    fn = new Function(...varNames, code)(...varValues);
    context.setFn(this, options, fn);
    return fn;
  }

  _generateValidationCode(options) {
    const data = {code: '', variables: {}};
    data.variables.name = options.name || this.displayName || this.name;
    if (options.resolvePromises)
      data.variables.deepResolvePromises = deepResolvePromises;

    if (this._getRequired() && !options.ignoreRequire) {
      data.code += `
    if (value == null)
        return (ctx && ctx.unionMatch) ? Failed : error({
            message: 'Value required' + (path ? ' for '+ path: ''),
            errorType: 'value-required',
            path
        });
`;
    }
    data.code += `
    if (value == null) return value;
    const unionMatch = ctx && ctx.unionMatch;
    ${options.resolvePromises ? 'value = await deepResolvePromises(value);' : ''}
    `;

    return data;
  }

}

module.exports = DataType;
