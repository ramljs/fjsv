'use strict';

const merge = require('putil-merge');

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

  create(instance, schema) {
    if (instance instanceof DataType) {
      if (!(this.factory === instance.factory ||
          this.factory instanceof instance.factory))
        throw new Error(`"${this.typeName}" type can't be mixed with "${instance.typeName}" type.`);
    } else {
      instance = instance || {};
      let proto = Object.getPrototypeOf(this);
      proto = proto instanceof DataType ? proto : this;
      Object.setPrototypeOf(instance, proto);
      instance.name = schema.name || instance.name || 'anonymous';
      instance.schema = schema;
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

  compile(options) {
    if (this.factory.prepareCompileOptions)
      options = this.factory.prepareCompileOptions(options);
    options = merge({}, options, {
      filter: (o, n, v) => o[n] != null
    });
    // Lookup for cached validator for same options
    const optsstr = JSON.stringify(options);
    this._cache = this._cache || {};
    let fn = this._cache[optsstr];
    if (fn)
      return fn;

    this._cache[optsstr] = function() {
      return fn.apply(this, arguments);
    };

    fn = this.factory.compile(this, options);
    this._cache[optsstr] = fn;
    fn.dataType = this;
    return fn;
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
        this.factory.set(this, k, src[k]);
        if (stack) stack.pop();
      });
    }
    return this;
  }

}

module.exports = DataType;
