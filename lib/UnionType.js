'use strict';
const merge = require('putil-merge');
const {DataType} = require('./DataType');

/**
 *
 * @class UnionType
 */
class UnionType extends DataType {

  create(instance, schema) {
    instance = super.create(instance, schema);
    const library = this.library;
    const stack = library._stack;
    stack.push('anyOf');

    const additionalAttributes = merge({}, schema, {
      filter: (o, n) => !['name', 'type', 'anyOf'].includes(n)
    });
    const hasAdditionalAttributes = Object.keys(additionalAttributes).length;
    instance.anyOf = schema.anyOf.map(x => {
      if (hasAdditionalAttributes) {
        const sch = typeof x === 'string' ?
            {type: x, ...additionalAttributes} : {...x, ...additionalAttributes};
        return library.getType(sch);
      }
      return library.getType(x);
    });

    stack.pop();
    return instance;
  }

  get(attr) {
    if (attr === 'anyOf' && this.anyOf)
      return this.anyOf;
    return super.get(attr);
  }

  normalizeSchema(schema) {
    const normalized = super.normalizeSchema(schema);
    const items = normalized.items;
    if (items) {
      const stack = this.library._stack;
      stack.push('items');
      normalized.items = this.library.normalizeSchema(items);
      stack.pop();
    }
    return normalized;
  }

}

module.exports = {UnionType};
