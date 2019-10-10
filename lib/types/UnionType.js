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
    this.attributes.anyOf = v;
  }

  assign(values, overwrite) {
    for (const k of Object.keys(values)) {
      if (values[k] !== undefined && !(k === 'name' || k === 'type'))
        this.attributes[k] = values[k];
    }
    super.assign(values, overwrite);
    this._assignAttributes(['anyOf'], values, overwrite);
  }

  bake() {
    if (this._baking)
      return this;
    this._baking = true;
    try {
      super.bake();
      if (this.anyOf)
        this.anyOf = this.anyOf.reduce((a, t) => {
          a.push((t instanceof DataType ? t : this.library.get(t)).bake());
          return a;
        }, []);
    } finally {
      delete this._baking;
    }
    return this;
  }

  _flatten(target, name) {
    if (!this.anyOf)
      return target;

    const anyOf = this.anyOf.map((x) =>
        x instanceof DataType ? x : this.library.get(x))
        .filter((v, i, a) => a.indexOf(v) === i);

    const old = Array.isArray(target) ?
        /* istanbul ignore next */ target :
        target ? [target] : [];

    const targets = [];
    const flattenType = (t, trg) => {
      const x = t._flatten(trg, name);
      const a = Array.isArray(x) ? x : [x];
      a.forEach(t => t.assign({...this.attributes, name: undefined}, true));
      a.forEach(t => t.assign({name: this.name}, false));
      a.forEach(t => t.type = []);
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

  _generateValidationCode(options, context) {
    const data = super._generateValidationCode(options, context);
    data.variables.subValidators = this.anyOf.map(t => {
      return context.wrap(t)._generateValidateFunction({
        ...options,
        isUnion: true
      }, context);
    });

    data.code += `
    let _error = undefined;
    for (const fn of subValidators) {
      const v = fn(value, path, (e) => Failed, ctx);
      if (v !== Failed)
        return v;
    }
    return error({
      message: path +' does not match any of expected types',
      errorType: 'no-type-matched',
      path
    });
    
    `;
    return data;
  }

}

module.exports = UnionType;
