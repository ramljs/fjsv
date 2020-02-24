'use strict';

const {DataType} = require('./DataType');

const PROPERTY_NAME_PATTERN = /^([^?!]+)([?|!])?$/;
const REQUIRED_PROPERTY_PATTERN = /^([^?!]+)([?|!])?$/;

/**
 *
 * @class ObjectType
 */
class ObjectType extends DataType {

  create(instance, schema) {
    instance = super.create(instance, schema);
    if (schema.properties) {
      instance.properties = {};
      const library = this.library;
      const stack = library._stack;
      stack.push('properties');
      for (const [k, p] of Object.entries(schema.properties)) {
        const m = k.match(REQUIRED_PROPERTY_PATTERN);
        stack.push(m[1]);
        const sch = library.normalizeSchema(p);
        const t = library.getType(sch);
        t.propertyName = m[1];
        if (m[2] === '!')
          t.required = true;
        else if (m[2] === '?')
          t.required = false;
        else if (typeof p === 'object' && p.required != null)
          t.required = p.required;
        if (typeof t.required === 'string')
          t.required = t.required.split(/\s*,\s*/);
        instance.properties[m[1]] = t;
      }
      stack.pop();
    }
    return instance;
  }

  get(attr) {
    if (attr.startsWith('properties.') && this.properties) {
      const p = this.properties[attr.substring(11)];
      if (p)
        return p;
    }
    return super.get(attr);
  }

  normalizeSchema(schema) {
    const normalized = super.normalizeSchema(schema);
    const properties = normalized.properties;
    if (properties) {
      const stack = this.library._stack;
      stack.push('properties');
      normalized.properties = {};
      for (const [k, sch] of Object.entries(properties)) {
        const m = k.match(PROPERTY_NAME_PATTERN);
        stack.push(k);
        const v = this.library.normalizeSchema(sch);
        if (v !== undefined) {
          normalized.properties[m[1]] = v;
          if (m[2] === '!')
            v.required = true;
          if (m[2] === '?')
            v.required = false;
        }
        stack.pop();
      }
      stack.pop();
    }
    return normalized;
  }

}

module.exports = {ObjectType};
