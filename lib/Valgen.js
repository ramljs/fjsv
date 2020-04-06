const {DataType} = require('./DataType');
const {ObjectType} = require('./ObjectType');
const {ArrayType} = require('./ArrayType');
const {UnionType} = require('./UnionType');
const {AnyFactory} = require('./factories/AnyFactory');
const {BooleanFactory} = require('./factories/BooleanFactory');
const {NumberFactory} = require('./factories/NumberFactory');
const {IntegerFactory} = require('./factories/IntegerFactory');
const {StringFactory} = require('./factories/StringFactory');
const {ArrayFactory} = require('./factories/ArrayFactory');
const {ObjectFactory} = require('./factories/ObjectFactory');
const {UnionFactory} = require('./factories/UnionFactory');
const {DateFactory} = require('./factories/DateFactory');
const {NilFactory} = require('./factories/NilFactory');
const {FunctionFactory} = require('./factories/FunctionFactory');
const {Base64Factory} = require('./factories/Base64Factory');
const {SchemaError} = require('./SchemaError');

const SQUARE_BRACKETS_PATTERN = /^\[([^\]]+)]$/;

class Valgen {

  constructor(options = {}) {
    this._instances = {};
    this._lookupSchemas = {};
    this._stacks = [];
    this._idSeq = 0;
    this.baseTypes = {};
    this.defaultType = options.defaultType;
    this.schemaLookup = options.schemaLookup;
    this.schemas = {};
    this.throwOnError = options.throwOnError;
    this.baseTypes.object = new ObjectType(this, 'object', new ObjectFactory());
    this.baseTypes.array = new ArrayType(this, 'array', new ArrayFactory());
    this.baseTypes.union = new UnionType(this, 'union', new UnionFactory());
    this.define('any', new AnyFactory());
    this.define('boolean', new BooleanFactory());
    this.define('number', new NumberFactory());
    this.define('string', new StringFactory());
    this.define('integer', new IntegerFactory());
    this.define('nil', new NilFactory());
    this.define('function', new FunctionFactory());
    this.define('base64', new Base64Factory());
    this.define('datetime', new DateFactory({
      dateFormats: {},
      format: 'datetime'
    }));
    this.define('date', new DateFactory({
      dateFormats: {},
      format: 'date'
    }));
    this.define('time', new DateFactory({
      dateFormats: {},
      format: 'time'
    }));
  }

  addSchema(name, schema) {
    if (arguments.length <= 1) {
      if (typeof name !== 'object')
        throw new TypeError(`You must provide object instance as first argument.`);
      schema = name;
      name = schema.name;
    } else if (typeof schema === 'string')
      schema = this._parseTypeName(schema);
    else {
      if (typeof schema !== 'object')
        throw new TypeError(`Second argument must be an object or string.`);
      schema = {...schema, name};
    }

    if (!(name && typeof name === 'string'))
      throw new Error('You must provide type name');

    if (this.schemas[schema.name])
      throw new Error(`Schema "${schema.name}" already defined.`);

    this.schemas[name] = schema;
  }

  clearCache() {
    this._instances = {};
    this._lookupSchemas = {};
    Object.keys(this.baseTypes).forEach(k => this.baseTypes[k]._fnCache = {});
  }

  define(typeName, factory) {
    if (!factory)
      delete this.baseTypes[typeName];
    return this.baseTypes[typeName] = new DataType(this, typeName, factory);
  }

  generate(schema, options = {}) {
    return this.getType(schema)
        .generate(options);
  }
  
  normalizeSchema(schema) {
    const baseTypeName = this._getBaseTypeName(schema);
    const baseType = this.baseTypes[baseTypeName];
    if (!baseType)
      throw new Error(`Unable to determine base type.`);

    if (typeof schema === 'string') {
      schema = this._parseTypeName(schema);
    } else schema = {...schema};

    if (typeof schema === 'string')
      schema = {type: schema};
    else {
      if (schema.type) {
        if (Array.isArray(schema.type)) {
          schema.type = schema.type.map(t => {
            if (typeof t === 'string')
              return this._parseTypeName(t);
            return this.normalizeSchema(t);
          });
          if (schema.type.length <= 1)
            schema.type = schema.type[0];
        } else {
          const x = this.normalizeSchema(schema.type);
          if (x !== schema.type) {
            Object.assign(schema, x);
          }
        }
      }
      if (!schema.type)
        schema.type = baseTypeName;
    }

    return baseType.normalizeSchema(schema);
  }

