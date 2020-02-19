const {SchemaError} = require('./SchemaError');
const {DataType} = require('./DataType');
const {AnyType} = require('./factories/AnyType');
const {BooleanType} = require('./factories/BooleanType');
const {NumberType} = require('./factories/NumberType');
const {StringType} = require('./factories/StringType');
const {ArrayType} = require('./factories/ArrayType');
const {ObjectType} = require('./factories/ObjectType');
const {UnionType} = require('./factories/UnionType');
const {coalesce} = require('./helpers');

const SQUARE_BRACKETS_PATTERN = /^\[([^\]]+)]$/;

class TypeLibrary {

  constructor(options = {}) {
    this._uses = {};
    this._internals = {};
    this._cache = {};
    this._stacks = [];
    this._unionTypeName = 'union';
    this._arrayTypeName = 'array';
    this._objectTypeName = 'object';
    this.schemas = {};
    this.defaults = options.defaults || {};
    this.defaults.type = coalesce(
        options.defaults && options.defaults.type, 'any');
    this.defaults.propertiesRequired = coalesce(
        options.defaults && options.defaults.propertiesRequired, true);
    this.lookupSchema = options.lookupSchema;
    this.define('any', new AnyType());
    this.define('boolean', new BooleanType());
    this.define('number', new NumberType());
    this.define('string', new StringType());
    this.define('array', new ArrayType());
    this.define('object', new ObjectType());
    this.define('union', new UnionType());
  }

  use(name, library) {
    if (!(library instanceof TypeLibrary))
      throw new TypeError(`Second argument must be a TypeLibrary instance.`);
    if (this._uses[name])
      return;
    this._uses[name] = library;
  }

  define(name, factory) {
    if (this._internals[name])
      throw new TypeError(`Data type "${name}" already registered.`);
    this._internals[name] = new DataType(this, name, factory);
  }

  add(name, schema) {
    if (arguments.length <= 1) {
      if (typeof name !== 'object')
        throw new TypeError(`You must provide object instance as first argument.`);
      schema = name;
      name = schema.name;
    } else if (typeof schema === 'string')
      schema = {name, type: schema};
    else {
      if (typeof schema !== 'object')
        throw new TypeError(`Second argument must be an object or string.`);
      schema = {...schema, name};
    }

    if (!(name && typeof name === 'string'))
      throw new Error('You must provide type name');

    if (this.schemas[schema.name])
      throw new Error(`Schema "${schema.name}" already defined.`);

    this.schemas[schema.name] = schema;
  }

  compile(schema, options = {}) {
    options.throwOnError = coalesce(
        options.throwOnError, this.defaults.throwOnError);
    return this.get(schema)
        .compile(options);
  }

