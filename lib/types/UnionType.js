'use strict';
const DataType = require('../DataType');

class UnionType extends DataType {

  constructor(library) {
    super(library);
    this.attributes.anyOf = undefined;
  }

  get anyOf() {
    return this.attributes.anyOf;
  }

  set anyOf(v) {
    if (!Array.isArray(v))
      throw new Error('Array type required for "anyOf" attribute');
    if (v.length < 2)
      throw new Error('"anyOf" attribute must contain at least 2 items.');
    this.attributes.anyOf = v
        .map(x => x instanceof DataType ? x : this.library.get(x))
        .filter((v, i, a) => a.indexOf(v) === i);
  }

  assign(values, overwrite) {
    for (const k of Object.keys(values)) {
      if (values[k] !== undefined && !(k === 'name' || k === 'type'))
        this.attributes[k] = values[k];
    }
    super.assign(values, overwrite);
    this._assignAttributes(['anyOf'], values, overwrite);
  }

  _flatten(target, name) {
    const anyOf = this.anyOf;
    /* istanbul ignore next */
    if (!(anyOf && anyOf.length))
      return target;

    const old = Array.isArray(target) ?
        /* istanbul ignore next */ target :
        target ? [target] : [];

    const targets = [];
    const flattenType = (t, trg) => {
      const x = t._flatten(trg, name);
      const a = Array.isArray(x) ? x : [x];
      a.forEach(t => t.assign({...this.attributes, name: undefined}, true));
      a.forEach(t => t.assign({name: this.name}, false));
      if (Array.isArray(x))
        targets.push(...x);
      else targets.push(x);
    };
    anyOf.forEach((t, i) => {
      if (old.length) {
        old.forEach(t2 => {
          t2 = i === anyOf.length - 1 ? t2 : t2.clone();
          t2.isExtension = true;
          flattenType(t, t2);
        });
      } else {
        flattenType(t, null);
      }
    });
    return targets;
  }

  _generateValidateFunction(options) {
    const functions = this.anyOf.map(t => t._generateValidateFunction({
      ...options,
      isUnion: true
    }));
    return (value, path, error, ctx) => {
      let _error = undefined;
      for (const fn of functions) {
        const v = fn(value, path,
            /* istanbul ignore next */
            (e) => {
              _error = _error || e;
            }, ctx);
        if (v !== undefined)
          return v;
      }
      /* istanbul ignore next */
      error(_error || {
        message: 'Value does not match any of union types',
        errorType: 'no-type-matched',
        path
      });
    };
  }

}

module.exports = UnionType;
