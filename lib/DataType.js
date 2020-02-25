'use strict';

const promisify = require('putil-promisify');
const objectHash = require('object-hash');
const ValidationError = require('./ValidationError');
const {coalesce} = require('./helpers');

const Failed = Symbol.for('Failed');
const PROPERTY_PATTERN = /^[a-zA-Z]\w+$/;

/**
 *
 * @class DataType
 */
class DataType {

  constructor(library, typeName, factory) {
    if (!typeName)
      throw new TypeError(`You must provide type name.`);
    if (!factory || typeof factory !== 'object')
      throw new TypeError('Factory argument must be an object');
    if (typeof factory.generate !== 'function')
      throw new TypeError('Factory must contain a "generate" function');
    Object.defineProperties(this, {
      library: {
        writable: false,
        configurable: false,
        value: library
      },
      factory: {
        writable: false,
        configurable: false,
        value: factory
      },
      typeName: {
        writable: false,
        configurable: false,
        value: typeName
      }
    });
    this.options = {};
    this._fnCache = {};
  }

  create(instance, schema) {
    let proto = this;
    while (proto.predecessors) {
      const p = Object.getPrototypeOf(proto);
      if (!p.predecessors)
        break;
      proto = p;
    }
    Object.setPrototypeOf(instance, proto);
    instance.predecessors = [];
    schema = instance.schema = this.normalizeSchema(schema);

    if (schema.type) {
      const library = this.library;
      const stack = library._stack;
      stack.push('type');
      const types = Array.isArray(schema.type) ? schema.type : [schema.type];
      for (const sch of types) {
        if (sch === this.typeName)
          continue;
        const t = library.getType(sch);
        if (!(t.factory === instance.factory)) { // noinspection ExceptionCaughtLocallyJS
          throw new Error(`"${instance.typeName}" type can't be mixed with "${t.typeName}" type.`);
        }
        instance.predecessors.push(t);
      }
      stack.pop();
    }
    return instance;
  }

  normalizeSchema(schema) {
    const normalized = {};
    const library = this.library;
    if (schema.type) {
      let a = Array.isArray(schema.type) ? schema.type : [schema.type];
      a = a.map(s => {
        if (typeof s === 'string')
          s = library._parseTypeName(s);
        if (typeof s === 'string')
          return s;
        return library.normalizeSchema(s);
      });
      if (a.length <= 1) {
        if (typeof a[0] === 'object')
          Object.assign(schema, a[0]);
        else
          normalized.type = a[0];
      } else normalized.type = a;
    }
    if (this.factory.normalizeAttribute) {
      const stack = this.library._stack;
      for (const key of Object.keys(schema)) {
        let v = schema[key];
        if (v === undefined || key === 'type')
          continue;
        /* istanbul ignore else */
        stack.push(key);
        v = this.factory.normalizeAttribute(key, schema[key], schema);
        if (v !== undefined)
          normalized[key] = v;
        /* istanbul ignore else */
        stack.pop();
      }
    }
    return normalized;
  }

  generate(options = {}) {
    options.throwOnError =
        coalesce(options.throwOnError, this.library.throwOnError);
    /* istanbul ignore else */
    const preparedOptions = this.factory.normalizeCompileOptions ?
        this.factory.normalizeCompileOptions(options) : options;
    Object.keys(preparedOptions).forEach(k => {
      if (preparedOptions[k] === undefined)
        delete preparedOptions[k];
    });

    // Lookup for cached validator for same options
    const cacheId = objectHash({
      schema: this.schema,
      defaults: this.options,
      options
    });
    let validate = this._fnCache[cacheId];
    if (validate)
      return validate;

    this._fnCache[cacheId] = function() {
      return validate.apply(this, arguments);
    };

    const fn = this.factory.generate(this, preparedOptions, options);

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
    this._fnCache[cacheId] = validate;
    validate.dataType = this;
    return validate;
  }

  get(attr) {
    let v;
    v = this.schema[attr];
    if (v !== undefined)
      return v;
    if (this.predecessors) {
      let i = this.predecessors.length;
      while (i--) {
        v = this.predecessors[i].get(attr);
        if (v !== undefined)
          return v;
      }
    }
  }

}

module.exports = {DataType, Failed};
