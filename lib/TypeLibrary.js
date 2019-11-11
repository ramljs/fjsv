const SchemaError = require('./SchemaError');
const DataType = require('./DataType');

const SQUARE_BRACKETS_PATTERN = /^\[([^\]]+)]$/;

const InternalTypes = {
  'any': require('./types/AnyType'),
  'boolean': require('./types/BooleanType'),
  'number': require('./types/NumberType'),
  'string': require('./types/StringType'),
  'array': require('./types/ArrayType'),
  'object': require('./types/ObjectType'),
  'union': require('./types/UnionType'),
  'function': require('./types/FunctionType')
};

class TypeLibrary {

  constructor(options = {}) {
    this._internals = {};
    this.schemas = {};
    this._cache = {};
    this._stacks = [];
    this._unionTypeName = 'union';
    this._arrayTypeName = 'array';
    this._objectTypeName = 'object';
    this.defaults = options.defaults || {};
    this.defaults.type = this.defaults.type || 'any';
    this.lookupSchema = options.lookupSchema;
    Object.keys(InternalTypes).forEach(k =>
        this.addDataType(k, new InternalTypes[k]()));
  }

  addDataType(name, factory) {
    if (this._internals[name])
      throw new TypeError(`"${name}" already registered.`);
    this._internals[name] = new DataType(this, name, factory);
  }

  addSchema(name, schema) {
    if (arguments.length <= 1) {
      if (typeof name !== 'object')
        throw new TypeError(`You must provide object instance as first argument`);
      schema = name;
      name = schema.name;
    } else if (typeof schema === 'string')
      schema = {name, type: schema};
    else {
      if (typeof schema !== 'object')
        throw new TypeError(`Second argument must be an object`);
      schema = {...schema, name};
    }

    if (!(name && typeof name === 'string'))
      throw new Error('You must provide type name');

    if (this.schemas[schema.name])
      throw new Error(`Type "${schema.name}" already defined`);

    this.schemas[schema.name] = schema;
  }

  compile(schema, options = {}) {
    if (options.throwOnError === undefined && this.defaults.throwOnError)
      options.throwOnError = this.defaults.throwOnError;
    return this.get(schema)
        .compile(options);
  }

  get(schema) {
    if (!schema)
      throw new TypeError('Invalid argument');

    if (schema instanceof DataType)
      return schema;

    schema = this._normalizeSchema(schema);

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
          const t = this._cache[name] = this._internals[name].create(null);
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

    if (instance instanceof DataType) {
      throw new Error('not implemented');
    }

    const stack = this._stacks[this._stacks.length - 1];
    let types;
    if (Array.isArray(schema.type)) {
      let trgTypes = [];
      let isUnion;
      const processTypes = (types) =>{

      };
      schema.type.forEach((sch, idx) => {
        stack.push('type[' + idx + ']');
        const srct = this.get(sch);

        if (srct.typeName === this._unionTypeName) {
          if (!(srct.anyOf && srct.anyOf.length))
            return;
          if (!isUnion)
            trgTypes = trgTypes.map(t => t.clone());
          isUnion = true;
          const a = [trgTypes];
          const l = srct.anyOf.length;
          for (let i = 1; i < l; i++)
            a.push(trgTypes.map(t => t.clone()));

          srct.anyOf.forEach((t1, i) => {
            a[i].forEach(t2 => t2.merge(t1));
          });
          trgTypes = a.flat();
          stack.pop();
          return;
        }

        trgTypes.push(srct);
        stack.pop();
      });

      if (isUnion) {
        return this._createType(instance, {
          ...schema,
          type: 'union',
          anyOf: trgTypes
        });
      } else {
        const base = trgTypes[0];
        base.create(instance);
        instance.name = schema.name || instance.name;
        trgTypes.forEach((t, idx) => {
          stack.push('type[' + idx + ']');
          instance.merge(t);
          stack.pop();
        });
        instance.merge(schema);
        return instance;
      }
    }

    const base = this.get(schema.type);
    if (!(base instanceof DataType)) {
      stack.push('type');
      throw new Error('Circular reference detected.');
    }
    base.create(instance);
    instance.name = schema.name || instance.name;
    instance.merge(base);
    instance.merge(schema);
    return instance;
  }

  _normalizeSchema(schema) {
    if (schema instanceof DataType)
      return schema;
    if (typeof schema === 'string')
      return this._parseTypeName(schema);

    if (Array.isArray(schema.type)) {
      let modified;
      const y = schema.type.map(t => {
        const x = this._normalizeSchema(t);
        if (x !== t) {
          modified = true;
          return x;
        }
        return t;
      });
      if (y.length <= 1)
        schema = {...schema, type: y[0]};
      else if (modified)
        schema = {...schema, type: y};
    } else if (schema.type) {
      const x = this._normalizeSchema(schema.type);
      if (x !== schema.type) {
        if (typeof schema.type === 'string')
          Object.assign(schema, x);
        else
          schema = {...schema, type: x};
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

module.exports = TypeLibrary;
