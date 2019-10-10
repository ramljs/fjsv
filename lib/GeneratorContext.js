'use strict';
const {isDeepStrictEqual} = require('util');

class GeneratorContext {

  constructor(library) {
    this.library = library;
    this.defaults = library.defaults;
    this.types = new Map();
  }

  wrap(org) {
    let t = this.types.get(org);
    if (t)
      return t;
    t = org.clone().flatten();
    t.validators = [];
    this.types.set(org, t);
    return t;
  }

  getFn(wrapped, options) {
    for (const o of wrapped.validators)
      if (isDeepStrictEqual(o.options, options))
        return o.fn;
  }

  setFn(wrapped, options, fn) {
    for (const o of wrapped.validators)
      if (isDeepStrictEqual(o.options, options)) {
        o.fn = fn;
        return;
      }
    wrapped.validators.push({options, fn});
  }

}

module.exports = GeneratorContext;