  getType(schemaOrName) {
    if (!schemaOrName)
      throw new TypeError('Invalid argument');

    if (schemaOrName instanceof DataType)
      return schemaOrName;

    let name;
    let cacheId;
    let schema;
    let baseType;
    if (typeof schemaOrName === 'string') {
      schema = this._parseTypeName(schemaOrName);
      if (typeof schema === 'string') {
        name = schema;
        // Return previously cached type
        const t = this._instances[name];
        if (t) return t;

        // Check if it is an internal type
        baseType = this.baseTypes[name];
        if (!baseType) {
          // Lookup for schema by name
          schema = this.schemas[name] || this._lookupForSchema(name);
          if (!schema || schema === name)
            throw new TypeError(`Unknown type schema "${name}"`);
          if (typeof schema === 'string')
            schema = {name, type: schema};
        }

      } else
        name = schema.name;
      cacheId = name;
    } else {
      schema = schemaOrName;
      name = schema.name;
    }

    const stack = [name || '(anonymous)'];
    this._stacks.push(stack);
    try {
      if (!baseType) {
        const baseTypeName = this._getBaseTypeName(schema);
        baseType = this.baseTypes[baseTypeName];
      }
      const instance = {id: ++this._idSeq, name};
      if (cacheId)
        this._instances[cacheId] = instance;
      baseType.create(instance, schema);
      if (baseType.factory.create)
        baseType.factory.create(instance);
      return instance;
    } catch (e) {
      delete this._instances[name];
      if (e instanceof SchemaError)
        throw e;
      throw new SchemaError(e, stack);
    } finally {
      this._stacks.pop();
    }
  }

  setOption(key, v) {
    const m = key.match(/^([^.]+)(?:\.(.+))?$/);
    if (m) {
      const t = this.baseTypes[m[1]];
      if (!t)
        return;
      if (v === undefined)
        delete t.options[m[2]];
      else
        t.options[m[2]] = v;
    }
  }

  _lookupForSchema(name) {
    let schema = this.schemas[name] || this._lookupSchemas[name];
    if (schema)
      return schema;
    schema = this.schemaLookup && this.schemaLookup(name);
    if (schema)
      return this._lookupSchemas[name] = schema;
  }

  _getBaseTypeName(schema) {
    const stack = [];
    const getTypeName = (schema) => {
      if (typeof schema === 'string')
        schema = this._parseTypeName(schema);

      if (typeof schema === 'string') {
        if (stack.includes(schema))
          throw new Error('Circular reference detected');
        const t = this.baseTypes[schema] || this._instances[schema];
        if (t)
          return t.typeName;
        const sch = this._lookupForSchema(schema);
        if (!sch || sch === schema)
          throw new Error(`Unknown type "${schema}"`);
        stack.push(schema);
        return getTypeName(sch);
      }
      let h = (Array.isArray(schema.type) ? schema.type[0] : schema.type);
      if (!h) {
        if (schema.items)
          h = 'array';
        else if (schema.properties)
          h = 'object';
        else if (schema.anyOf)
          h = 'union';
        else h = this.defaultType || 'any';
      }
      return getTypeName(h);
    };
    return getTypeName(schema);
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
        type: 'union',
        anyOf: v.split(/\s*\|\s*/).map(x => this._parseTypeName(x))
      };
    }
    if (v.endsWith('[]')) {
      const n = this._parseTypeName(v.substring(0, v.length - 2));
      return {
        type: 'array',
        items: n
      };
    }
    if (v.endsWith('{}')) {
      const n = this._parseTypeName(v.substring(0, v.length - 2));
      return {
        type: 'object',
        additionalProperties: n
      };
    }
    return v;
  }

  get _stack() {
    return this._stacks[this._stacks.length - 1];
  }

}

module.exports = {Valgen};
