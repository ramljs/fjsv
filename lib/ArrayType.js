'use strict';

const {DataType} = require('./DataType');

/**
 *
 * @class ArrayType
 */
class ArrayType extends DataType {

  create(instance, schema) {
    instance = super.create(instance, schema);
    if (schema.items) {
      const library = this.library;
      const stack = library._stack;
      stack.push('items');
      instance.items = library.getType(schema.items);
      stack.pop();
    }
    return instance;
  }

  get(attr) {
    if (attr === 'items' && this.items)
      return this.items;
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

module.exports = {ArrayType};
