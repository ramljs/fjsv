'use strict';

const merge = require('putil-merge');
const promisify = require('putil-promisify');
const ValidationError = require('./ValidationError');

const Failed = Symbol.for('Failed');
const PROPERTY_PATTERN = /^[a-zA-Z]\w+$/;

/**
 *
 * @class DataType
 */
class DataType {

  constructor(library, name, factory) {
    if (!name)
      throw new TypeError(`You must provide type name.`);
    if (!factory || typeof factory !== 'object')
      throw new TypeError('Factory argument must be an object');
    if (typeof factory.compile !== 'function')
      throw new TypeError('Factory must contain a "compile" function');
    this.library = library;
    this.factory = factory;
    this.typeName = name;
  }

  create(instance) {
    instance = instance || {};
    let proto = Object.getPrototypeOf(this);
    proto = proto instanceof DataType ? proto : this;
    Object.setPrototypeOf(instance, proto);
    instance.name = instance.name || 'anonymous';
    if (this.factory.create)
      this.factory.create(instance);
    return instance;
  }

  clone() {
    const cloned = this.create({}, {...this.schema});
    cloned.name = 'anonymous';
    cloned.merge(this);
    return cloned;
  }

  compile(options = {}) {
    /* istanbul ignore else */
    if (this.factory.prepareCompileOptions)
      options = this.factory.prepareCompileOptions(options);
    options = merge({}, options, {
      filter: (o, n) => o[n] != null
    });
    // Lookup for cached validator for same options
    const optsstr = JSON.stringify(options);
    this._cache = this._cache || {};
    let validate = this._cache[optsstr];
    if (validate)
      return validate;

    this._cache[optsstr] = function() {
      return validate.apply(this, arguments);
    };

    const fn = this.factory.compile(this, options);

    const callValidate = (value, ctx) => {
      ctx = ctx || {};
      const _path = ctx.path = ctx.path || [];
      ctx.errors = ctx.errors || [];
      ctx.logError = ctx.logError || (
          (e) => {
            if (ctx.path.length)
              e.path = ctx.path.slice();
            const s = ctx.getPath();
            if (s)
              e.message = 'Error at "' + s + '". ' + e.message;
            ctx.errors.push(e);
            return Failed;
          });
      ctx.getPath = ctx.getPath || (() => {
        let s = '';
        const len = _path.length;
        for (let i = 0; i < len; i++) {
          const x = _path[i];
          if (typeof x === 'number')
            s += '[' + x + ']';
          else if (x.match(PROPERTY_PATTERN))
            /* istanbul ignore next */
            s += (s ? '.' : '') + x;
          else
            s += '[' + x.replace(/'/g, '\\\'') + ']';
        }
        return s;
      });

      const v = fn(value, ctx);
      const valid = v !== Failed;
      if (options.throwOnError && ctx.errors.length) {
        const ee = new ValidationError(ctx.errors[0].message);
        // @ts-ignore
        ee.errors = ctx.errors;
        ee.value = value;
        Object.assign(ee, ctx.errors[0]);
        throw ee;
      }
      return ctx.errors.length ?
          {valid, errors: ctx.errors} :
          {valid, value: v};
    };

    validate = options.resolvePromises ?
        async (value, ctx) => {
          value = await promisify.deepResolve(value);
          return callValidate(value, ctx);
        } :
        (value, ctx) => callValidate(value, ctx);
    this._cache[optsstr] = validate;
    validate.dataType = this;
    return validate;
  }

  merge(src) {
    if (src instanceof DataType)
      if (!(this.factory === src.factory))
        throw new Error(`"${this.typeName}" type can't be mixed with "${src.typeName}" type.`);

    if (this.factory.set) {
      const stack = this.library._stacks[this.library._stacks.length - 1];
      Object.keys(src).forEach(k => {
        if (['name', 'library', 'factory', 'type'].includes(k))
          return;
        /* istanbul ignore else */
        if (stack) stack.push(k);
        this.factory.set(this, k, src[k], src);
        /* istanbul ignore else */
        if (stack) stack.pop();
      });
    }
    return this;
  }

}

module.exports = DataType;
DataType.Failed = Failed;