  get(schema) {
    if (!schema)
      throw new TypeError('Invalid argument');

    if (schema instanceof DataType)
      return schema;

    schema = this._normalizeSchema(schema);

    if (typeof schema === 'object' && !Array.isArray(schema)) {
      const keys = Object.keys(schema);
      if (keys.length === 1 && typeof schema.type === 'string')
        schema = schema.type;
    }

    if (typeof schema === 'string' && this._cache[schema])
      return this._cache[schema];

    let stack;
    let instance;
    try {
      // If requesting for a type by its name
      if (typeof schema === 'string') {
        const name = schema;

        if (this._internals[name]) {
          stack = [schema];
          this._stacks.push(stack);
          const t = this._cache[name] = this._internals[name].extend(null);
          t.name = name;
          return t;
        } else {
          schema = this.schemas[name] ||
              (this.lookupSchema && this.lookupSchema(name));
          if (!schema || schema === name) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error(`Unknown type "${name}"`);
          }
          if (typeof schema === 'string')
            return this.get(schema);
          schema = this._normalizeSchema({...schema, name});
        }
        instance = this._cache[name] = {};
      } else instance = {};

      if (schema.name || !this._stacks.length) {
        stack = [schema.name || 'anonymous'];
        this._stacks.push(stack);
      }

      return this._createType(instance, schema);
    } catch (e) {
      if (e instanceof SchemaError)
        throw e;
      const stack = this._stacks[this._stacks.length - 1];
      throw new SchemaError(e, stack);
    } finally {
      if (stack)
        this._stacks.pop();
    }

  }

  reset() {
    this._cache = {};
  }

  _createType(instance, schema) {
    const stack = this._stacks[this._stacks.length - 1];
    if (Array.isArray(schema.type)) {
      const mergeType = (sch, trgTypes) => {
        const typ = sch instanceof DataType ? sch : this.get(sch);
        if (typ.typeName === this._unionTypeName) {
          const arr = [trgTypes.slice()];
          for (let k = 1; k < typ.anyOf.length; k++)
            arr.push(trgTypes.map(tt => tt.clone()));

          typ.anyOf.forEach((t, i) => {
            mergeType(t, arr[i]);
          });
          arr.forEach((a, i) => i && trgTypes.push(...a));

        } else {
          if (!trgTypes.length)
            trgTypes.push(typeof sch === 'object' ? typ : typ.clone());
          else trgTypes.forEach(t => t.assign(typ));
        }
      };
      const trgTypes = [];
      schema.type.forEach((sch, idx) => {
        stack.push('type[' + idx + ']');
        mergeType(sch, trgTypes);
        stack.pop();
      });

      if (trgTypes.length > 1) {
        return this._createType(instance, {
          ...schema,
          type: 'union',
          anyOf: trgTypes
        });
      } else {
        const base = trgTypes[0];
        base.extend(instance);
        instance.name = schema.name || instance.name;
        trgTypes.forEach((t, idx) => {
          stack.push('type[' + idx + ']');
          instance.assign(t);
          stack.pop();
        });
        instance.assign(schema);
        return instance;
      }
    }

    const base = this.get(schema.type);
    if (!(base instanceof DataType)) {
      stack.push('type');
      throw new Error('Circular reference detected.');
    }
    base.extend(instance);
    instance.name = schema.name || instance.name;
    instance.assign(base);
    instance.assign(schema);
    return instance;
  }

  _normalizeSchema(schema) {
    if (schema instanceof DataType)
      return schema;
    if (typeof schema === 'string')
      return this._parseTypeName(schema);

    if (Array.isArray(schema.type)) {
      const y = schema.type.map(t => this._normalizeSchema(t));
      if (y.length <= 1)
        schema = {...schema, type: y[0]};
    } else if (schema.type) {
      const x = this._normalizeSchema(schema.type);
      if (x !== schema.type) {
        Object.assign(schema, x);
      }
    }

    if (!schema.type)
      schema = {
        ...schema,
        type: (schema.properties ? this._objectTypeName :
            (schema.anyOf ? this._unionTypeName :
                (schema.items ? this._arrayTypeName : ''))) ||
            this.defaults.type
      };
    return schema;
  }

  _parseTypeName(v) {
    let m = v.match(SQUARE_BRACKETS_PATTERN);
    if (m)
      v = m[1];
    if (v.includes(',')) {
      return {
        type: v.split(/\s*,\s*/).map(x => this._parseTypeName(x))
      };
    }
    if (v.includes('|')) {
      return {
        type: this._unionTypeName,
        anyOf: v.split(/\s*\|\s*/).map(x => this._parseTypeName(x))
      };
    }
    if (v.endsWith('[]')) {
      const n = this._parseTypeName(v.substring(0, v.length - 2));
      return {
        type: this._arrayTypeName,
        items: n
      };
    }
    if (v.endsWith('{}')) {
      const n = this._parseTypeName(v.substring(0, v.length - 2));
      return {
        type: this._objectTypeName,
        additionalProperties: n
      };
    }
    return v;
  }

}

module.exports = {TypeLibrary};
