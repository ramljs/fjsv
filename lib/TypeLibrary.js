'use strict';

const DataType = require('./DataType');
const AnyType = require('./types/AnyType');
const ArrayType = require('./types/ArrayType');
const BooleanType = require('./types/BooleanType');
const NumberType = require('./types/NumberType');
const ObjectType = require('./types/ObjectType');
const StringType = require('./types/StringType');
const DateTimeType = require('./types/DateTimeType');
const DateOnlyType = require('./types/DateOnlyType');
const TimeOnlyType = require('./types/TimeOnlyType');
const DateTimeOnlyType = require('./types/DateTimeOnlyType');
const IntegerType = require('./types/IntegerType');
const NilType = require('./types/NilType');
const UnionType = require('./types/UnionType');
const {normalizeTypeSchema, parseTypeName} = require('./helpers');

const TYPESET = {
  RAML_1_0: 'RAML_1_0'
};

class TypeLibrary {

  constructor(options = {}) {
    this.onTypeLookup = options.onTypeLookup;
    this.defaults = {
      type: options.defaults && options.defaults.type,
      required: options.defaults && options.defaults.required,
      additionalProperties: options.defaults &&
          options.defaults.additionalProperties
    };
    this.types = {};
    this.schema = {};
    for (const [name, Clazz] of Object.entries({
      'any': AnyType,
      'boolean': BooleanType,
      'number': NumberType,
      'string': StringType,
      'array': ArrayType,
      'object': ObjectType,
      'union': UnionType
    })) {
      this.register(name, Clazz);
    }
    if (options.typeSet === TYPESET.RAML_1_0) {
      for (const [name, Clazz] of Object.entries({
        'integer': IntegerType,
        'nil': NilType,
        'datetime': DateTimeType,
        'datetime-only': DateTimeOnlyType,
        'date-only': DateOnlyType,
        'time-only': TimeOnlyType
      })) {
        this.register(name, Clazz);
      }
    }
  }

  register(name, Clazz) {
    if (!(Clazz.prototype instanceof DataType))
      throw new TypeError('Class must be extended from DataType');
    const t = this.types[name] = new Clazz();
    t.name = name;
  }

  add(def) {
    if (typeof def !== 'object')
      throw new TypeError(`You must provide object instance as first argument`);

    if (!(def.name && typeof def.name === 'string'))
      throw new Error('You must provide type name');

    if (this.types[def.name])
      throw new Error(`Type "${def.name}"`);

    this.schema[def.name] = {...def};
  }

  get(def) {
    if (!def)
      throw new TypeError('Invalid argument');

    // If requesting for a type by its name
    if (typeof def === 'string' &&
        typeof (def = parseTypeName(def)) === 'string') {
      // Return pre-created type instance
      if (this.types[def])
        return this.types[def];
      // Get type schema
      let v = this.schema[def] ||
          (this.onTypeLookup && this.onTypeLookup(def));
      if (!v || v === def)
        throw new Error(`Unknown type "${def}"`);
      if (typeof v === 'string')
        v = normalizeTypeSchema(v, this.defaults.type);
      v = {...v, name: def};
      const t = this.get({...v, name: def});
      return this.types[t.name] = t;
    }

    // If requesting for a type by schema
    def = normalizeTypeSchema(def, this.defaults.type);

    if (typeof def.type === 'string') {
      const derivedType = this.get(def.type);
      const t = derivedType.createNew(this, def);
      t.type.push(derivedType);
      return t;
    }

    if (Array.isArray(def.type)) {
      const types = def.type.map(t => this.get(t));
      const t = types[0].createNew(this);
      t.assign(def);
      t.type.push(...types);
      return t;
    }

    const derivedType = def.type instanceof DataType ?
        def.type : this.get(def.type);
    const t = derivedType.createNew(this);
    t.assign(def);
    t.type.push(derivedType);
    return t;
  }

}

TypeLibrary.TYPESET = TYPESET;

module.exports = TypeLibrary;
