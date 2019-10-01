'use strict';
const DataType = require('../DataType');

class UnionType extends DataType {

  constructor(library, def) {
    super(library, def);
    this.attributes.anyOf = undefined;
  }

  get anyOf() {
    return this.attributes.anyOf;
  }

  set anyOf(v) {
    if (!Array.isArray(v))
      throw new Error('"anyOf" attribute needs array value');
    if (v.length < 2)
      throw new Error('"anyOf" attribute must contain at least 2 items.');
    this.attributes.anyOf = v
        .map(x => this.library.get(x))
        .filter((v, i, a) => a.indexOf(v) === i);
  }

  assign(values, overwrite) {
    super.assign(values, overwrite);
    this._assignAttributes(['anyOf'], values, overwrite);
  }

  extend(library, def) {
    const t = this.anyOf[0].createNew(library);
    if (def)
      t.assign(def);
    t.type.push(this);
    return t;
  }

  flatten() {
    return this.anyOf.reduce((a, t) => {
      const tt = t.flatten();
      tt.forEach(x => super._copyTo(x, true));
      a.push(...tt);
      return a;
    }, []);
  }
}

module.exports = UnionType;
