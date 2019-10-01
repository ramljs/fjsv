'use strict';
const NumberType = require('./NumberType');

const IntegerFormats = NumberType.IntegerFormats;

class IntegerType extends NumberType {

  get default() {
    return this.attributes.default;
  }

  set default(v) {
    if (v == null) {
      this.attributes.default = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid integer value for default attribute`);
    this.attributes.default = x;
  }

  get enum() {
    return this.attributes.enum;
  }

  set enum(v) {
    if (v && !Array.isArray(v))
      throw new TypeError('Array type required for "enum" attribute');
    this.attributes.enum = v == null ? v : v.map(x => parseInt(x, 10));
  }

  get format() {
    return this.attributes.format;
  }

  set format(v) {
    if (v && !IntegerFormats.includes(v))
      throw new TypeError(`Unknown integer format (${v})`);
    this.attributes.format = v;
  }

  get minimum() {
    return this.attributes.minimum;
  }

  set minimum(v) {
    if (v == null) {
      this.attributes.minimum = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for minimum attribute`);
    this.attributes.minimum = x;
  }

  get maximum() {
    return this.attributes.maximum;
  }

  set maximum(v) {
    if (v == null) {
      this.attributes.maximum = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for maximum attribute`);
    this.attributes.maximum = x;
  }

  get multipleOf() {
    return this.attributes.multipleOf;
  }

  set multipleOf(v) {
    if (v == null) {
      this.attributes.multipleOf = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for multipleOf attribute`);
    this.attributes.multipleOf = x;
  }

  _getFormat() {
    return this.format || 'int';
  }

}

module.exports = IntegerType;
