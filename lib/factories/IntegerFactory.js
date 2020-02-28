'use strict';
const {coerceToInt, mapDistinct} = require('putil-varhelpers');
const {NumberFactory, IntegerFormats} = require('./NumberFactory');

class IntegerFactory extends NumberFactory {

  create(instance) {
    instance.options.format = 'int32';
  }

  normalizeAttribute(attr, v) {
    switch (attr) {
      case 'default':
      case 'minimum':
      case 'maximum':
      case 'multipleOf':
        return coerceToInt(v);
      case 'enum':
        if (!Array.isArray(v))
          throw new TypeError(`"${v}" is not an array value.`);
        return mapDistinct(v, coerceToInt);
      case 'format': {
        if (v && !IntegerFormats.includes(v))
          throw new TypeError(`"${v}" is not a valid integer format identifier.`);
        return v;
      }
    }
    return super.normalizeAttribute(attr, v);
  }

}

module.exports = {IntegerFactory};
