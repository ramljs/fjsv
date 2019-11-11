'use strict';

const merge = require('putil-merge');
const promisify = require('putil-promisify');
const ValidationError = require('./ValidationError');

const Failed = Symbol.for('Failed');

/**
 *
 * @class DataType
 */
class DataType {

  constructor(library, name, factory) {
    if (!name)
      throw new TypeError(`You must provide type name.`);
    if (typeof factory !== 'object')
      throw new TypeError('Factory argument must be an object');
    if (typeof factory.compile !== 'function')
      throw new TypeError('Factory must contain a "compile" function');
    this.library = library;
    this.factory = factory;
    this.typeName = name;
  }

  create(instance) {
    if (instance instanceof DataType) {
      if (!(this.factory === instance.factory ||
          this.factory instanceof instance.factory))
        throw new Error(`"${this.typeName}" type can't be mixed with "${instance.typeName}" type.`);
    } else {
      instance = instance || {};
      let proto = Object.getPrototypeOf(this);
      proto = proto instanceof DataType ? proto : this;
      Object.setPrototypeOf(instance, proto);
      instance.name = instance.name || 'anonymous';
      if (this.factory.create)
        this.factory.create(instance);
    }
    return instance;
  }

  clone() {
    const cloned = this.create({}, {...this.schema});
    cloned.name = 'anonymous';
    cloned.merge(this);
    return cloned;
  }

  compile(options = {}) {
    if (this.factory.prepareCompileOptions)
      options = this.factory.prepareCompileOptions(options);
    options = merge({}, options, {
      filter: (o, n, v) => o[n] != null
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

    validate = this.factory.compile(this, options);
    this._cache[optsstr] = validate;
    validate.dataType = this;

    const callValidate = (value, ctx) => {
      ctx = ctx || {};
      ctx.path = ctx.path || [];
      ctx.errors = ctx.errors || [];
      ctx.logError = (e) => {
        if (ctx.path.length)
          e.path = ctx.path.slice();
        ctx.errors.push(e);
        return Failed;
      };

      const v = validate(value, ctx);
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

    return options.resolvePromises ?
        async (value, ctx) => {
          value = await promisify.deepResolve(value);
          return callValidate(value, ctx);
        } :
        (value, ctx) => callValidate(value, ctx);
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
        if (stack) stack.push(k);
        this.factory.set(this, k, src[k], src);
        if (stack) stack.pop();
      });
    }
    return this;
  }

}

module.exports = DataType;
DataType.Failed = Failed;
