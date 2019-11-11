'use strict';

const promisify = require('putil-promisify');
const merge = require('putil-merge');
const ValidationError = require('./ValidationError');

const Failed = Symbol.for('Failed');

/**
 *
 * @class TypeFactory
 */
class TypeFactory {

  get default() {
    return this.default;
  }

  set default(v) {
    this.setAttribute('default', v);
  }

  get enum() {
    return this.enum;
  }

  set enum(v) {
    this.setAttribute('enum', v);
  }

  parse(v) {
    return v;
  }

  clone() {
    const cloned = {};
    Object.setPrototypeOf(cloned, Object.getPrototypeOf(this));
    cloned.attributes = {};
    cloned.mixin(this);
    return cloned;
  }

  mixin(src) {
    let attr;
    if (src instanceof TypeFactory) {
      if (this.typeName !== src.typeName) {
        throw new Error(`"${this.typeName}" type can't be mixed with "${src.typeName}" type.`);
      }
      attr = src.attributes;
    } else attr = src;
    if (attr) {
      const stack = this.library._stacks[this.library._stacks.length - 1];
      Object.keys(attr).forEach(k => {
        if (stack) stack.push(k);
        this.setAttribute(k, attr[k]);
        if (stack) stack.pop();
      });
    }
  }

  getAttribute(attr) {
    if (!this.attributes)
      return;
    if (this.attributes[attr] !== undefined)
      return this.attributes[attr];
    if (this.type && this.type.length)
      for (let i = this.type.length - 1; i >= 0; i--) {
        const v = this.type[i].getAttribute(attr);
        if (v !== undefined)
          return v;
      }
  }

  setAttribute(asset, v) {
    if (v === undefined)
      delete this[asset];
    switch (asset) {
      case 'default':
        this.default = this.parse(v);
        return;
      case 'enum':
        if (v && !Array.isArray(v))
          throw new TypeError(`"${v}" is not an array value.`);
        this.enum = v == null ? v :
            v.reduce((a, x) => {
              if (x != null)
                a.push(this.parse(x));
              return a;
            }, []);
        return;
    }
  }

  compile(options = {}) {
    options = merge({}, this._buildValidateOptions(options), {
      filter: (o, n, v) => o[n] != null
    });
    const validate = this._generateFunction(options);
    const throwOnError = options.throwOnError != null ?
        options.throwOnError : this.library.defaults.throwOnError;
    const callValidate = (value, currentPath) => {
      const errors = [];
      const errorFn = (e) => {
        errors.push(e);
        return Failed;
      };
      const v = validate(value, (currentPath || ''), errorFn, {});
      const valid = v !== Failed;
      if (throwOnError && errors.length) {
        const ee = new ValidationError(errors[0].message);
        // @ts-ignore
        ee.errors = errors;
        ee.schema = this.schema;
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

  _buildValidateOptions(options) {
    return {
      name: options.name,
      resolvePromises: options.resolvePromises,
      throwOnError: options.throwOnError
    };
  }

  _generateFunction(options) {
    // Lookup for cached validator for same options
    const optsstr = JSON.stringify(options);
    this._cache = this._cache || {};
    let fn = this._cache[optsstr];
    if (fn)
      return fn;

    //
    this._cache[optsstr] = function() {
      return fn.apply(this, arguments);
    };

    const defaultVal = this.getAttribute('default');
    const varNames = ['parse', 'Failed'];
    const varValues = [(v) => this.parse(v), Failed];
    if (defaultVal !== undefined) {
      varNames.push('defaultVal');
      varValues.push(defaultVal);
    }
    const o = this._generateValidationCode(options);
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
    fn = new Function(...varNames, code)(...varValues);
    this._cache[optsstr] = fn;
    return fn;
  }

  _generateValidationCode(options) {
    const data = {code: '', variables: {}};
    data.variables.name = options.name || this.displayName || this.name;

    const enums = this.getAttribute('enum');
    if (enums)
      data.variables.enums = new Set(enums);

    data.code += `
    if (value == null) return value;
    const unionMatch = ctx && ctx.unionMatch;
    `;

    if (enums)
      data.code += `
    if (!enums.has(parse(value)))
        return unionMatch ? Failed : error({
            message: 'Value'+(path ? ' at '+ path: '') + ' must be a one of the enumerated values',
            errorType: 'invalid-enum-value',
            path
        });`;

    return data;
  }

}

module.exports = TypeFactory;
